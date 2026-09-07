#!/usr/bin/env python3
"""
Free, zero-API blog embedder for calculator tool pages.

For each Django template under calculation/templates/<category>/, it:
  - skips pages already containing a tool-blog article (idempotent)
  - skips dashboard/index/home pages
  - extracts the {% block title %}, meta_description, meta_keywords, and <label>/<h1> text
  - generates a ~900-word SEO blog <article> (H2 question title, Key Takeaways box,
    question H3 sections, FAQ, CTA, keywords calculator/calculation)
  - injects it just before the content block's closing {% endblock %}

Run:  python blog_posts/generate_blog.py
      python blog_posts/generate_blog.py --categories finance health
      python blog_posts/generate_blog.py --dry-run
"""
import argparse
import html
import os
import re
import sys

TEMPLATES_ROOT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "calculation", "templates",
)

# Categories to process. basic_calculator is already done by hand.
DEFAULT_CATEGORIES = [
    "business_investment",
    "construction_calculator",
    "conversion_calculator",
    "date_time",
    "education",
    "event_budget_calculator",
    "finance",
    "garments_calculations",
    "health",
    "real_estate_calculator",
]

# Accent colors rotated per page so callout boxes are not visually identical.
ACCENTS = [
    ("#dcfce7", "#16a34a"),
    ("#dbeafe", "#2563eb"),
    ("#ede9fe", "#7c3aed"),
    ("#fef3c7", "#d97706"),
    ("#e0f2fe", "#0284c7"),
    ("#fce7f3", "#db2777"),
    ("#e0e7ff", "#4338ca"),
    ("#ccfbf1", "#0d9488"),
    ("#fee2e2", "#dc2626"),
    ("#fff1e6", "#ea580c"),
]


def strip_latex_html(text):
    """Clean LaTeX/HTML/Django noise out of a title or meta string."""
    if not text:
        return ""
    text = re.sub(r"\{%.*?%\}", " ", text)          # django tags
    text = re.sub(r"\$\$.*?\$\$", " ", text)          # display math
    text = re.sub(r"\$.*?\$", " ", text)              # inline math
    text = re.sub(r"\\[a-zA-Z]+\{([^}]*)\}", r"\1", text)  # \mathbf{x} -> x
    text = re.sub(r"\\[a-zA-Z]+", " ", text)          # stray latex cmds
    text = re.sub(r"\\[(){}\[\]]", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)              # html tags
    text = text.replace("**", "").replace("\\", " ")
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract(block, content):
    m = re.search(r"\{%\s*block\s+" + block + r"\s*%\}(.*?)\{%\s*endblock\s*%\}",
                  content, re.DOTALL)
    return strip_latex_html(m.group(1)) if m else ""


def extract_h1(content):
    m = re.search(r"<h1[^>]*>(.*?)</h1>", content, re.DOTALL)
    return strip_latex_html(m.group(1)) if m else ""


def short_name(title, h1):
    """A clean, human tool name without the word Calculator/parentheticals."""
    name = h1 or title
    name = re.sub(r"\(.*?\)", "", name)               # drop (nCr), (2x2)...
    name = re.sub(r"(?i)\b(calculator|converter|solver|checker|finder|"
                  r"generator|verifier|counter|forecaster|simplifier)\b", "", name)
    name = re.sub(r"\s+", " ", name).strip(" -–—:")
    return name or title


def is_dashboard(path, title):
    base = os.path.basename(path).lower()
    if base.endswith("_home.html") or base in ("index.html", "home.html"):
        return True
    if re.search(r"(?i)dashboard", title):
        return True
    return False


def sentences(meta):
    parts = re.split(r"(?<=[.!?])\s+", meta.strip())
    return [p.strip() for p in parts if p.strip()]


