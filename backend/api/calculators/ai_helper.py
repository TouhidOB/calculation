"""
AI Helper & LLM Token Calculators.
Comprehensive support for running world AI models across OpenAI, Anthropic, Google,
DeepSeek, xAI, Meta Llama, Mistral, Alibaba Qwen, Cohere, Amazon Nova, and Microsoft Phi.
"""
import re
from .engine import CalcField, register_calculator

MODEL_PRICING = {
    # ── OpenAI ──
    "gpt-4o": {
        "name": "OpenAI GPT-4o",
        "provider": "OpenAI",
        "input_per_m": 2.50,
        "output_per_m": 10.00,
        "context_window": 128000,
    },
    "gpt-4o-mini": {
        "name": "OpenAI GPT-4o-mini",
        "provider": "OpenAI",
        "input_per_m": 0.15,
        "output_per_m": 0.60,
        "context_window": 128000,
    },
    "o1": {
        "name": "OpenAI o1 Reasoning",
        "provider": "OpenAI",
        "input_per_m": 15.00,
        "output_per_m": 60.00,
        "context_window": 200000,
    },
    "o1-mini": {
        "name": "OpenAI o1-mini",
        "provider": "OpenAI",
        "input_per_m": 1.10,
        "output_per_m": 4.40,
        "context_window": 128000,
    },
    "o3-mini": {
        "name": "OpenAI o3-mini",
        "provider": "OpenAI",
        "input_per_m": 1.10,
        "output_per_m": 4.40,
        "context_window": 200000,
    },
    "gpt-4-turbo": {
        "name": "OpenAI GPT-4 Turbo",
        "provider": "OpenAI",
        "input_per_m": 10.00,
        "output_per_m": 30.00,
        "context_window": 128000,
    },
    "gpt-3-5-turbo": {
        "name": "OpenAI GPT-3.5 Turbo",
        "provider": "OpenAI",
        "input_per_m": 0.50,
        "output_per_m": 1.50,
        "context_window": 16385,
    },

    # ── Anthropic ──
    "claude-3-7-sonnet": {
        "name": "Anthropic Claude 3.7 Sonnet",
        "provider": "Anthropic",
        "input_per_m": 3.00,
        "output_per_m": 15.00,
        "context_window": 200000,
    },
    "claude-3-5-sonnet": {
        "name": "Anthropic Claude 3.5 Sonnet",
        "provider": "Anthropic",
        "input_per_m": 3.00,
        "output_per_m": 15.00,
        "context_window": 200000,
    },
    "claude-3-5-haiku": {
        "name": "Anthropic Claude 3.5 Haiku",
        "provider": "Anthropic",
        "input_per_m": 0.80,
        "output_per_m": 4.00,
        "context_window": 200000,
    },
    "claude-3-opus": {
        "name": "Anthropic Claude 3 Opus",
        "provider": "Anthropic",
        "input_per_m": 15.00,
        "output_per_m": 75.00,
        "context_window": 200000,
    },

    # ── Google Gemini ──
    "gemini-2-flash": {
        "name": "Google Gemini 2.0 Flash",
        "provider": "Google",
        "input_per_m": 0.10,
        "output_per_m": 0.40,
        "context_window": 1048576,
    },
    "gemini-2-flash-lite": {
        "name": "Google Gemini 2.0 Flash-Lite",
        "provider": "Google",
        "input_per_m": 0.075,
        "output_per_m": 0.30,
        "context_window": 1048576,
    },
    "gemini-1-5-pro": {
        "name": "Google Gemini 1.5 Pro",
        "provider": "Google",
        "input_per_m": 1.25,
        "output_per_m": 5.00,
        "context_window": 2097152,
    },
    "gemini-1-5-flash": {
        "name": "Google Gemini 1.5 Flash",
        "provider": "Google",
        "input_per_m": 0.075,
        "output_per_m": 0.30,
        "context_window": 1048576,
    },

    # ── DeepSeek ──
    "deepseek-v3": {
        "name": "DeepSeek-V3",
        "provider": "DeepSeek",
        "input_per_m": 0.14,
        "output_per_m": 0.28,
        "context_window": 64000,
    },
    "deepseek-r1": {
        "name": "DeepSeek-R1 (Reasoning)",
        "provider": "DeepSeek",
        "input_per_m": 0.55,
        "output_per_m": 2.19,
        "context_window": 64000,
    },

    # ── xAI (Grok) ──
    "grok-2": {
        "name": "xAI Grok 2",
        "provider": "xAI",
        "input_per_m": 2.00,
        "output_per_m": 10.00,
        "context_window": 128000,
    },
    "grok-2-mini": {
        "name": "xAI Grok 2 mini",
        "provider": "xAI",
        "input_per_m": 0.20,
        "output_per_m": 1.00,
        "context_window": 128000,
    },

    # ── Meta Llama ──
    "llama-3-3-70b": {
        "name": "Meta Llama 3.3 (70B)",
        "provider": "Meta",
        "input_per_m": 0.40,
        "output_per_m": 0.40,
        "context_window": 128000,
    },
    "llama-3-1-405b": {
        "name": "Meta Llama 3.1 (405B)",
        "provider": "Meta",
        "input_per_m": 2.00,
        "output_per_m": 2.00,
        "context_window": 128000,
    },
    "llama-3-1-8b": {
        "name": "Meta Llama 3.1 (8B)",
        "provider": "Meta",
        "input_per_m": 0.05,
        "output_per_m": 0.05,
        "context_window": 128000,
    },

    # ── Mistral AI ──
    "mistral-large": {
        "name": "Mistral Large 2",
        "provider": "Mistral",
        "input_per_m": 2.00,
        "output_per_m": 6.00,
        "context_window": 128000,
    },
    "mistral-small": {
        "name": "Mistral Small 3",
        "provider": "Mistral",
        "input_per_m": 0.20,
        "output_per_m": 0.60,
        "context_window": 32000,
    },
    "codestral": {
        "name": "Mistral Codestral",
        "provider": "Mistral",
        "input_per_m": 0.30,
        "output_per_m": 0.90,
        "context_window": 256000,
    },

    # ── Alibaba Qwen ──
    "qwen-2-5-72b": {
        "name": "Qwen 2.5 (72B)",
        "provider": "Qwen",
        "input_per_m": 0.35,
        "output_per_m": 0.40,
        "context_window": 128000,
    },
    "qwen-2-5-coder-32b": {
        "name": "Qwen 2.5 Coder (32B)",
        "provider": "Qwen",
        "input_per_m": 0.15,
        "output_per_m": 0.15,
        "context_window": 128000,
    },
    "qwq-32b-preview": {
        "name": "QwQ 32B (Reasoning)",
        "provider": "Qwen",
        "input_per_m": 0.15,
        "output_per_m": 0.15,
        "context_window": 32000,
    },

    # ── Cohere ──
    "command-r-plus": {
        "name": "Cohere Command R+",
        "provider": "Cohere",
        "input_per_m": 2.50,
        "output_per_m": 10.00,
        "context_window": 128000,
    },
    "command-r": {
        "name": "Cohere Command R",
        "provider": "Cohere",
        "input_per_m": 0.15,
        "output_per_m": 0.60,
        "context_window": 128000,
    },

    # ── Amazon Nova ──
    "amazon-nova-pro": {
        "name": "Amazon Nova Pro",
        "provider": "Amazon",
        "input_per_m": 0.80,
        "output_per_m": 3.20,
        "context_window": 300000,
    },
    "amazon-nova-lite": {
        "name": "Amazon Nova Lite",
        "provider": "Amazon",
        "input_per_m": 0.06,
        "output_per_m": 0.24,
        "context_window": 300000,
    },
    "amazon-nova-micro": {
        "name": "Amazon Nova Micro",
        "provider": "Amazon",
        "input_per_m": 0.035,
        "output_per_m": 0.14,
        "context_window": 128000,
    },

    # ── Microsoft Phi ──
    "phi-4": {
        "name": "Microsoft Phi-4",
        "provider": "Microsoft",
        "input_per_m": 0.07,
        "output_per_m": 0.14,
        "context_window": 16384,
    },
}

