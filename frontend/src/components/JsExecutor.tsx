"use client"

/**
 * JS Sandbox Executor — runs Django template JS in a sandboxed iframe.
 * Uses original template HTML/CSS when available for high-fidelity rendering,
 * with resilient input matching, event dispatching, and guaranteed error recovery.
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
          if (f.type === "select") {
            inputElements.push(
              `<select id="${f.name}" name="${f.name}"><option value="${val}" selected>${val}</option></select>`
            )
          } else {
            inputElements.push(
              `<input type="${f.type === "number" ? "number" : "text"}" id="${f.name}" name="${f.name}" value="${val}">`
            )
          }
        }
        templateHtml = `
          <form id="${calcId}-form">
            ${inputElements.join("\n")}
            <button type="submit" id="calculate-btn">Calculate</button>
          </form>
          <div id="results-container" class="result-area"></div>
          <div id="result" class="result-area"></div>
          <div id="output" class="result-area"></div>
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
  ${templateHtml}
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script>
    // Chart fallback if CDN is unreachable
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
    // MathJax stub so LaTeX calls never crash
    window.MathJax = {
      typesetPromise: function() { return Promise.resolve(); },
      typeset: function() {},
      startup: { ready: function() {} }
    };
    // Minimal jQuery shim for older calculators
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

        // Populate fields with user inputs: multi-tier matching
        const populatedElements = new Set<HTMLElement>()
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
            // Check for explicit error messages in status/alert divs
            const statusDiv = currentDoc.getElementById("status-message") || currentDoc.querySelector(".alert-danger")
            if (statusDiv) {
              const statusText = statusDiv.textContent?.trim() || ""
              const isVisible = !statusDiv.classList.contains("d-none") && statusDiv.style.display !== "none"
              if (isVisible && statusText && (statusText.toLowerCase().includes("error") || statusText.toLowerCase().includes("please"))) {
                onError(statusText)
                isExecuting.current = false
                return
              }
            }

            // Look for visible result containers
            const resultSelectors = [
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
              "#answer"
            ]

            let foundHtml = ""
            for (const sel of resultSelectors) {
              const el = currentDoc.querySelector(sel) as HTMLElement | null
              if (el) {
                el.classList.remove("d-none")
                el.style.display = ""
                const h = el.innerHTML.trim()
                const t = el.textContent?.trim() || ""
                if (h && t.length > 0) {
                  foundHtml = el.outerHTML
                  break
                }
              }
            }

            // Fallback: search any element with result/output/answer in ID
            if (!foundHtml) {
              const anyResults = currentDoc.querySelectorAll(
                "[id*='result']:not(form):not(input):not(button), [id*='output']:not(form):not(input):not(button), [id*='answer']:not(form):not(input):not(button)"
              )
              const parts: string[] = []
              anyResults.forEach((r) => {
                const el = r as HTMLElement
                el.classList.remove("d-none")
                el.style.display = ""
                const content = el.innerHTML.trim()
                if (content && el.textContent?.trim()) {
                  parts.push(content)
                }
              })
              if (parts.length > 0) {
                foundHtml = parts.join("<hr style='margin:12px 0;border-color:#e2e8f0'>")
              }
            }

            // Parse text
            const tempDiv = currentDoc.createElement("div")
            tempDiv.innerHTML = foundHtml
            const cleanText = tempDiv.textContent || tempDiv.innerText || ""

            if (foundHtml && cleanText.trim().length > 0) {
              onResult({ html: foundHtml, text: cleanText.trim() })
            } else {
              onError("Calculation completed with no visible output. Please verify input values.")
            }
          } catch (captureErr) {
            onError(captureErr instanceof Error ? captureErr.message : String(captureErr))
          } finally {
            isExecuting.current = false
          }
        }, 250)
      }, 150)
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e))
      isExecuting.current = false
    }
  }, [calcId, fields, trigger, onResult, onError])

  useEffect(() => {
    execute()
  }, [execute])

  return (
    <iframe
      ref={iframeRef}
      style={{ position: "absolute", width: 0, height: 0, border: "none", overflow: "hidden" }}
      title="Calculator Sandbox"
      sandbox="allow-scripts allow-same-origin"
    />
  )
}

export default JsExecutor