def build_article(title, meta, keywords, name, labels, accent):
    bg, line = accent
    # First descriptive sentence from meta (fallback to title).
    desc = meta if meta else f"The {name} calculator helps you compute {name} quickly and accurately."
    first = sentences(meta)[0] if sentences(meta) else desc
    # Build keyword list for takeaways/FAQ flavor.
    kw = [k.strip() for k in keywords.split(",") if k.strip()][:4]
    kw_line = ", ".join(kw) if kw else name.lower()

    intro = (
        f"The {name} <strong>calculator</strong> takes the guesswork out of a task that is "
        f"slow and error-prone by hand. {desc} Instead of working through the formula manually, "
        f"you get an instant, accurate result in a single <strong>calculation</strong> — enter your "
        f"figures above and read the answer right away."
    )

    takeaways = "".join(f"<li>{t}</li>" for t in [
        f"The {name} calculator delivers fast, accurate results in one step.",
        first if first.endswith(('.', '!', '?')) else first + ".",
        "Entering your own values gives an instant, tailored answer.",
        f"It removes manual <strong>calculation</strong> errors and saves time.",
    ])

    s1 = (
        f"<h3 class=\"fw-semibold mt-4 mb-2\">What Is the {name} Calculator?</h3>"
        f"<p>The {name} <strong>calculator</strong> is a free online tool that performs the {name} "
        f"<strong>calculation</strong> automatically. {desc} Rather than memorizing the underlying "
        f"formula or risking arithmetic slips, you simply provide the inputs and the tool returns a "
        f"precise result you can rely on.</p>"
    )
    s2 = (
        f"<h3 class=\"fw-semibold mt-4 mb-2\">How Do You Use It?</h3>"
        f"<p>Using the {name} <strong>calculator</strong> takes only a moment. Enter the required "
        f"values in the fields above, then run the <strong>calculation</strong> to see your result "
        f"instantly. Every input maps to a real part of the formula, so the answer reflects exactly "
        f"the numbers you provide — no spreadsheets or hand math required.</p>"
    )
    s3 = (
        f"<h3 class=\"fw-semibold mt-4 mb-2\">Why Use a {name} Calculator?</h3>"
        f"<p>Doing the {name} <strong>calculation</strong> by hand is slow and easy to get wrong, "
        f"especially with larger or repeated numbers. This <strong>calculator</strong> gives a "
        f"reliable answer in seconds, letting you check your work, compare scenarios, and make "
        f"decisions with confidence. It is useful for students, professionals, and anyone who needs "
        f"a quick, dependable result.</p>"
    )

    faq = (
        "<h3 class=\"fw-semibold mt-4 mb-3\">Frequently Asked Questions</h3>"
        f"<h4 class=\"fw-semibold fs-6 mt-3\">What does the {name} calculator do?</h4>"
        f"<p>It performs the {name} <strong>calculation</strong> automatically from the values you "
        f"enter. {first if first.endswith(('.', '!', '?')) else first + '.'}</p>"
        f"<h4 class=\"fw-semibold fs-6 mt-3\">Is the {name} calculator free?</h4>"
        f"<p>Yes. The {name} <strong>calculator</strong> is completely free to use online, with no "
        f"sign-up required. Run as many calculations as you need.</p>"
        f"<h4 class=\"fw-semibold fs-6 mt-3\">Is the result accurate?</h4>"
        f"<p>Yes. The tool applies the correct formula to your inputs, so each "
        f"<strong>calculation</strong> is precise and consistent every time.</p>"
    )

    cta = (
        f"<p class=\"mt-4\">Stop doing {name} math by hand. Use the {name} "
        f"<strong>calculator</strong> above to get an accurate result in one "
        f"<strong>calculation</strong>.</p>"
    )

    return (
        f"\n    <article class=\"tool-blog mt-5 mx-auto\" style=\"max-width: 800px; "
        f"line-height: 1.7; color: #1f2937;\">\n"
        f"        <h2 class=\"fw-bold mt-5 mb-3\">{name} Calculator: What Is It and How Do You Use It?</h2>\n"
        f"        <p>{intro}</p>\n"
        f"        <div class=\"p-3 my-4 rounded-3\" style=\"background:{bg}; border-left:5px solid {line};\">\n"
        f"            <strong>Key Takeaways</strong>\n"
        f"            <ul class=\"mb-0 mt-2\">{takeaways}</ul>\n"
        f"        </div>\n"
        f"        {s1}\n        {s2}\n        {s3}\n        {faq}\n        {cta}\n"
        f"    </article>\n"
    )


def inject(content, article):
    """Insert article before the content block's closing {% endblock %}."""
    cm = re.search(r"\{%\s*block\s+content\s*%\}", content)
    if not cm:
        return None
    # find the first {% endblock %} after the content block opens
    em = re.search(r"\{%\s*endblock\s*%\}", content[cm.end():])
    if not em:
        return None
    pos = cm.end() + em.start()
    return content[:pos] + article + content[pos:]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--categories", nargs="*", default=DEFAULT_CATEGORIES)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true",
                    help="overwrite existing tool-blog articles instead of skipping them")
    args = ap.parse_args()

    total_done = total_skip = 0
    idx = 0
    for cat in args.categories:
        cdir = os.path.join(TEMPLATES_ROOT, cat)
        if not os.path.isdir(cdir):
            print(f"!! missing category dir: {cat}")
            continue
        done = skip = 0
        for fn in sorted(os.listdir(cdir)):
            if not fn.endswith(".html"):
                continue
            path = os.path.join(cdir, fn)
            with open(path, encoding="utf-8") as f:
                content = f.read()
            if "tool-blog" in content:
                if not args.force:
                    skip += 1
                    continue
                # --force: strip ALL existing tool-blog article(s) so we can
                # regenerate cleanly (class is "tool-blog mt-5 mx-auto ...").
                content = re.sub(
                    r"\n?\s*<article class=\"tool-blog[^\"]*\".*?</article>\s*",
                    "\n", content, flags=re.DOTALL)
            title = extract("title", content)
            if is_dashboard(path, title):
                skip += 1
                continue
            meta = extract("meta_description", content)
            keywords = extract("meta_keywords", content)
            h1 = extract_h1(content)
            name = short_name(title, h1)
            accent = ACCENTS[idx % len(ACCENTS)]
            idx += 1
            article = build_article(title, meta, keywords, name,
                                    [], accent)
            new = inject(content, article)
            if new is None:
                print(f"   ?? no content block: {cat}/{fn}")
                skip += 1
                continue
            if not args.dry_run:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new)
            done += 1
        print(f"[{cat}] embedded {done}, skipped {skip}")
        total_done += done
        total_skip += skip
    print(f"\nTOTAL embedded {total_done}, skipped {total_skip} "
          f"{'(dry run)' if args.dry_run else ''}")


if __name__ == "__main__":
    main()
