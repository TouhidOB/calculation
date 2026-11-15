#!/usr/bin/env python3
"""
Autonomous 24x7 SEO Discovery AI Agent for TryCalc
Powered by OpenRouter API LLM
Author: Imon (TryCalc Architect)
"""

import os
import sys
import json
import time
import re
import urllib.request
import urllib.error
from datetime import datetime

# Path resolution for storage
CANDIDATE_PATHS = [
    "/root/trycalc/app/data/seo_proposals.json",
    "/home/imon/calculation/data/seo_proposals.json",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "seo_proposals.json"),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "seo_proposals.json"),
]

def get_proposals_file():
    for p in CANDIDATE_PATHS:
        normalized = os.path.abspath(p)
        if os.path.exists(normalized):
            return normalized
    # Fallback to create in parent/data
    parent_data = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data"))
    os.makedirs(parent_data, exist_ok=True)
    return os.path.join(parent_data, "seo_proposals.json")

def read_proposals(file_path):
    if not os.path.exists(file_path):
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception as e:
        print(f"[{datetime.now().isoformat()}] Error reading {file_path}: {e}")
        return []

def write_proposals(file_path, proposals):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    tmp_path = f"{file_path}.tmp.{int(time.time())}"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(proposals, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, file_path)

def get_openrouter_api_key():
    # 1. Environment variable
    key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if key:
        return key

    # 2. Check /root/trycalc/app/backend/.env or project .env
    env_paths = [
        "/root/trycalc/app/backend/.env",
        "/root/trycalc/app/.env",
        os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"),
        os.path.expanduser("~/.bashrc")
    ]
    for ep in env_paths:
        if os.path.exists(ep):
            try:
                with open(ep, "r", encoding="utf-8") as f:
                    for line in f:
                        m = re.search(r'OPENROUTER_API_KEY=[\"\']?([^\s\"\'#]+)', line)
                        if m:
                            return m.group(1).strip()
            except Exception:
                pass
    return ""

def query_openrouter_llm(api_key, existing_keywords):
    model = os.environ.get("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct:free")
    
    system_prompt = (
        "You are TryCalc's Autonomous Chief SEO Officer & Calculator Architect. "
        "Your mission is to research high-intent, low-difficulty calculator keywords with strong ad CPM (Finance, Health, Construction, Tech, Real Estate, Business). "
        "Return a strictly valid JSON object representing 1 new calculator proposal. No surrounding conversational markdown or backticks."
    )

    user_prompt = f"""
Existing keywords already in system:
{json.dumps(list(existing_keywords)[-30:], ensure_ascii=False)}

Identify 1 brand-new calculator idea that is NOT in the existing list.
Requirements:
1. Target keyword with high monthly search volume (>10,000) and KD < 35.
2. High AdSense/Adsterra monetization potential (Finance, B2B, Health, Construction, or Tech).
3. Complete mathematical formula, inputs, outputs, and editorial guide.
4. Bangla analysis: 3-4 pros and 2-3 cons in clear Bengali script.

Return strictly a JSON object with this exact schema:
{{
  "targetKeyword": "string",
  "category": "Finance|Health|Tech|Construction|Real Estate|Business|Everyday",
  "slug": "/calculators/category-name/kebab-case-keyword",
  "searchVolume": 25000,
  "difficulty": 22,
  "cpc": 3.5,
  "estEcpm": 5.2,
  "potentialMonthlyTraffic": 7500,
  "estMonthlyRevenue": 39.00,
  "prosBangla": [
    "উচ্চ সার্চ ভলিউম...",
    "প্রিমিয়াম ক্যাটাগরি..."
  ],
  "consBangla": [
    "কঠিন প্রতিযোগিতা...",
    "ফর্মুলার সঠিকতা..."
  ],
  "spec": {{
    "inputs": [
      {{"name": "inputName", "type": "number", "label": "Label", "defaultValue": 100, "unit": "$"}},
      ...
    ],
    "outputs": [
      {{"name": "outputName", "label": "Label", "unit": "$"}},
      ...
    ],
    "formula": "Step-by-step mathematical calculation formula",
    "editorialGuide": "Comprehensive guide for Google AdSense compliance and user trust."
  }}
}}
"""

    models_to_try = [
        model,
        "google/gemini-2.0-flash-exp:free",
        "mistralai/mistral-7b-instruct:free",
        "openrouter/free"
    ]

    for current_model in models_to_try:
        payload = {
            "model": current_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 1600
        }

        req = urllib.request.Request(
            "https://openrouter.ai/api/v1/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://trycalc.net",
                "X-Title": "TryCalc Autonomous 24x7 SEO Agent"
            }
        )

        try:
            print(f"[{datetime.now().isoformat()}] Querying OpenRouter using model: {current_model}...")
            with urllib.request.urlopen(req, timeout=45) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                content = data["choices"][0]["message"]["content"].strip()
                
                # Strip markdown json blocks if returned
                if content.startswith("```"):
                    content = re.sub(r"^```(?:json)?\s*", "", content)
                    content = re.sub(r"\s*```$", "", content)

                parsed = json.loads(content)
                if isinstance(parsed, dict) and "targetKeyword" in parsed:
                    print(f"[{datetime.now().isoformat()}] LLM generated: {parsed['targetKeyword']}")
                    return parsed, current_model
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            print(f"[{datetime.now().isoformat()}] OpenRouter HTTP {e.code} on model {current_model}: {err_body}")
            if e.code == 429:
                # Daily limit or rate limit
                continue
        except Exception as e:
            print(f"[{datetime.now().isoformat()}] OpenRouter error on model {current_model}: {e}")
            continue

    return None, None