DEFAULT_PROMPT = (
    "You are an expert AI assistant. Please analyze the following data and generate "
    "a clear, professional summary with key action items and insights."
)


def _estimate_tokens(text: str, model_id: str) -> int:
    """Accurately estimate token count based on model family and language characteristics."""
    if not text:
        return 0

    latin_chars = len(re.findall(r"[A-Za-z0-9]", text))
    whitespace_chars = len(re.findall(r"\s", text))
    punct_chars = len(re.findall(r"[^\w\s]", text))
    cjk_chars = len(re.findall(r"[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]", text))
    indic_chars = len(re.findall(r"[\u0980-\u09ff\u0900-\u097f]", text))
    total_chars = len(text)
    words = len(text.split())

    # Multi-lingual tokenizer expansion weighting
    indic_cjk = cjk_chars + indic_chars
    other_chars = total_chars - latin_chars - whitespace_chars - punct_chars - indic_cjk

    base_tokens = (
        (latin_chars * 0.27)
        + (whitespace_chars * 0.3)
        + (punct_chars * 0.7)
        + (indic_cjk * 1.85)
        + (other_chars * 1.2)
    )

    # Word-based heuristic lower-bound
    word_tokens = words * 1.32 if words > 0 else 0
    raw_estimate = max(base_tokens, word_tokens)

    # Family-specific calibration factors
    if "gemini" in model_id:
        raw_estimate *= 0.96
    elif "claude" in model_id:
        raw_estimate *= 1.02
    elif "deepseek" in model_id or "qwen" in model_id:
        raw_estimate *= 0.98
    elif "llama" in model_id or "mistral" in model_id:
        raw_estimate *= 1.04
    elif "nova" in model_id:
        raw_estimate *= 0.97

    return max(1, int(round(raw_estimate)))


