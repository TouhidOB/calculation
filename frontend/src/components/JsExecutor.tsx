"use client"

/**
 * JS Sandbox Executor — runs Django template JS in a sandboxed iframe.
 * Uses original template HTML/CSS when available for high-fidelity rendering,
 * with resilient input matching, semantic DOM proxying, and guaranteed error recovery.
 */

import { useEffect, useRef, useCallback } from "react"

export interface SandboxResult {
  html: string
  text: string
}

interface JsExecutorProps {
  calcId: string
  fields: Array<{
    name: string
    type: string
    value: string | number
  }>
  onResult: (result: SandboxResult) => void
  onError: (error: string) => void
  trigger: number // increment to re-run
}

interface CalcRuntime {
  script: string
  html?: string
  css?: string
}

function JsExecutor({ calcId, fields, onResult, onError, trigger }: JsExecutorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const runtimeCache = useRef<CalcRuntime | null>(null)
  const isExecuting = useRef(false)

  const execute = useCallback(async () => {
    if (trigger === 0 || isExecuting.current) return
    isExecuting.current = true

    try {
      // 1. Fetch script + template runtime if not cached
      if (!runtimeCache.current) {
        const res = await fetch(`/api/calculators/${calcId}/script/`)
        if (!res.ok) {
          if (res.status === 404) {
            onError("Calculator script not found.")
            isExecuting.current = false
            return
          }
          throw new Error(`Failed to load calculator engine (${res.status})`)
        }
        const data = await res.json()
        runtimeCache.current = {
          script: data.script || "",
          html: data.html || "",
          css: data.css || "",
        }
      }

      const runtime = runtimeCache.current
      if (!runtime || !runtime.script) {
        onError("No computational script available for this calculator.")
        isExecuting.current = false
        return
      }

      const iframe = iframeRef.current
      if (!iframe) {
        onError("Sandboxed runner unavailable.")
        isExecuting.current = false
        return
      }

      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (!doc) {
        onError("Cannot access runner sandbox.")
        isExecuting.current = false
        return
      }

      // Build DOM: Use original template HTML if available; otherwise fallback
      let templateHtml = runtime.html || ""
      if (!templateHtml) {
        const inputElements: string[] = []
        for (const f of fields) {
          const val = String(f.value ?? "").replace(/"/g, "&quot;")
          const n = f.name.toLowerCase()
          const extraClasses = []
          if (n.includes("income") || n.includes("salary") || n.includes("budget")) extraClasses.push("income")
          if (n.includes("debt") || n.includes("expense")) extraClasses.push("debts")
          if (n.includes("rate") || n.includes("interest") || n.includes("apr")) extraClasses.push("rate")
          if (n.includes("term") || n.includes("year") || n.includes("period") || n.includes("duration")) extraClasses.push("term")
          if (n.includes("loan") || n.includes("price") || n.includes("amount") || n.includes("principal")) extraClasses.push("loan-amount", "principal")

          const classAttr = extraClasses.length > 0 ? ` class="${extraClasses.join(" ")}"` : ""

          if (f.type === "select") {
            inputElements.push(
              `<select id="${f.name}" name="${f.name}"${classAttr}><option value="${val}" selected>${val}</option></select>`
            )
          } else {
            inputElements.push(
              `<input type="${f.type === "number" ? "number" : "text"}" id="${f.name}" name="${f.name}" value="${val}"${classAttr}>`
            )
          }
        }
        templateHtml = `
          <form id="${calcId}-form" class="calc-form mort-form loan-form">
            ${inputElements.join("\n")}
            <div id="loan-list"></div>
            <button type="submit" id="calculate-btn">Calculate</button>
            <button type="button" id="loan-add" class="d-none">Add</button>
          </form>
          <div id="results-ui" class="result-area"></div>
          <div id="results-container" class="result-area"></div>
          <div id="result" class="result-area"></div>
          <div id="output" class="result-area"></div>
          <div id="mort-result" class="result-area"></div>
          <div id="loan-summary" class="result-area"></div>
          <table id="mort-table" class="d-none"><tbody id="mort-body"></tbody></table>
          <canvas id="mort-chart" class="d-none" width="400" height="200"></canvas>
          <canvas id="loan-chart" class="d-none" width="400" height="200"></canvas>
          <div id="placeholder-ui" class="d-none"></div>
          <div id="error-ui" class="d-none alert alert-danger"></div>
        `
      }

      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { padding: 12px; margin: 0; font-size: 14px; color: #0f172a; line-height: 1.5; background: #ffffff; }
    .d-none { display: none !important; }
    .alert-danger { background: #fef2f2; color: #991b1b; padding: 10px 14px; border-radius: 8px; border: 1px solid #fecaca; margin: 10px 0; }
    .alert-info { background: #eff6ff; color: #1e40af; padding: 10px 14px; border-radius: 8px; border: 1px solid #bfdbfe; margin: 10px 0; }
    .alert-success { background: #f0fdf4; color: #166534; padding: 10px 14px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left; }
    th { background: #f8fafc; font-weight: 700; }
    ${runtime.css || ""}
  </style>
</head>
<body>
  <div id="calc-error-box" class="alert alert-danger d-none"></div>
  ${templateHtml}
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script>
    // 1. Alert trap
    window.alert = function(msg) {
      console.warn("[CALC_ALERT]", msg);
      var box = document.getElementById("calc-error-box");
      if (!box) {
        box = document.createElement("div");
        box.id = "calc-error-box";
        box.className = "alert alert-danger";
        document.body.prepend(box);
      }
      box.textContent = String(msg);
      box.style.display = "block";
      box.classList.remove("d-none");
    };

    // 2. Chart fallback if CDN is unreachable
    if (typeof window.Chart === 'undefined') {
      window.Chart = function(ctx, config) { 
        this.destroy = function(){}; 
        this.update = function(){}; 
        this.data = config ? (config.data || {}) : {}; 
      };
      window.Chart.register = function() {};
      window.Chart.defaults = {};
      window.Chart.plugins = {};
    }

    // 3. MathJax stub
    window.MathJax = {
      typesetPromise: function() { return Promise.resolve(); },
      typeset: function() {},
      startup: { ready: function() {} }
    };

    // 4. Smart DOM Proxies (using original native methods to prevent recursion)
    var _origGetById = document.getElementById.bind(document);
    var _origQuerySelector = document.querySelector.bind(document);
    var _origQuerySelectorAll = document.querySelectorAll.bind(document);

    document.getElementById = function(id) {
      var el = _origGetById(id);
      if (el) return el;
      if (!id) return null;
      var lowerId = String(id).toLowerCase();

      // Form alias
      if (lowerId.includes("form")) {
        var anyForm = _origQuerySelector("form");
        if (anyForm) return anyForm;
      }

      // Input semantic fallback
      var allInputs = _origQuerySelectorAll("input, select, textarea");
      var normId = lowerId.replace(/[-_]/g, "");
      for (var i = 0; i < allInputs.length; i++) {
        var inp = allInputs[i];
        var inpNorm = (inp.id || inp.name || "").toLowerCase().replace(/[-_]/g, "");
        if (inpNorm && (inpNorm === normId || inpNorm.includes(normId) || normId.includes(inpNorm))) {
          return inp;
        }
      }

      // Common semantic categories
      if (/principal|price|amount|loan|balance|p-input/i.test(id)) {
        for (var j = 0; j < allInputs.length; j++) {
          if (/price|amount|principal|loan|balance/i.test(allInputs[j].id || allInputs[j].name || "")) return allInputs[j];
        }
      }
      if (/rate|interest|apr|r-input/i.test(id)) {
        for (var j = 0; j < allInputs.length; j++) {
          if (/rate|interest|apr/i.test(allInputs[j].id || allInputs[j].name || "")) return allInputs[j];
        }
      }
      if (/term|year|period|tenure|amort|t-input/i.test(id)) {
        for (var j = 0; j < allInputs.length; j++) {
          if (/term|year|period|tenure|amort/i.test(allInputs[j].id || allInputs[j].name || "")) return allInputs[j];
        }
      }
      if (/budget|income|salary/i.test(id)) {
        for (var j = 0; j < allInputs.length; j++) {
          if (/budget|income|salary/i.test(allInputs[j].id || allInputs[j].name || "")) return allInputs[j];
        }
      }
      if (/weight/i.test(id)) {
        for (var j = 0; j < allInputs.length; j++) {
          if (/weight/i.test(allInputs[j].id || allInputs[j].name || "")) return allInputs[j];
        }
      }

      // Auto-create UI containers so scripts never throw null errors
      if (/result|output|summary|error|placeholder|table|chart|list|box/i.test(id)) {
        var tag = /table/i.test(id) ? "table" : (/chart/i.test(id) ? "canvas" : "div");
        var dummy = document.createElement(tag);
        dummy.id = id;
        dummy.className = /error/i.test(id) ? "d-none" : "result-area";
        document.body.appendChild(dummy);
        return dummy;
      }
      return null;
    };

    document.querySelector = function(sel) {
      try {
        var el = _origQuerySelector(sel);
        if (el) return el;
      } catch(e) {}
      if (typeof sel === "string") {
        if (sel.includes(".mort-form") || sel.includes(".calc-form")) {
          return _origQuerySelector("form") || document.body;
        }
        if (sel.startsWith(".")) {
          var cls = sel.slice(1).toLowerCase();
          var inputs = _origQuerySelectorAll("input, select");
          for (var k = 0; k < inputs.length; k++) {
            var n = (inputs[k].name || inputs[k].id || "").toLowerCase();
            if (n.includes(cls)) return inputs[k];
          }
        }
      }
      return null;
    };

    document.querySelectorAll = function(sel) {
      try {
        var list = _origQuerySelectorAll(sel);
        if (list && list.length > 0) return list;
      } catch(e) {}
      if (typeof sel === "string" && (sel.includes(".mort-form") || sel.includes(".calc-form"))) {
        return _origQuerySelectorAll("form");
      }
      return _origQuerySelectorAll(sel);
    };

    // Minimal jQuery shim
    window.$ = window.jQuery = function(sel) {
      var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
      return {
        val: function(v) { if (v !== undefined && el) { el.value = v; } return el ? el.value : ''; },
        text: function(t) { if (t !== undefined && el) { el.innerText = t; } return el ? el.innerText : ''; },
        html: function(h) { if (h !== undefined && el) { el.innerHTML = h; } return el ? el.innerHTML : ''; },
        on: function(ev, fn) { if (el) { el.addEventListener(ev, fn); } },
        show: function() { if (el) { el.style.display = ''; el.classList.remove('d-none'); } },
        hide: function() { if (el) { el.style.display = 'none'; el.classList.add('d-none'); } },
        addClass: function(c) { if (el) { el.classList.add(c); } },
        removeClass: function(c) { if (el) { el.classList.remove(c); } }
      };
    };

    try {
      ${runtime.script}
    } catch (e) {
      console.error("Script execution error:", e);
    }
  </script>
</body>
</html>`

      doc.open()
      doc.write(fullHtml)
      doc.close()

      // Allow DOM and script to initialize
      setTimeout(() => {
        const win = iframe.contentWindow
        if (!win) {
          onError("Runner window unavailable")
          isExecuting.current = false
          return
        }

        const currentDoc = iframe.contentDocument || win.document

        // Check dynamic row initializers (e.g., loan-calculator multi-row)
        const loanAddBtn = currentDoc.getElementById("loan-add") as HTMLElement | null
        if (loanAddBtn && currentDoc.querySelectorAll(".loan-row").length === 0) {
          try {
            loanAddBtn.click()
          } catch {}
        }

        // Compound field resolution: Home Price - Down Payment = Principal
        const populatedElements = new Set<HTMLElement>()
        const priceField = fields.find((f) => /price|loan.*amount|principal/i.test(f.name))
        const downField = fields.find((f) => /down.*payment|deposit/i.test(f.name))
        const rateField = fields.find((f) => /rate|interest|apr/i.test(f.name))
        const termField = fields.find((f) => /term|year|period|tenure|amortization|duration/i.test(f.name))

        const principalInp = currentDoc.querySelector("#principal-input, #loan-amount, #p-input") as HTMLInputElement | null
        if (principalInp && priceField && priceField.value) {
          const pPrice = parseFloat(String(priceField.value)) || 0
          const pDown = downField ? (parseFloat(String(downField.value)) || 0) : 0
          const effPrincipal = pPrice > pDown && pDown > 0 ? pPrice - pDown : pPrice
          principalInp.value = String(effPrincipal)
          populatedElements.add(principalInp)
        }

        const rateInp = currentDoc.querySelector("#rate-input, #r-input, [name='rate'], .rate") as HTMLInputElement | null
        if (rateInp && rateField && rateField.value) {
          rateInp.value = String(rateField.value)
          populatedElements.add(rateInp)
        }

        const termInp = currentDoc.querySelector("#term-input, #t-input, [name='term'], .term") as HTMLInputElement | null
        if (termInp && termField && termField.value) {
          termInp.value = String(termField.value)
          populatedElements.add(termInp)
        }

        // Multi-tier matching for remaining fields
        for (const f of fields) {
          const val = String(f.value ?? "")
          const normHyphen = f.name.replace(/_/g, "-")
          const normUnder = f.name.replace(/-/g, "_")

          const candidates = [
            `#${f.name}`,
            `[name="${f.name}"]`,
            `#${normHyphen}`,
            `[name="${normHyphen}"]`,
            `#${normUnder}`,
            `[name="${normUnder}"]`,
            `#inf-${normHyphen}`,
            `#${normHyphen}-input`,
            `#input-${normHyphen}`,
            // Incomes / Budgets
            ...(normHyphen.includes("income") || normHyphen.includes("salary") || normHyphen.includes("budget")
              ? [".income", "#budget-input", "#income", "#salary", "#annual-income", "#monthly-income"]
              : []),
            // Debts
            ...(normHyphen.includes("debt") || normHyphen.includes("expense")
              ? [".debts", "#debts", "#debt-input", "#monthly-debts"]
              : []),
            // Rates
            ...(normHyphen.includes("rate") || normHyphen.includes("interest") || normHyphen.includes("apr")
              ? [".rate", "#rate-input", "#interest-rate-input", "#apr-input", "#rate", "#r-input", ".loan-rate"]
              : []),
            // Terms
            ...(normHyphen.includes("term") ||
            normHyphen.includes("year") ||
            normHyphen.includes("period") ||
            normHyphen.includes("tenure") ||
            normHyphen.includes("amortization") ||
            normHyphen.includes("duration")
              ? [".term", "#term-input", "#loan-term-input", "#years-input", "#term", "#t-input", ".loan-term", "#amortization-input"]
              : []),
            // Amounts / Principals / Prices
            ...(normHyphen.includes("price") ||
            normHyphen.includes("amount") ||
            normHyphen.includes("principal") ||
            normHyphen.includes("loan")
              ? [".principal", "#principal-input", "#principal", "#loan-amount", "#amount-input", "#p-input", ".loan-amount"]
              : []),
            // Weights
            ...(normHyphen.includes("weight")
              ? ["#target_weight", "#target-weight", "#bar_weight", "#bar-weight", "#weight_unit", "#weight-unit"]
              : []),
            `input[id*="${f.name}"]`,
            `select[id*="${f.name}"]`,
            `input[id*="${normUnder}"]`,
            `select[id*="${normUnder}"]`,
          ]

          let el: HTMLInputElement | HTMLSelectElement | null = null
          for (const selector of candidates) {
            try {
              const found = currentDoc.querySelector(selector) as HTMLInputElement | HTMLSelectElement | null
              if (found && !populatedElements.has(found)) {
                el = found
                break
              }
            } catch {}
          }

          if (el) {
            populatedElements.add(el)
            el.value = val
            // For selects, if option mismatch due to case (e.g. Kg vs kg)
            if (el.tagName === "SELECT") {
              const sel = el as HTMLSelectElement
              const opt = Array.from(sel.options).find(
                (o) => o.value.toLowerCase() === val.toLowerCase()
              )
              if (opt) sel.value = opt.value
            }
            el.dispatchEvent(new Event("input", { bubbles: true }))
            el.dispatchEvent(new Event("change", { bubbles: true }))
          }
        }

        // Positional fallback for remaining unpopulated input elements
        const unpopulatedInputs = Array.from(
          currentDoc.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="hidden"]), select')
        ).filter((inp) => !populatedElements.has(inp as HTMLElement)) as (HTMLInputElement | HTMLSelectElement)[]

        const unpopulatedFields = fields.filter((_, idx) => {
          return idx >= populatedElements.size
        })

        unpopulatedFields.forEach((f, idx) => {
          if (idx < unpopulatedInputs.length) {
            const el = unpopulatedInputs[idx]
            el.value = String(f.value ?? "")
            el.dispatchEvent(new Event("input", { bubbles: true }))
            el.dispatchEvent(new Event("change", { bubbles: true }))
          }
        })

        // Also ensure multi-row calculators have their row inputs populated
        const loanRowName = currentDoc.querySelector(".loan-name") as HTMLInputElement | null
        if (loanRowName && !loanRowName.value) loanRowName.value = "Primary Loan"

        // Trigger execution: Submit event on form
        const forms = currentDoc.querySelectorAll("form")
        forms.forEach((form) => {
          try {
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
          } catch {}
        })

        // Also trigger any submit / calculate button
        const buttons = currentDoc.querySelectorAll(
          'button[type="submit"], button#calculate-btn, button.btn-success, button.btn-primary, button.btn, input[type="submit"]'
        )
        buttons.forEach((b) => {
          try {
            ;(b as HTMLElement).click()
          } catch {}
        })

        // Also trigger any known global functions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = win as any
        const fns = ["calculate", "calculateResult", "updateResult", "compute", "runCalculation"]
        for (const fn of fns) {
          if (typeof w[fn] === "function") {
            try {
              w[fn]()
            } catch {}
          }
        }

        // Capture result after execution
        setTimeout(() => {
          try {
            // 1. Look for visible result containers FIRST!
            const resultSelectors = [
              "#mort-result",
              "#loan-summary",
              "#results-ui",
              "#results-container",
              "#result-container",
              "#result-section",
              ".result-section",
              "#results-card",
              "#result-box",
              "#calculation-result",
              "#solution-output",
              "#result",
              "#results",
              "#output",
              "#answer",
            ]

            let foundHtml = ""
            for (const sel of resultSelectors) {
              const el = currentDoc.querySelector(sel) as HTMLElement | null
              if (el) {
                const isHidden = !!el.closest(".d-none") || el.style.display === "none"
                const h = el.innerHTML.trim()
                const t = el.textContent?.trim() || ""
                if (!isHidden && h && t.length > 0) {
                  foundHtml = el.outerHTML
                  break
                }
              }
            }

            // Fallback: search any element with result/output/answer in ID that is not hidden
            if (!foundHtml) {
              const anyResults = currentDoc.querySelectorAll(
                "[id*='result']:not(form):not(input):not(button), [id*='output']:not(form):not(input):not(button), [id*='answer']:not(form):not(input):not(button)"
              )
              const parts: string[] = []
              anyResults.forEach((r) => {
                const el = r as HTMLElement
                const isHidden = !!el.closest(".d-none") || el.style.display === "none"
                const content = el.innerHTML.trim()
                if (!isHidden && content && el.textContent?.trim()) {
                  parts.push(el.outerHTML)
                }
              })
              if (parts.length > 0) {
                foundHtml = parts.join("\n")
              }
            }

            if (foundHtml) {
              const textContent = currentDoc.body?.innerText || ""
              onResult({ html: foundHtml, text: textContent })
              isExecuting.current = false
              return
            }

            // 2. Only check for errors if NO result container produced output
            const alertBox = currentDoc.getElementById("calc-error-box")
            if (alertBox && alertBox.textContent?.trim() && !alertBox.closest(".d-none") && alertBox.style.display !== "none") {
              onError(alertBox.textContent.trim())
              isExecuting.current = false
              return
            }

            // Check for explicit error messages in genuinely visible status/alert divs
            const statusDiv = currentDoc.querySelector(".alert-danger:not(.d-none), #status-message:not(.d-none)") as HTMLElement | null
            if (statusDiv) {
              const statusText = statusDiv.textContent?.trim() || ""
              const isVisible = !statusDiv.closest(".d-none") && statusDiv.style.display !== "none"
              if (
                isVisible &&
                statusText &&
                (statusText.toLowerCase().includes("error") || statusText.toLowerCase().includes("please"))
              ) {
                onError(statusText)
                isExecuting.current = false
                return
              }
            }

            onError("Calculation completed with no visible output. Please verify input values.")
          } catch (captureErr) {
            onError(captureErr instanceof Error ? captureErr.message : String(captureErr))
          } finally {
            isExecuting.current = false
          }
        }, 120)
      }, 50)
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Error executing calculation engine")
      isExecuting.current = false
    }
  }, [calcId, fields, onResult, onError, trigger])

  useEffect(() => {
    execute()
  }, [execute])

  return (
    <iframe
      ref={iframeRef}
      style={{ position: "absolute", width: 0, height: 0, border: "none", overflow: "hidden" }}
      title="Calculator Sandbox"
      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
    />
  )
}

export default JsExecutor
