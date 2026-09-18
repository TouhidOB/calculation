import os, re, json

TEMPLATES_DIR = "/root/trycalc/app/calculation/templates"
JS_LOGIC_PATH = "/root/trycalc/app/backend/extracted_js_logic.json"
OUTPUT_PATH = "/root/trycalc/app/backend/extracted_calc_runtime.json"

all_html_files = {}
for root, dirs, files in os.walk(TEMPLATES_DIR):
    for f in files:
        if f.endswith(".html"):
            all_html_files[f] = os.path.join(root, f)

with open(JS_LOGIC_PATH) as f:
    js_data = json.load(f)

extracted = {}

for key, script in js_data.items():
    if key == "base":
        continue
    cat, tpl = key.split("__", 1)
    target = tpl + ".html"
    filepath = all_html_files.get(target)
    if not filepath:
        continue
    
    with open(filepath, "r", errors="ignore") as f:
        text = f.read()
    
    # Styles from <style> tags
    styles = re.findall(r"<style>(.*?)</style>", text, re.DOTALL)
    css = "\n".join(styles).strip()
    
    # Extract calculator content (between {% block content %} and <article or {% endblock %})
    content_match = re.search(r"{%\s*block content\s*%}(.*?)(?:<article class=[\x27\x22]tool-blog|{%\s*endblock\s*%})", text, re.DOTALL)
    if content_match:
        raw_html = content_match.group(1).strip()
    else:
        m = re.search(r"(<div class=[\x27\x22]calc-wrapper.*?)(?:<article|<script)", text, re.DOTALL)
        raw_html = m.group(1).strip() if m else ""
    
    # Remove Django template tags
    raw_html = re.sub(r"{%.*?%}", "", raw_html)
    raw_html = re.sub(r"{{.*?}}", "", raw_html)
    
    extracted[key] = {
        "script": script,
        "html": raw_html,
        "css": css
    }

print(f"Total extracted: {len(extracted)}")
with open(OUTPUT_PATH, "w") as f:
    json.dump(extracted, f)
print(f"Saved to {OUTPUT_PATH}, size: {os.path.getsize(OUTPUT_PATH)} bytes")