def _ai_token_calculator(values: dict) -> dict:
    prompt = str(values.get("prompt") or DEFAULT_PROMPT)
    model_id = str(values.get("model") or "gpt-4o")
    output_tokens = int(values.get("output_tokens") or 500)
    requests_count = max(1, int(values.get("requests_count") or 1))

    if model_id not in MODEL_PRICING:
        model_id = "gpt-4o"

    pricing = MODEL_PRICING[model_id]
    prompt_tokens = _estimate_tokens(prompt, model_id)
    total_tokens_per_req = prompt_tokens + output_tokens

    chars_count = len(prompt)
    words_count = len(prompt.split())
    bytes_count = len(prompt.encode("utf-8"))

    # Cost calculations
    input_cost_per_req = (prompt_tokens / 1_000_000.0) * pricing["input_per_m"]
    output_cost_per_req = (output_tokens / 1_000_000.0) * pricing["output_per_m"]
    total_cost_per_req = input_cost_per_req + output_cost_per_req

    total_batch_cost = total_cost_per_req * requests_count
    cost_per_thousand = total_cost_per_req * 1_000.0
    cost_per_million = total_cost_per_req * 1_000_000.0

    context_window = pricing["context_window"]
    context_utilization = min(100.0, (total_tokens_per_req / context_window) * 100.0)

    # Multi-model comparison
    model_comparisons = []
    for mid, info in MODEL_PRICING.items():
        m_tokens = _estimate_tokens(prompt, mid)
        m_in = (m_tokens / 1_000_000.0) * info["input_per_m"]
        m_out = (output_tokens / 1_000_000.0) * info["output_per_m"]
        m_total = m_in + m_out
        model_comparisons.append({
            "model_id": mid,
            "name": info["name"],
            "provider": info["provider"],
            "prompt_tokens": m_tokens,
            "input_per_m": info["input_per_m"],
            "output_per_m": info["output_per_m"],
            "single_cost": round(m_total, 6),
            "batch_cost": round(m_total * requests_count, 4),
            "thousand_runs_cost": round(m_total * 1_000.0, 4),
        })

    model_comparisons.sort(key=lambda x: x["single_cost"])

    return {
        "status": "ok",
        "prompt_tokens": prompt_tokens,
        "output_tokens": output_tokens,
        "total_tokens_per_request": total_tokens_per_req,
        "characters": chars_count,
        "words": words_count,
        "bytes": bytes_count,
        "tokens_per_word": round(prompt_tokens / max(1, words_count), 2),
        "selected_model": {
            "id": model_id,
            "name": pricing["name"],
            "provider": pricing["provider"],
            "input_per_m": pricing["input_per_m"],
            "output_per_m": pricing["output_per_m"],
            "context_window": context_window,
            "context_utilization_percent": round(context_utilization, 3),
        },
        "costs": {
            "input_cost_single": f"${input_cost_per_req:.6f}",
            "output_cost_single": f"${output_cost_per_req:.6f}",
            "total_cost_single": f"${total_cost_per_req:.6f}",
            "batch_cost": f"${total_batch_cost:.4f}",
            "cost_per_1000_requests": f"${cost_per_thousand:.2f}",
            "cost_per_million_requests": f"${cost_per_million:.2f}",
        },
        "comparison_matrix": model_comparisons,
    }


# Generate dropdown options grouped by provider
MODEL_OPTIONS = [
    {"value": mid, "label": f"{info['provider']}: {info['name']} (${info['input_per_m']:.2f} / ${info['output_per_m']:.2f})"}
    for mid, info in MODEL_PRICING.items()
]

register_calculator(
    "ai-token-calculator",
    "AI Prompt Token & Cost Calculator",
    "ai_helper",
    "AI Prompt Token & Cost Calculator",
    fields=[
        CalcField(
            "prompt",
            "Prompt / Text Payload",
            type="text",
            default=DEFAULT_PROMPT,
            help="Enter or paste your system prompt, user query, document text, or code snippet.",
        ),
        CalcField(
            "model",
            "Target AI Model",
            type="select",
            default="gpt-4o",
            options=MODEL_OPTIONS,
            help="Select the AI model family to compute token limits and pricing.",
        ),
        CalcField(
            "output_tokens",
            "Expected Output Tokens",
            type="number",
            default=500,
            min=0,
            max=128000,
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
