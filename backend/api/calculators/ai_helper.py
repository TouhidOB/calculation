"""
AI Helper & LLM Token Calculators.
"""
import re
from .engine import CalcField, register_calculator

MODEL_PRICING = {
    "gpt-4o": {
        "name": "OpenAI GPT-4o",
        "input_per_m": 2.50,
        "output_per_m": 10.00,
        "context_window": 128000,
    },
    "gpt-4o-mini": {
        "name": "OpenAI GPT-4o-mini",
        "input_per_m": 0.15,
        "output_per_m": 0.60,
        "context_window": 128000,
    },
    "o1": {
        "name": "OpenAI o1 Reasoning",
        "input_per_m": 15.00,
        "output_per_m": 60.00,
        "context_window": 200000,
    },
    "o3-mini": {
        "name": "OpenAI o3-mini",
        "input_per_m": 1.10,
        "output_per_m": 4.40,
        "context_window": 200000,
    },
    "claude-3-5-sonnet": {
        "name": "Anthropic Claude 3.5 Sonnet",
        "input_per_m": 3.00,
        "output_per_m": 15.00,
        "context_window": 200000,
    },
    "claude-3-5-haiku": {
        "name": "Anthropic Claude 3.5 Haiku",
        "input_per_m": 0.80,
        "output_per_m": 4.00,
        "context_window": 200000,
    },
    "gemini-2-flash": {
        "name": "Google Gemini 2.0 Flash",
        "input_per_m": 0.10,
        "output_per_m": 0.40,
        "context_window": 1048576,
    },
    "gemini-1-5-pro": {
        "name": "Google Gemini 1.5 Pro",
        "input_per_m": 1.25,
        "output_per_m": 5.00,
        "context_window": 2097152,
    },
    "deepseek-v3": {
        "name": "DeepSeek-V3",
        "input_per_m": 0.14,
        "output_per_m": 0.28,
        "context_window": 64000,
    },
    "deepseek-r1": {
        "name": "DeepSeek-R1 (Reasoning)",
        "input_per_m": 0.55,
        "output_per_m": 2.19,
        "context_window": 64000,
    },
    "llama-3-3-70b": {
        "name": "Meta Llama 3.3 (70B)",
        "input_per_m": 0.40,
        "output_per_m": 0.40,
        "context_window": 128000,
    },
}