def get_curated_fallback(existing_keywords):
    """
    High-value curated discovery proposals ensuring 24x7 pipeline never stalls
    even during OpenRouter daily rate-limit windows.
    """
    curated_pool = [
        {
            "targetKeyword": "Commercial Real Estate Cap Rate and NOI Calculator",
            "category": "Real Estate",
            "slug": "/calculators/real-estate/commercial-cap-rate-noi-calculator",
            "searchVolume": 38200,
            "difficulty": 28,
            "cpc": 4.80,
            "estEcpm": 7.50,
            "potentialMonthlyTraffic": 11500,
            "estMonthlyRevenue": 86.25,
            "prosBangla": [
                "বাণিজ্যিক রিয়েল এস্টেট বিনিয়োগকারী এবং ব্রোকারদের জন্য অপরিহার্য ক্যাপিটালাইজেশন রেট ক্যালকুলেটর।",
                "রিয়েল এস্টেট বিজ্ঞাপনের প্রিমিয়াম eCPM ($৭.৫০+) এবং উচ্চ বাণিজ্যিক সিপিসি।",
                "নেট অপারেটিং ইনকাম (NOI), গ্রস রেন্ট মাল্টিপ্লায়ার (GRM) এবং ক্যাশ-অন-ক্যাশ রিটার্নের একক স্ক্রিন বিশ্লেষণ।",
                "ইনভেস্টমেন্ট প্রপার্টি কেনার পূর্বে ঝুঁকি নির্ণয়ের জন্য আদর্শ টুল।"
            ],
            "consBangla": [
                "ভ্যাকেন্সি রেট এবং মেইনটেন্যান্স রিজার্ভ সঠিকভাবে ইনপুট না দিলে ক্যাপ রেট অতিরঞ্জিত হতে পারে।",
                "লোকাল প্রপার্টি ট্যাক্স এবং ইন্স্যুরেন্সের সঠিক ডেটা প্রয়োজন হয়।"
            ],
            "spec": {
                "inputs": [
                    {"name": "propertyPrice", "type": "number", "label": "Property Purchase Price", "defaultValue": 1250000, "unit": "$"},
                    {"name": "grossRentalIncome", "type": "number", "label": "Annual Gross Rental Income", "defaultValue": 140000, "unit": "$"},
                    {"name": "operatingExpenses", "type": "number", "label": "Annual Operating Expenses", "defaultValue": 35000, "unit": "$"},
                    {"name": "vacancyRate", "type": "number", "label": "Expected Vacancy Rate", "defaultValue": 5, "unit": "%"}
                ],
                "outputs": [
                    {"name": "noi", "label": "Net Operating Income (NOI)", "unit": "$"},
                    {"name": "capRate", "label": "Capitalization Rate (Cap Rate)", "unit": "%"},
                    {"name": "grossYield", "label": "Gross Rental Yield", "unit": "%"}
                ],
                "formula": "NOI = (GrossIncome * (1 - VacancyRate/100)) - OperatingExpenses; CapRate = (NOI / PurchasePrice) * 100",
                "editorialGuide": "Comprehensive guide on commercial capitalization rates, Class A/B/C building yield expectations, risk premia, and interest rate sensitivity."
            }
        },
        {
            "targetKeyword": "Freelance Hourly Rate and Billable Hours Calculator",
            "category": "Business",
            "slug": "/calculators/business/freelance-hourly-rate-calculator",
            "searchVolume": 24800,
            "difficulty": 21,
            "cpc": 3.10,
            "estEcpm": 4.90,
            "potentialMonthlyTraffic": 8200,
            "estMonthlyRevenue": 40.18,
            "prosBangla": [
                "ফ্রিল্যান্সার, কন্ট্রাক্টর ও এজেন্সি কর্মীদের কাঙ্ক্ষিত বার্ষিক আয়ের ভিত্তিতে প্রতি ঘণ্টার রেট নির্ধারণ।",
                "ট্যাক্স, অসুস্থতাজনিত ছুটি, সফটওয়্যার সাবস্ক্রিপশন এবং নন-বিলেবল আওয়ারের নিখুঁত সমন্বয়।",
                "লো কিওয়ার্ড ডিফিকাল্টি (KD ২১) এবং রিমোট কর্মীদের মাঝে নিয়মিত শেয়ার ও বুকমার্কিংয়ের ট্রেন্ড।"
            ],
            "consBangla": [
                "বিভিন্ন দেশের স্বকর্মসংস্থান কর (Self-employment tax) কাঠামো ভিন্ন হওয়ায় করের ফিল্ডটি ফ্লেক্সিবল রাখা জরুরি।"
            ],
            "spec": {
                "inputs": [
                    {"name": "targetAnnualIncome", "type": "number", "label": "Target Take-Home Annual Income", "defaultValue": 75000, "unit": "$"},
                    {"name": "annualExpenses", "type": "number", "label": "Business Expenses & Software", "defaultValue": 8000, "unit": "$"},
                    {"name": "taxRate", "type": "number", "label": "Estimated Tax Rate", "defaultValue": 25, "unit": "%"},
                    {"name": "vacationWeeks", "type": "number", "label": "Vacation / Sick Weeks Off", "defaultValue": 4, "unit": "Weeks"},
                    {"name": "billableHoursPerWeek", "type": "number", "label": "Billable Client Hours Per Week", "defaultValue": 25, "unit": "Hours"}
                ],
                "outputs": [
                    {"name": "requiredGrossRevenue", "label": "Gross Revenue Required", "unit": "$"},
                    {"name": "hourlyRate", "label": "Minimum Billable Hourly Rate", "unit": "$/hr"},
                    {"name": "dayRate", "label": "Standard Day Rate (8 hrs)", "unit": "$/day"}
                ],
                "formula": "TotalWeeks = 52 - VacationWeeks; TotalHours = TotalWeeks * BillableHours; GrossNeeded = (TargetIncome / (1 - TaxRate/100)) + Expenses; HourlyRate = GrossNeeded / TotalHours",
                "editorialGuide": "Guide for independent contractors to account for self-employment tax, billable utilization ratio, healthcare costs, and overhead expenses."
            }
        },
        {
            "targetKeyword": "Roof Shingle and Underlayment Bundle Estimator",
            "category": "Construction",
            "slug": "/calculators/construction/roof-shingle-bundle-estimator",
            "searchVolume": 21500,
            "difficulty": 19,
            "cpc": 2.90,
            "estEcpm": 4.20,
            "potentialMonthlyTraffic": 6800,
            "estMonthlyRevenue": 28.56,
            "prosBangla": [
                "ছাদের আয়তন, পিচ (Slope) এবং ওয়েস্টেজ পার্সেন্টেজ হিসাব করে সঠিক শিংগল বান্ডিল নির্ণয়।",
                "কনস্ট্রাকশন ও হোম ইমপ্রুভমেন্ট বিজ্ঞাপনের দারুণ eCPM ($৪.২০+)।",
                "বাড়ি মালিক এবং রুফিং কন্ট্রাক্টরদের ব্যাপক সার্চ ডিমান্ড।"
            ],
            "consBangla": [
                "ছাদের ঢাল (Pitch Multiplier) অনুযায়ী ক্ষেত্রফল বৃদ্ধি স্পষ্টভাবে বুঝিয়ে দিতে হবে।"
            ],
            "spec": {
                "inputs": [
                    {"name": "roofBaseArea", "type": "number", "label": "House Footprint Ground Area", "defaultValue": 1800, "unit": "sq ft"},
                    {"name": "roofPitch", "type": "select", "label": "Roof Pitch / Slope", "defaultValue": "6:12 (1.118 Multiplier)", "unit": "Pitch"},
                    {"name": "wastePercentage", "type": "number", "label": "Wastage / Valley Cuts", "defaultValue": 12, "unit": "%"}
                ],
                "outputs": [
                    {"name": "actualRoofArea", "label": "Total Actual Roof Area", "unit": "sq ft"},
                    {"name": "roofSquares", "label": "Roof Squares (100 sq ft)", "unit": "Squares"},
                    {"name": "bundlesNeeded", "label": "Shingle Bundles (3 bundles/square)", "unit": "Bundles"}
                ],
                "formula": "ActualArea = BaseArea * PitchMultiplier * (1 + Waste/100); Squares = ActualArea / 100; Bundles = ceil(Squares * 3)",
                "editorialGuide": "Step-by-step contractor guide to measuring roof pitch, starter shingles, ridge caps, valley underlayment, and drip edge flashing."
            }
        }
    ]

    for item in curated_pool:
        if item["targetKeyword"].lower() not in existing_keywords:
            return item
    return None

