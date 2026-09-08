"use client"

/**
 * JS Sandbox Executor — runs Django template JS in a sandboxed iframe.
 * The original calculators use DOM (getElementById, innerHTML) to read inputs
 * and write results. Most use addEventListener('submit') on a named form.
 *
 * Strategy:
 * 1. Build an iframe with form elements matching the calculator's field names
 * 2. Set input values from user-supplied values
 * 3. Inject the original JS and dispatch a submit event
 * 4. Capture the rendered result HTML
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

function JsExecutor({ calcId, fields, onResult, onError, trigger }: JsExecutorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const scriptCache = useRef<string | null>(null)
  const formId = useRef<string>("")

  // Build form ID from calcId (e.g. "budget-calculator" -> "budget-form")
  // The JS typically uses <calcname>-form as the form ID
  const guessFormId = useCallback((js: string, cid: string): string => {
    // Extract the actual form ID from the JS
    const match = js.match(/getElementById\s*\(\s*['"]([^'"]*-form)['"]\s*\)/)
    if (match) return match[1]
    // Try calcId-form as fallback  
    return `${cid}-form`
  }, [])

  const execute = useCallback(async () => {
    if (trigger === 0) return

    try {
      // Fetch script if not cached
      if (!scriptCache.current) {
        const res = await fetch(`/api/calculators/${calcId}/script`)
        if (!res.ok) {
          if (res.status === 404) {
            // No JS for this calculator — it runs server-side
            return
          }
          throw new Error(`Failed to fetch script: ${res.status}`)
        }
        const data = await res.json()
        scriptCache.current = data.script
        formId.current = guessFormId(data.script, calcId)
      }

      const script = scriptCache.current
      if (!script) return

      const iframe = iframeRef.current
      if (!iframe) return

      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (!doc) {
        onError("Cannot access iframe")
        return
      }

      // Extract ALL element IDs referenced in the JS
      const idMatches = script.matchAll(/getElementById\s*\(\s*['"](.*?)['"]\s*\)/g)
      const referencedIds = new Set<string>()
      for (const m of idMatches) {
        referencedIds.add(m[1])
      }

      // Also extract IDs from querySelector
      const qsMatches = script.matchAll(/querySelector\s*\(\s*['"]#(.*?)['"]\s*\)/g)
      for (const m of qsMatches) {
        referencedIds.add(m[1])
      }

      // Build input elements — match field names AND any referenced IDs
      const inputElements: string[] = []
      const fieldNames = new Set(fields.map(f => f.name))

      for (const f of fields) {
        const val = String(f.value).replace(/"/g, '&quot;')
        if (f.type === "select") {
          inputElements.push(`<select id="${f.name}" name="${f.name}"><option value="${val}" selected>${val}</option></select>`)
        } else {
          inputElements.push(`<input type="text" id="${f.name}" name="${f.name}" value="${val}">`)
        }
      }

      // Create placeholder elements for any referenced IDs we haven't covered
      const resultContainers = [
        "results-container", "solution-output", "results-ui", "resultsList",
        "result-title", "result-container", "result", "results-card",
        "result-box", "result-date-display", "masonry-result",
        "output", "answer", "calculation-result", "resultDiv"
      ]

      for (const id of referencedIds) {
        if (fieldNames.has(id)) continue // Already created as input
        if (resultContainers.includes(id) || id.includes("result") || id.includes("output")) {
          inputElements.push(`<div id="${id}" class="result-area"></div>`)
        } else if (!fieldNames.has(id)) {
          // Generic placeholder — might be a label, chart, or other element
          inputElements.push(`<div id="${id}"></div>`)
        }
      }

      // Ensure all known result containers exist
      for (const rc of resultContainers) {
        if (!referencedIds.has(rc)) {
          inputElements.push(`<div id="${rc}" class="result-area" style="display:none"></div>`)
        }
      }

      const fid = formId.current

      doc.open()
      doc.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
* { box-sizing: border-box; font-family: system-ui, sans-serif; }
body { padding: 8px; font-size: 14px; color: #333; }
.d-none { display: none; }
.result-area { margin-top: 8px; }
table { border-collapse: collapse; width: 100%; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #f5f5f5; font-weight: 600; }
.text-success, .text-green { color: #16a34a; }
.text-danger, .text-red { color: #dc2626; }
.text-warning { color: #d97706; }
.text-info { color: #0891b2; }
strong { font-weight: 600; }
</style>
</head><body>
<form id="${fid}">
  ${inputElements.join("\n  ")}
  <button type="submit" style="display:none">Go</button>
</form>

<script>
// Shims for Bootstrap classes the JS toggles
Element.prototype.classList._origAdd = Element.prototype.classList.add;
document.addEventListener('DOMContentLoaded', function() {
  // Remove d-none from result containers on write
  var observer = new MutationObserver(function(muts) {
    muts.forEach(function(m) {
      if (m.target && m.target.classList) {
        m.target.classList.remove('d-none');
        m.target.style.display = '';
      }
    });
  });
  document.querySelectorAll('.result-area').forEach(function(el) {
    observer.observe(el, { childList: true, subtree: true, characterData: true });
  });
});

// Chart.js stub (many calculators try to create charts)
window.Chart = function(ctx, config) {
  this.destroy = function(){};
  this.update = function(){};
  this.data = config.data || {};
};

try {
${script}
} catch(e) {
  console.error('Script init error:', e);
}
</script>
</body></html>`)
      doc.close()

      // Wait for DOMContentLoaded + script init, then trigger submit
      setTimeout(() => {
        const win = iframe.contentWindow
        if (!win) return

        const form = doc.getElementById(fid) as HTMLFormElement
        if (form) {
          // Dispatch submit event (most calculators listen for this)
          const evt = new Event("submit", { bubbles: true, cancelable: true })
          form.dispatchEvent(evt)
        }

        // Also try calling common function names
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = win as any
        const fns = ["calculate", "calculateResult", "updateResult", "compute", "runCalculation"]
        for (const fn of fns) {
          if (typeof w[fn] === "function") {
            try { w[fn]() } catch { /* ignore */ }
          }
        }

        // Capture results after JS runs
        setTimeout(() => {
          const parts: string[] = []

          // Collect all result container content
          for (const rc of resultContainers) {
            const el = doc.getElementById(rc) as HTMLElement | null
            if (el && el.innerHTML && el.innerHTML.trim()) {
              parts.push(el.innerHTML)
            }
          }

          // Also scan any element with "result" in ID that has content
          const allResults = doc.querySelectorAll("[id*='result'], [id*='output'], [id*='answer'], [id*='solution']")
          allResults.forEach((el) => {
            const htmlEl = el as HTMLElement
            if (htmlEl.innerHTML && htmlEl.innerHTML.trim() && !resultContainers.includes(htmlEl.id)) {
              parts.push(htmlEl.innerHTML)
            }
          })

          // Dedupe and join
          const seen = new Set<string>()
          const uniqueParts = parts.filter(p => {
            const trimmed = p.trim()
            if (seen.has(trimmed) || !trimmed) return false
            seen.add(trimmed)
            return true
          })

          const html = uniqueParts.join("<hr style='margin:12px 0;border-color:#e5e7eb'>")
          
          // Extract plain text for structured display
          const tempDiv = doc.createElement("div")
          tempDiv.innerHTML = html
          const text = tempDiv.textContent || tempDiv.innerText || ""

          if (html && text.trim()) {
            onResult({ html, text: text.trim() })
          }
        }, 300)
      }, 200)
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e))
    }
  }, [calcId, fields, trigger, onResult, onError, guessFormId])

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