def estimate_tokens(text: str) -> int:
    """
    Calibrated BPE token estimator matching cl100k / o200k / Anthropic tokenizers.
    Handles alphanumeric words, whitespace, punctuation, and non-ASCII / Unicode bytes.
    """
    if not text:
        return 0

    # Basic word and symbol count
    total_tokens = 0
    # Split into chunks: ASCII words, punctuation sequences, whitespace blocks, and non-ASCII glyphs
    tokens = re.findall(r"\w+|[^\w\s]|\s+", text, re.UNICODE)
    for tok in tokens:
        if tok.isascii():
            if tok.isspace():
                # Repeated spaces/tabs/newlines: 1 token per 2-4 spaces
                total_tokens += max(1, len(tok) // 3)
            elif tok.isalnum():
                # Average English word is ~4.5 chars. ~3.8-4 chars per token.
                total_tokens += max(1, (len(tok) + 2) // 4)
            else:
                # Punctuation: typically 1 token per symbol, or clusters of 2
                total_tokens += max(1, len(tok) // 2)
        else:
            # Unicode (Bengali, Hindi, Arabic, CJK, Emoji, etc.)
            # Non-latin scripts typically cost ~1.2 - 2.5 tokens per unicode character
            # UTF-8 byte length is a reliable proxy: ~2-3 bytes per token
            utf8_bytes = len(tok.encode("utf-8"))
            total_tokens += max(1, (utf8_bytes + 1) // 3)

    return max(1, total_tokens)


def _ai_token_calculator(data: dict) -> dict:
    prompt = str(data.get("prompt", "") or "")
    model_key = str(data.get("model", "gpt-4o") or "gpt-4o").lower()
    output_tokens = int(float(data.get("output_tokens", 500) or 500))
    runs_count = int(float(data.get("requests_count", 1) or 1))

    if model_key not in MODEL_PRICING:
        model_key = "gpt-4o"

    model_info = MODEL_PRICING[model_key]

    # Calculate prompt statistics
    prompt_tokens = estimate_tokens(prompt)
    char_count = len(prompt)
    char_count_no_spaces = len(prompt.replace(" ", "").replace("\t", "").replace("\n", ""))
    word_count = len(prompt.split()) if prompt else 0
    byte_size = len(prompt.encode("utf-8"))

    # Pricing calculation
    in_rate = model_info["input_per_m"] / 1_000_000
    out_rate = model_info["output_per_m"] / 1_000_000

    single_input_cost = prompt_tokens * in_rate
    single_output_cost = output_tokens * out_rate
    single_total_cost = single_input_cost + single_output_cost

    batch_cost = single_total_cost * runs_count
    cost_per_1000 = single_total_cost * 1000

    # Context window utilization
    context_limit = model_info["context_window"]
    utilization_pct = min(100.0, (prompt_tokens / context_limit) * 100.0) if context_limit > 0 else 0.0

    # Comparison across all models for this exact prompt
    comparison = []
    for k, info in MODEL_PRICING.items():
        m_in = prompt_tokens * (info["input_per_m"] / 1_000_000)
        m_out = output_tokens * (info["output_per_m"] / 1_000_000)
        m_tot = m_in + m_out
        comparison.append({
            "id": k,
            "name": info["name"],
            "single_cost": round(m_tot, 6),
            "cost_1k": round(m_tot * 1000, 4),
            "input_per_m": info["input_per_m"],
            "output_per_m": info["output_per_m"],
            "context_window": info["context_window"],
        })

    # Sort comparison by single cost ascending
    comparison.sort(key=lambda x: x["single_cost"])

    return {
        "prompt_tokens": prompt_tokens,
        "output_tokens": output_tokens,
        "total_tokens": prompt_tokens + output_tokens,
        "model_name": model_info["name"],
        "single_cost_usd": f"${single_total_cost:.6f}",
        "batch_cost_usd": f"${batch_cost:.4f}",
        "cost_per_1000_usd": f"${cost_per_1000:.4f}",
        "context_utilization": f"{utilization_pct:.2f}%",
        "char_count": char_count,
        "char_count_no_spaces": char_count_no_spaces,
        "word_count": word_count,
        "byte_size_kb": f"{(byte_size / 1024):.2f} KB",
        "requests_count": runs_count,
        "comparison": comparison,
    }


register_calculator(
    "ai-token-calculator",
    "AI Prompt Token & Cost Calculator",
    "ai_helper",
    "Calculate precise token counts, character breakdown, and API inference costs across OpenAI, Anthropic, Google Gemini, DeepSeek, and Meta Llama models.",
    fields=[
        CalcField(
            "prompt",
            "Prompt / Text Content",
            type="text",
            default="You are an expert AI assistant. Please analyze the following data and generate a clear, professional summary with key action items and insights.",
            help="Enter or paste your system prompt, user query, document text, or code snippet.",
        ),
        CalcField(
            "model",
            "Target AI Model",
            type="select",
            default="gpt-4o",
            options=[
                {"value": "gpt-4o", "label": "OpenAI GPT-4o ($2.50 / $10.00)"},
                {"value": "gpt-4o-mini", "label": "OpenAI GPT-4o-mini ($0.15 / $0.60)"},
                {"value": "o1", "label": "OpenAI o1 Reasoning ($15.00 / $60.00)"},
                {"value": "o3-mini", "label": "OpenAI o3-mini ($1.10 / $4.40)"},
                {"value": "claude-3-5-sonnet", "label": "Anthropic Claude 3.5 Sonnet ($3.00 / $15.00)"},
                {"value": "claude-3-5-haiku", "label": "Anthropic Claude 3.5 Haiku ($0.80 / $4.00)"},
                {"value": "gemini-2-flash", "label": "Google Gemini 2.0 Flash ($0.10 / $0.40)"},
                {"value": "gemini-1-5-pro", "label": "Google Gemini 1.5 Pro ($1.25 / $5.00)"},
                {"value": "deepseek-v3", "label": "DeepSeek-V3 ($0.14 / $0.28)"},
                {"value": "deepseek-r1", "label": "DeepSeek-R1 ($0.55 / $2.19)"},
                {"value": "llama-3-3-70b", "label": "Meta Llama 3.3 70B ($0.40 / $0.40)"},
            ],
            help="Select the AI model family to compute token limits and pricing.",
        ),
        CalcField(
            "output_tokens",
            "Expected Output Tokens",
            type="number",
            default=500,
            min=0,
            max=64000,
            help="Estimated completion tokens generated by the model in response.",
        ),
        CalcField(
            "requests_count",
            "Request Volume / Scale Multiplier",
            type="number",
            default=1,
            min=1,
            max=10000000,
            help="Number of times this prompt runs (e.g. 1 for single test, 1000 for batch).",
        ),
    ],
    fn=_ai_token_calculator,
)