def run_seo_agent():
    print(f"[{datetime.now().isoformat()}] === TryCalc Autonomous 24x7 SEO Agent Starting ===")
    proposals_file = get_proposals_file()
    print(f"[{datetime.now().isoformat()}] Target proposals file: {proposals_file}")

    existing_proposals = read_proposals(proposals_file)
    existing_keywords = {p.get("targetKeyword", "").strip().lower() for p in existing_proposals}
    print(f"[{datetime.now().isoformat()}] Current proposals count: {len(existing_proposals)}")

    api_key = get_openrouter_api_key()
    new_item = None
    source_model = "heuristic-curated"

    if api_key:
        print(f"[{datetime.now().isoformat()}] OpenRouter API Key detected (prefix: {api_key[:12]}...). Requesting LLM...")
        new_item, source_model = query_openrouter_llm(api_key, existing_keywords)
    else:
        print(f"[{datetime.now().isoformat()}] No OpenRouter API key found in env or files.")

    if not new_item:
        print(f"[{datetime.now().isoformat()}] OpenRouter unavailable or exhausted daily quota. Utilizing high-value curated intelligence pool...")
        new_item = get_curated_fallback(existing_keywords)
        source_model = "curated-discovery-pool"

    if not new_item:
        print(f"[{datetime.now().isoformat()}] All candidate keywords already proposed. Pipeline is currently saturated.")
        return

    timestamp = datetime.utcnow().isoformat() + "Z"
    proposal_id = f"seo-auto-{int(time.time())}"

    proposal_obj = {
        "id": proposal_id,
        "targetKeyword": new_item.get("targetKeyword", "Automated Calculator Idea"),
        "category": new_item.get("category", "Finance"),
        "slug": new_item.get("slug", f"/calculators/auto-{int(time.time())}"),
        "searchVolume": int(new_item.get("searchVolume", 20000)),
        "searchVolumeFormatted": f"{int(new_item.get('searchVolume', 20000)):,}/mo",
        "difficulty": int(new_item.get("difficulty", 25)),
        "difficultyLevel": f"{int(new_item.get('difficulty', 25))} - {'Low' if int(new_item.get('difficulty', 25)) < 30 else 'Moderate'}",
        "cpc": float(new_item.get("cpc", 3.0)),
        "estEcpm": float(new_item.get("estEcpm", 5.0)),
        "potentialMonthlyTraffic": int(new_item.get("potentialMonthlyTraffic", 6000)),
        "estMonthlyRevenue": float(new_item.get("estMonthlyRevenue", 30.0)),
        "status": "pending",
        "prosBangla": new_item.get("prosBangla", ["উচ্চ সার্চ ভলিউম এবং লো কম্পিটিশন।", "বিজ্ঞাপন রেভিনিউ প্রবৃদ্ধির চমৎকার সম্ভাবনা।"]),
        "consBangla": new_item.get("consBangla", ["ফর্মুলা শতভাগ নির্ভুল রাখা আবশ্যক।"]),
        "spec": new_item.get("spec", {
            "inputs": [{"name": "value", "type": "number", "label": "Value", "defaultValue": 100}],
            "outputs": [{"name": "result", "label": "Result"}],
            "formula": "value * 1.0",
            "editorialGuide": "Comprehensive guide for user education and search engine compliance."
        }),
        "isDemo": False,
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "sourceModel": source_model
    }

    # Prepend new proposal so it shows at the top of /imon/seo-team
    existing_proposals.insert(0, proposal_obj)
    write_proposals(proposals_file, existing_proposals)
    print(f"[{datetime.now().isoformat()}] [SUCCESS] New proposal generated and committed: '{proposal_obj['targetKeyword']}' (ID: {proposal_id}) via {source_model}")
    print(f"[{datetime.now().isoformat()}] Total proposals in database: {len(existing_proposals)}")

if __name__ == "__main__":
    run_seo_agent()
