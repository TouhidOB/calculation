"""
AI Helper & Automation Suite Calculators.
Comprehensive implementation for all 50 AI, Token, Agent, and Business ROI Calculators.
"""
import math
import re
from .engine import CalcField, register_calculator

# ─────────────────────────────────────────────────────────────────────────────
# Core Models & Pricing Database (USD per 1 Million Tokens)
# ─────────────────────────────────────────────────────────────────────────────
FRONTIER_MODELS = {
    "gpt-4o": {
        "name": "OpenAI GPT-4o",
        "provider": "OpenAI",
        "input_per_m": 2.50,
        "output_per_m": 10.00,
        "cached_input_per_m": 1.25,
        "context_window": 128000,
        "max_output": 16384,
        "tok_per_word": 1.33,
    },
    "gpt-4o-mini": {
        "name": "OpenAI GPT-4o-mini",
        "provider": "OpenAI",
        "input_per_m": 0.15,
        "output_per_m": 0.60,
        "cached_input_per_m": 0.075,
        "context_window": 128000,
        "max_output": 16384,
        "tok_per_word": 1.33,
    },
    "o1": {
        "name": "OpenAI o1 Reasoning",
        "provider": "OpenAI",
        "input_per_m": 15.00,
        "output_per_m": 60.00,
        "cached_input_per_m": 7.50,
        "context_window": 200000,
        "max_output": 100000,
        "tok_per_word": 1.35,
    },
    "o3-mini": {
        "name": "OpenAI o3-mini",
        "provider": "OpenAI",
        "input_per_m": 1.10,
        "output_per_m": 4.40,
        "cached_input_per_m": 0.55,
        "context_window": 200000,
        "max_output": 100000,
        "tok_per_word": 1.35,
    },
    "claude-3-7-sonnet": {
        "name": "Anthropic Claude 3.7 Sonnet",
        "provider": "Anthropic",
        "input_per_m": 3.00,
        "output_per_m": 15.00,
        "cached_input_per_m": 0.30,
        "context_window": 200000,
        "max_output": 64000,
        "tok_per_word": 1.36,
    },
    "claude-3-5-sonnet": {
        "name": "Anthropic Claude 3.5 Sonnet",
        "provider": "Anthropic",
        "input_per_m": 3.00,
        "output_per_m": 15.00,
        "cached_input_per_m": 0.30,
        "context_window": 200000,
        "max_output": 8192,
        "tok_per_word": 1.36,
    },
    "claude-3-5-haiku": {
        "name": "Anthropic Claude 3.5 Haiku",
        "provider": "Anthropic",
        "input_per_m": 0.80,
        "output_per_m": 4.00,
        "cached_input_per_m": 0.08,
        "context_window": 200000,
        "max_output": 8192,
        "tok_per_word": 1.35,
    },
    "gemini-2-flash": {
        "name": "Google Gemini 2.0 Flash",
        "provider": "Google",
        "input_per_m": 0.10,
        "output_per_m": 0.40,
        "cached_input_per_m": 0.025,
        "context_window": 1048576,
        "max_output": 8192,
        "tok_per_word": 1.28,
    },
    "gemini-1-5-pro": {
        "name": "Google Gemini 1.5 Pro",
        "provider": "Google",
        "input_per_m": 1.25,
        "output_per_m": 5.00,
        "cached_input_per_m": 0.3125,
        "context_window": 2097152,
        "max_output": 8192,
        "tok_per_word": 1.28,
    },
    "deepseek-r1": {
        "name": "DeepSeek R1 Reasoning",
        "provider": "DeepSeek",
        "input_per_m": 0.55,
        "output_per_m": 2.19,
        "cached_input_per_m": 0.14,
        "context_window": 64000,
        "max_output": 8192,
        "tok_per_word": 1.31,
    },
    "deepseek-v3": {
        "name": "DeepSeek V3",
        "provider": "DeepSeek",
        "input_per_m": 0.14,
        "output_per_m": 0.28,
        "cached_input_per_m": 0.014,
        "context_window": 64000,
        "max_output": 8192,
        "tok_per_word": 1.31,
    },
    "llama-3-3-70b": {
        "name": "Meta Llama 3.3 70B",
        "provider": "Meta (Groq/Together)",
        "input_per_m": 0.59,
        "output_per_m": 0.79,
        "cached_input_per_m": 0.59,
        "context_window": 128000,
        "max_output": 4096,
        "tok_per_word": 1.38,
    },
}

MODEL_SELECT_OPTIONS = [
    {"value": k, "label": f"{v['provider']}: {v['name']} (${v['input_per_m']:.2f} in / ${v['output_per_m']:.2f} out)"}
    for k, v in FRONTIER_MODELS.items()
]

def estimate_tokens(text: str, model_id: str = "gpt-4o") -> int:
    if not text:
        return 0
    latin = len(re.findall(r"[A-Za-z0-9]", text))
    ws = len(re.findall(r"\s", text))
    punct = len(re.findall(r"[^\w\s]", text))
    cjk = len(re.findall(r"[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]", text))
    indic = len(re.findall(r"[\u0980-\u09ff\u0900-\u097f]", text))
    total_len = len(text)
    words = len(text.split())

    subword = (latin * 0.27) + (ws * 0.3) + (punct * 0.7) + ((cjk + indic) * 1.85)
    other = (total_len - latin - ws - punct - cjk - indic) * 1.2
    raw = max(subword + other, words * 1.32)

    if "gemini" in model_id:
        raw *= 0.96
    elif "claude" in model_id:
        raw *= 1.02
    elif "deepseek" in model_id:
        raw *= 0.98
    elif "llama" in model_id:
        raw *= 1.04
    return max(1, int(round(raw)))


# ═════════════════════════════════════════════════════════════════════════════
# BATCH 1: Prompt & Token Engineering (Tools 2 - 6)
# ═════════════════════════════════════════════════════════════════════════════

# 2. Multi-Model Token Counter
def _multi_model_token_counter(vals: dict) -> dict:
    prompt = str(vals.get("prompt") or "Analyze financial risks in Q3 portfolio expansion.")
    output_tokens = int(vals.get("output_tokens") or 500)
    monthly_queries = int(vals.get("monthly_queries") or 1000)

    rows = []
    for mid, info in FRONTIER_MODELS.items():
        toks = estimate_tokens(prompt, mid)
        in_cost = (toks / 1_000_000.0) * info["input_per_m"]
        out_cost = (output_tokens / 1_000_000.0) * info["output_per_m"]
        single = in_cost + out_cost
        rows.append({
            "model": info["name"],
            "provider": info["provider"],
            "prompt_tokens": toks,
            "cost_per_query": f"${single:.6f}",
            "monthly_cost": f"${single * monthly_queries:.2f}",
            "context_window": f"{info['context_window']:,} tokens",
        })

    return {
        "status": "ok",
        "char_count": len(prompt),
        "word_count": len(prompt.split()),
        "monthly_queries": monthly_queries,
        "models_evaluated": len(rows),
        "comparison_table": rows,
    }

register_calculator(
    "multi-model-token-counter",
    "Multi-Model Token Counter & Cost Comparison",
    "ai_helper",
    "Compare prompt token counts and API invocation costs side-by-side across OpenAI, Claude, Gemini, DeepSeek, and Meta Llama.",
    fields=[
        CalcField("prompt", "Prompt / Text Payload", type="text", default="Analyze financial risks in Q3 portfolio expansion."),
        CalcField("output_tokens", "Expected Output Tokens", type="number", default=500, min=10, max=100000),
        CalcField("monthly_queries", "Monthly Query Volume", type="number", default=1000, min=1, max=10000000),
    ],
    fn=_multi_model_token_counter,
)

# 3. Context-Window Budget Calculator
def _context_window_budget_calculator(vals: dict) -> dict:
    model_id = str(vals.get("model") or "gpt-4o")
    system_tokens = int(vals.get("system_tokens") or 1500)
    history_tokens = int(vals.get("history_tokens") or 12000)
    rag_tokens = int(vals.get("rag_tokens") or 8000)
    user_tokens = int(vals.get("user_tokens") or 450)
    max_output = int(vals.get("max_output") or 4096)

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    total_context = m["context_window"]
    total_input = system_tokens + history_tokens + rag_tokens + user_tokens
    total_consumed = total_input + max_output
    remaining_headroom = total_context - total_consumed
    utilization_pct = min(100.0, (total_consumed / total_context) * 100.0)

    in_cost = (total_input / 1_000_000.0) * m["input_per_m"]
    out_cost = (max_output / 1_000_000.0) * m["output_per_m"]
    total_cost = in_cost + out_cost

    return {
        "status": "ok",
        "model_name": m["name"],
        "context_capacity": f"{total_context:,} tokens",
        "total_consumed_tokens": f"{total_consumed:,} tokens",
        "remaining_headroom": f"{max(0, remaining_headroom):,} tokens",
        "utilization_percent": f"{utilization_pct:.2f}%",
        "is_overflow": total_consumed > total_context,
        "token_breakdown": {
            "system_prompt": f"{system_tokens:,} ({system_tokens / max(1, total_consumed) * 100:.1f}%)",
            "chat_history": f"{history_tokens:,} ({history_tokens / max(1, total_consumed) * 100:.1f}%)",
            "rag_context": f"{rag_tokens:,} ({rag_tokens / max(1, total_consumed) * 100:.1f}%)",
            "user_prompt": f"{user_tokens:,} ({user_tokens / max(1, total_consumed) * 100:.1f}%)",
            "output_reservation": f"{max_output:,} ({max_output / max(1, total_consumed) * 100:.1f}%)",
        },
        "per_turn_cost": f"${total_cost:.4f}",
    }

register_calculator(
    "context-window-budget-calculator",
    "Context-Window Budget & Headroom Calculator",
    "ai_helper",
    "Allocate context window quotas across system prompts, conversation history, RAG chunks, and output headroom to avoid context overflow.",
    fields=[
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
        CalcField("system_tokens", "System Instructions (Tokens)", type="number", default=1500, min=0, max=100000),
        CalcField("history_tokens", "Chat History / Memory (Tokens)", type="number", default=12000, min=0, max=500000),
        CalcField("rag_tokens", "RAG Document Retrieval (Tokens)", type="number", default=8000, min=0, max=1000000),
        CalcField("user_tokens", "User Prompt (Tokens)", type="number", default=450, min=1, max=100000),
        CalcField("max_output", "Reserved Output (Tokens)", type="number", default=4096, min=128, max=100000),
    ],
    fn=_context_window_budget_calculator,
)

# 4. System Prompt Token Calculator
def _system_prompt_token_calculator(vals: dict) -> dict:
    system_text = str(vals.get("system_text") or "You are an enterprise AI data assistant. Always format responses in Markdown tables with cited sources.")
    few_shot_examples = int(vals.get("few_shot_examples") or 3)
    avg_example_tokens = int(vals.get("avg_example_tokens") or 250)
    model_id = str(vals.get("model") or "gpt-4o")
    daily_runs = int(vals.get("daily_runs") or 5000)

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    base_tokens = estimate_tokens(system_text, model_id)
    few_shot_tokens = few_shot_examples * avg_example_tokens
    total_system_tokens = base_tokens + few_shot_tokens

    # Daily & Monthly Cost Without Caching
    uncached_daily = (total_system_tokens * daily_runs / 1_000_000.0) * m["input_per_m"]
    # With Prompt Caching (assume 90% cache hit rate)
    cached_daily = (total_system_tokens * daily_runs / 1_000_000.0) * (0.1 * m["input_per_m"] + 0.9 * m["cached_input_per_m"])
    daily_savings = uncached_daily - cached_daily

    return {
        "status": "ok",
        "base_system_tokens": base_tokens,
        "few_shot_tokens": few_shot_tokens,
        "total_system_overhead": f"{total_system_tokens:,} tokens",
        "uncached_monthly_cost": f"${uncached_daily * 30:.2f}",
        "cached_monthly_cost": f"${cached_daily * 30:.2f}",
        "monthly_prompt_cache_savings": f"${daily_savings * 30:.2f}",
        "percent_cost_reduction": f"{(daily_savings / max(0.0001, uncached_daily)) * 100:.1f}%",
    }

register_calculator(
    "system-prompt-token-calculator",
    "System Prompt Token & Cache Savings Calculator",
    "ai_helper",
    "Calculate the recurring token overhead of system instructions and few-shot examples, plus prompt caching cost reductions.",
    fields=[
        CalcField("system_text", "System Instructions / Persona", type="text", default="You are an enterprise AI data assistant. Always format responses in Markdown tables with cited sources."),
        CalcField("few_shot_examples", "Number of Few-Shot Examples", type="number", default=3, min=0, max=50),
        CalcField("avg_example_tokens", "Average Tokens Per Example", type="number", default=250, min=0, max=10000),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
        CalcField("daily_runs", "Daily Request Invocations", type="number", default=5000, min=1, max=10000000),
    ],
    fn=_system_prompt_token_calculator,
)

# 5. Conversation-History Token Calculator
def _conversation_history_token_calculator(vals: dict) -> dict:
    turns = int(vals.get("turns") or 10)
    avg_user_words = int(vals.get("avg_user_words") or 45)
    avg_assistant_words = int(vals.get("avg_assistant_words") or 220)
    model_id = str(vals.get("model") or "gpt-4o")
    context_strategy = str(vals.get("strategy") or "full") # full, sliding_5, summarize

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    tok_ratio = m["tok_per_word"]

    # In full history, turn n sends all prior turns 1..n-1
    user_tok_turn = avg_user_words * tok_ratio
    asst_tok_turn = avg_assistant_words * tok_ratio
    turn_pair = user_tok_turn + asst_tok_turn

    cumulative_tokens_sent = 0
    for i in range(1, turns + 1):
        if context_strategy == "full":
            cumulative_tokens_sent += (i * turn_pair)
        elif context_strategy == "sliding_5":
            window = min(i, 5)
            cumulative_tokens_sent += (window * turn_pair)
        else: # summarize after 4 turns
            effective = 4 * turn_pair + (200 * tok_ratio) if i > 4 else i * turn_pair
            cumulative_tokens_sent += effective

    final_turn_context = turns * turn_pair if context_strategy == "full" else (min(turns, 5) * turn_pair)
    total_cost = (cumulative_tokens_sent / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "total_turns": turns,
        "strategy": context_strategy.replace("_", " ").title(),
        "final_turn_context_tokens": f"{int(final_turn_context):,} tokens",
        "total_accumulated_input_tokens": f"{int(cumulative_tokens_sent):,} tokens",
        "conversation_cost": f"${total_cost:.4f}",
        "avg_tokens_per_turn": int(cumulative_tokens_sent / max(1, turns)),
        "recommendation": "Use sliding window or compaction for >12 turns to prevent quadratic cost explosion." if turns > 10 else "Full history within optimal budget.",
    }

register_calculator(
    "conversation-history-token-calculator",
    "Conversation History & Multi-Turn Chat Compactor",
    "ai_helper",
    "Model the quadratic token expansion across multi-turn chats and calculate token savings from sliding-window or summary compaction.",
    fields=[
        CalcField("turns", "Total Conversation Turns", type="number", default=10, min=1, max=100),
        CalcField("avg_user_words", "Avg User Query (Words)", type="number", default=45, min=5, max=1000),
        CalcField("avg_assistant_words", "Avg AI Response (Words)", type="number", default=220, min=10, max=5000),
        CalcField("strategy", "History Retention Strategy", type="select", default="full", options=[
            {"value": "full", "label": "Full Retained History (Quadratic Growth)"},
            {"value": "sliding_5", "label": "Sliding Window (Last 5 Turns Only)"},
            {"value": "summarize", "label": "Compacted Memory Summary + Last 2 Turns"},
        ]),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_conversation_history_token_calculator,
)

# 6. RAG Document Token Calculator
def _rag_document_token_calculator(vals: dict) -> dict:
    doc_words = int(vals.get("doc_words") or 25000) # ~50 pages
    chunk_size = int(vals.get("chunk_size") or 512)
    chunk_overlap = int(vals.get("chunk_overlap") or 64)
    top_k = int(vals.get("top_k") or 5)
    embedding_model = str(vals.get("embedding_model") or "text-embedding-3-small")
    llm_model = str(vals.get("llm_model") or "gpt-4o-mini")
    daily_rag_queries = int(vals.get("daily_rag_queries") or 1000)

    # Embedding pricing
    embed_prices = {
        "text-embedding-3-small": 0.02, # per 1M
        "text-embedding-3-large": 0.13,
        "cohere-embed-v3": 0.10,
    }
    embed_cost_per_m = embed_prices.get(embedding_model, 0.02)

    total_doc_tokens = int(doc_words * 1.33)
    effective_chunk_stride = max(1, chunk_size - chunk_overlap)
    total_chunks = math.ceil(total_doc_tokens / effective_chunk_stride)
    total_embedded_tokens = total_chunks * chunk_size

    # Ingestion one-time cost
    ingestion_cost = (total_embedded_tokens / 1_000_000.0) * embed_cost_per_m

    # Per-query retrieval cost
    retrieved_tokens_per_query = top_k * chunk_size
    llm_info = FRONTIER_MODELS.get(llm_model, FRONTIER_MODELS["gpt-4o-mini"])
    rag_input_cost_per_query = (retrieved_tokens_per_query / 1_000_000.0) * llm_info["input_per_m"]
    monthly_rag_llm_cost = rag_input_cost_per_query * daily_rag_queries * 30

    return {
        "status": "ok",
        "total_document_tokens": f"{total_doc_tokens:,}",
        "total_chunks_generated": f"{total_chunks:,}",
        "total_embedded_tokens": f"{total_embedded_tokens:,}",
        "vector_ingestion_cost": f"${ingestion_cost:.4f}",
        "retrieved_tokens_per_query": f"{retrieved_tokens_per_query:,} tokens (Top-{top_k})",
        "monthly_rag_inference_cost": f"${monthly_rag_llm_cost:.2f}",
        "cost_per_1000_queries": f"${rag_input_cost_per_query * 1000:.4f}",
    }

register_calculator(
    "rag-document-token-calculator",
    "RAG Document Chunking & Token Cost Calculator",
    "ai_helper",
    "Model document chunking, chunk overlap, vector embedding creation costs, and per-query RAG context injection overhead.",
    fields=[
        CalcField("doc_words", "Total Document Corpus (Words)", type="number", default=25000, min=100, max=10000000),
        CalcField("chunk_size", "Chunk Size (Tokens)", type="number", default=512, min=128, max=4096),
        CalcField("chunk_overlap", "Chunk Overlap (Tokens)", type="number", default=64, min=0, max=1024),
        CalcField("top_k", "Retrieved Chunks Per Query (Top-K)", type="number", default=5, min=1, max=50),
        CalcField("embedding_model", "Vector Embedding Model", type="select", default="text-embedding-3-small", options=[
            {"value": "text-embedding-3-small", "label": "OpenAI text-embedding-3-small ($0.02 / 1M)"},
            {"value": "text-embedding-3-large", "label": "OpenAI text-embedding-3-large ($0.13 / 1M)"},
            {"value": "cohere-embed-v3", "label": "Cohere Embed v3 English ($0.10 / 1M)"},
        ]),
        CalcField("llm_model", "RAG Generation LLM", type="select", default="gpt-4o-mini", options=MODEL_SELECT_OPTIONS),
        CalcField("daily_rag_queries", "Daily User RAG Queries", type="number", default=1000, min=1, max=1000000),
    ],
    fn=_rag_document_token_calculator,
)


# ═════════════════════════════════════════════════════════════════════════════
# BATCH 2: Document, Code & Multimodal Estimators (Tools 7 - 12)
# ═════════════════════════════════════════════════════════════════════════════

# 7. PDF Token Estimator
def _pdf_token_estimator(vals: dict) -> dict:
    pages = int(vals.get("pages") or 25)
    density = str(vals.get("density") or "standard") # sparse, standard, dense, academic
    has_tables = bool(vals.get("has_tables", True))
    model_id = str(vals.get("model") or "gpt-4o")

    density_map = {
        "sparse": 250,      # slides, large headings
        "standard": 500,    # business report, novel
        "dense": 800,       # legal contract, dense prose
        "academic": 1100,   # double-column research paper
    }
    words_per_page = density_map.get(density, 500)
    if has_tables:
        words_per_page = int(words_per_page * 1.25)

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    total_words = pages * words_per_page
    total_tokens = int(total_words * m["tok_per_word"])
    fit_in_context = total_tokens <= m["context_window"]
    doc_cost = (total_tokens / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "page_count": pages,
        "content_density": density.title(),
        "estimated_words": f"{total_words:,} words",
        "estimated_tokens": f"{total_tokens:,} tokens",
        "model_context_capacity": f"{m['context_window']:,} tokens",
        "fits_in_single_prompt": fit_in_context,
        "single_doc_ingest_cost": f"${doc_cost:.4f}",
        "batch_100_docs_cost": f"${doc_cost * 100:.2f}",
        "tokens_per_page_avg": int(total_tokens / max(1, pages)),
    }

register_calculator(
    "pdf-token-estimator",
    "PDF Document Token & Processing Cost Estimator",
    "ai_helper",
    "Estimate token counts and API reading costs for PDF files based on page volume, formatting density, and document types.",
    fields=[
        CalcField("pages", "Page Count", type="number", default=25, min=1, max=10000),
        CalcField("density", "Page Content Density", type="select", default="standard", options=[
            {"value": "sparse", "label": "Sparse / Presentation Slides (~250 words/pg)"},
            {"value": "standard", "label": "Standard Report / Book (~500 words/pg)"},
            {"value": "dense", "label": "Dense Legal Contract / Financials (~800 words/pg)"},
            {"value": "academic", "label": "Academic 2-Column Paper (~1,100 words/pg)"},
        ]),
        CalcField("has_tables", "Contains Tables or Code Snippets", type="select", default="true", options=[
            {"value": "true", "label": "Yes (+25% token density)"},
            {"value": "false", "label": "No (Plain prose only)"},
        ]),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_pdf_token_estimator,
)

# 8. Code Token Estimator
def _code_token_estimator(vals: dict) -> dict:
    lines_of_code = int(vals.get("loc") or 1200)
    language = str(vals.get("language") or "python")
    include_comments = str(vals.get("include_comments") or "true") == "true"
    model_id = str(vals.get("model") or "claude-3-7-sonnet")

    # Tokens per line multiplier based on language syntax density
    lang_factors = {
        "python": 8.5,
        "javascript": 9.2,
        "typescript": 10.4,
        "rust": 11.8,
        "go": 9.0,
        "java": 12.5,
        "c_cpp": 11.2,
        "html_css": 13.0,
    }
    factor = lang_factors.get(language, 9.5)
    if not include_comments:
        factor *= 0.85

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["claude-3-7-sonnet"])
    total_tokens = int(lines_of_code * factor)
    files_equivalent = max(1, round(lines_of_code / 250, 1))
    cost = (total_tokens / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "lines_of_code": f"{lines_of_code:,} LOC",
        "language": language.upper(),
        "estimated_tokens": f"{total_tokens:,} tokens",
        "average_tokens_per_line": round(factor, 1),
        "typical_file_equivalent": f"~{files_equivalent} files (at 250 LOC/file)",
        "model_context_utilization": f"{(total_tokens / m['context_window']) * 100:.2f}% of {m['name']}",
        "code_review_cost_single": f"${cost:.4f}",
        "cost_per_100_pull_requests": f"${cost * 100:.2f}",
    }

register_calculator(
    "code-token-estimator",
    "Codebase & Repository Token Estimator",
    "ai_helper",
    "Convert Lines of Code (LOC) and GitHub repositories into LLM token counts across Python, TypeScript, Rust, Go, and C++.",
    fields=[
        CalcField("loc", "Lines of Code (LOC)", type="number", default=1200, min=10, max=5000000),
        CalcField("language", "Primary Language", type="select", default="python", options=[
            {"value": "python", "label": "Python (8.5 tokens/line)"},
            {"value": "typescript", "label": "TypeScript / React (10.4 tokens/line)"},
            {"value": "javascript", "label": "JavaScript (9.2 tokens/line)"},
            {"value": "rust", "label": "Rust (11.8 tokens/line)"},
            {"value": "go", "label": "Go / Golang (9.0 tokens/line)"},
            {"value": "java", "label": "Java (12.5 tokens/line)"},
            {"value": "c_cpp", "label": "C / C++ (11.2 tokens/line)"},
            {"value": "html_css", "label": "HTML / CSS / Templates (13.0 tokens/line)"},
        ]),
        CalcField("include_comments", "Include Comments & Docstrings", type="select", default="true", options=[
            {"value": "true", "label": "Yes (Full file contents)"},
            {"value": "false", "label": "No (Stripped comments)"},
        ]),
        CalcField("model", "Target Model", type="select", default="claude-3-7-sonnet", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_code_token_estimator,
)

# 9. JSON Token Calculator
def _json_token_calculator(vals: dict) -> dict:
    objects_count = int(vals.get("objects_count") or 50)
    keys_per_object = int(vals.get("keys_per_object") or 6)
    avg_val_words = int(vals.get("avg_val_words") or 4)
    format_style = str(vals.get("format_style") or "compact") # minified vs pretty
    model_id = str(vals.get("model") or "gpt-4o")

    # Syntax tokens: brackets, commas, quotes, colons
    structural_tokens_per_obj = keys_per_object * 3 + 2
    if format_style == "pretty":
        structural_tokens_per_obj += (keys_per_object * 2) # indentation spaces and newlines

    value_tokens_per_obj = int(keys_per_object * avg_val_words * 1.33)
    key_tokens_per_obj = int(keys_per_object * 2.2) # average key name

    total_tokens_per_obj = structural_tokens_per_obj + value_tokens_per_obj + key_tokens_per_obj
    total_tokens = total_tokens_per_obj * objects_count

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    cost = (total_tokens / 1_000_000.0) * m["input_per_m"]

    # Minification savings
    pretty_tokens = total_tokens if format_style == "pretty" else total_tokens + (objects_count * keys_per_object * 2)
    compact_tokens = total_tokens if format_style == "compact" else total_tokens - (objects_count * keys_per_object * 2)
    minification_savings = pretty_tokens - compact_tokens

    return {
        "status": "ok",
        "total_records": objects_count,
        "total_json_tokens": f"{total_tokens:,} tokens",
        "tokens_per_record": total_tokens_per_obj,
        "structural_syntax_overhead": f"{(structural_tokens_per_obj / max(1, total_tokens_per_obj)) * 100:.1f}%",
        "potential_minification_savings": f"{minification_savings:,} tokens ({(minification_savings / max(1, pretty_tokens)) * 100:.1f}%)",
        "api_cost_single_payload": f"${cost:.5f}",
        "monthly_cost_10k_calls": f"${cost * 10000:.2f}",
    }

register_calculator(
    "json-token-calculator",
    "JSON Data Payload & Structured Output Token Calculator",
    "ai_helper",
    "Calculate token overhead for JSON API payloads, database rows, and function call schemas with minification savings.",
    fields=[
        CalcField("objects_count", "Number of JSON Objects / Rows", type="number", default=50, min=1, max=100000),
        CalcField("keys_per_object", "Keys / Fields Per Object", type="number", default=6, min=1, max=100),
        CalcField("avg_val_words", "Average Words Per Value", type="number", default=4, min=1, max=500),
        CalcField("format_style", "JSON Formatting", type="select", default="compact", options=[
            {"value": "compact", "label": "Minified (No whitespace/indentation)"},
            {"value": "pretty", "label": "Pretty-Printed (2-space indent & newlines)"},
        ]),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_json_token_calculator,
)

# 10. CSV-to-Prompt Token Estimator
def _csv_to_prompt_token_estimator(vals: dict) -> dict:
    rows = int(vals.get("rows") or 500)
    columns = int(vals.get("columns") or 8)
    avg_cell_chars = int(vals.get("avg_cell_chars") or 12)
    format_type = str(vals.get("format_type") or "csv") # csv, markdown_table, json_array
    model_id = str(vals.get("model") or "gpt-4o-mini")

    raw_data_chars = rows * columns * avg_cell_chars
    # formatting delimiters
    if format_type == "csv":
        delimiter_chars = rows * columns # commas and newlines
        total_chars = raw_data_chars + delimiter_chars
        total_tokens = int(total_chars * 0.32)
    elif format_type == "markdown_table":
        delimiter_chars = rows * (columns * 3 + 2) # pipes and spaces
        total_chars = raw_data_chars + delimiter_chars
        total_tokens = int(total_chars * 0.36)
    else: # json_array
        total_tokens = int(rows * columns * 3.5)

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o-mini"])
    cost = (total_tokens / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "dataset_shape": f"{rows:,} rows × {columns} columns ({rows * columns:,} cells)",
        "format": format_type.replace("_", " ").upper(),
        "total_tokens": f"{total_tokens:,} tokens",
        "fits_in_context": total_tokens <= m["context_window"],
        "context_capacity": f"{m['context_window']:,} tokens",
        "prompt_injection_cost": f"${cost:.4f}",
        "recommendation": "Optimal format is CSV. Markdown tables add 25-40% unnecessary token tax." if format_type == "markdown_table" else "Format is token-efficient.",
    }

register_calculator(
    "csv-to-prompt-token-estimator",
    "CSV Dataset to Prompt Token & Density Estimator",
    "ai_helper",
    "Compare token consumption when injecting tabular datasets into prompts as CSV, Markdown tables, or JSON arrays.",
    fields=[
        CalcField("rows", "Number of Data Rows", type="number", default=500, min=1, max=100000),
        CalcField("columns", "Number of Columns", type="number", default=8, min=1, max=100),
        CalcField("avg_cell_chars", "Average Characters Per Cell", type="number", default=12, min=1, max=500),
        CalcField("format_type", "Injection Format", type="select", default="csv", options=[
            {"value": "csv", "label": "Comma Separated Values (CSV) — Recommended"},
            {"value": "markdown_table", "label": "Markdown Pipe Table (| col | col |)"},
            {"value": "json_array", "label": "JSON Array of Records"},
        ]),
        CalcField("model", "Target Model", type="select", default="gpt-4o-mini", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_csv_to_prompt_token_estimator,
)

# 11. Output-Token Reserve Calculator
def _output_token_reserve_calculator(vals: dict) -> dict:
    model_id = str(vals.get("model") or "gpt-4o")
    input_tokens = int(vals.get("input_tokens") or 115000)
    desired_output_tokens = int(vals.get("desired_output_tokens") or 4096)

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    total_window = m["context_window"]
    max_hardware_output = m["max_output"]

    available_output_headroom = max(0, total_window - input_tokens)
    clamped_output_limit = min(desired_output_tokens, available_output_headroom, max_hardware_output)
    is_truncated = desired_output_tokens > clamped_output_limit

    in_cost = (input_tokens / 1_000_000.0) * m["input_per_m"]
    out_cost = (clamped_output_limit / 1_000_000.0) * m["output_per_m"]

    return {
        "status": "ok",
        "model_name": m["name"],
        "max_context_window": f"{total_window:,} tokens",
        "model_max_output_limit": f"{max_hardware_output:,} tokens",
        "available_output_headroom": f"{available_output_headroom:,} tokens",
        "safe_max_tokens_parameter": clamped_output_limit,
        "truncation_warning": is_truncated,
        "truncation_reason": "Input consumes too much context window" if available_output_headroom < desired_output_tokens else ("Exceeds model architecture output limit" if desired_output_tokens > max_hardware_output else "None"),
        "total_request_cost": f"${in_cost + out_cost:.4f}",
    }

register_calculator(
    "output-token-reserve-calculator",
    "Output-Token Reserve & Max Token Safety Calculator",
    "ai_helper",
    "Calculate the safe max_tokens setting to prevent truncation and finish_reason='length' errors on large prompt payloads.",
    fields=[
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
        CalcField("input_tokens", "Input Context Tokens", type="number", default=115000, min=1, max=2000000),
        CalcField("desired_output_tokens", "Desired Output Completion Tokens", type="number", default=4096, min=16, max=100000),
    ],
    fn=_output_token_reserve_calculator,
)

# 12. Token-per-Word Estimator
def _token_per_word_estimator(vals: dict) -> dict:
    word_count = int(vals.get("word_count") or 2500)
    language = str(vals.get("language") or "english")
    model_id = str(vals.get("model") or "gpt-4o")

    lang_ratios = {
        "english": 1.33,
        "spanish": 1.45,
        "french": 1.50,
        "german": 1.65,
        "bengali": 3.10,
        "hindi": 2.95,
        "chinese": 2.20,
        "japanese": 2.35,
        "arabic": 2.80,
    }
    ratio = lang_ratios.get(language, 1.33)
    if "gemini" in model_id:
        ratio *= 0.95
    elif "claude" in model_id:
        ratio *= 1.02

    estimated_tokens = int(word_count * ratio)
    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    cost = (estimated_tokens / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "word_count": f"{word_count:,} words",
        "language": language.title(),
        "tokens_per_word_ratio": round(ratio, 2),
        "estimated_total_tokens": f"{estimated_tokens:,} tokens",
        "reading_time_minutes": round(word_count / 220.0, 1),
        "estimated_api_cost": f"${cost:.5f}",
        "language_overhead_vs_english": f"{((ratio - 1.33) / 1.33) * 100:+.1f}%",
    }

register_calculator(
    "token-per-word-estimator",
    "Token-per-Word & Multi-Language Ratio Estimator",
    "ai_helper",
    "Convert word counts to tokens across English, Bengali, Spanish, German, Chinese, and Arabic with language-specific tokenizer multipliers.",
    fields=[
        CalcField("word_count", "Total Word Count", type="number", default=2500, min=1, max=10000000),
        CalcField("language", "Text Language", type="select", default="english", options=[
            {"value": "english", "label": "English (1.33 tokens/word)"},
            {"value": "spanish", "label": "Spanish (1.45 tokens/word)"},
            {"value": "french", "label": "French (1.50 tokens/word)"},
            {"value": "german", "label": "German (1.65 tokens/word)"},
            {"value": "bengali", "label": "Bengali / বাংলা (3.10 tokens/word)"},
            {"value": "hindi", "label": "Hindi / हिन्दी (2.95 tokens/word)"},
            {"value": "chinese", "label": "Chinese / 中文 (2.20 tokens/word)"},
            {"value": "japanese", "label": "Japanese / 日本語 (2.35 tokens/word)"},
            {"value": "arabic", "label": "Arabic / العربية (2.80 tokens/word)"},
        ]),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_token_per_word_estimator,
)

# ═════════════════════════════════════════════════════════════════════════════
# BATCH 3: Prompt Optimization & Context Architecture (Tools 13 - 20)
# ═════════════════════════════════════════════════════════════════════════════

# 13. Prompt Compression Savings Calculator
def _prompt_compression_savings_calculator(vals: dict) -> dict:
    original_tokens = int(vals.get("original_tokens") or 8500)
    compression_rate_pct = float(vals.get("compression_rate") or 45.0) # e.g. 45% reduction
    daily_volume = int(vals.get("daily_volume") or 10000)
    model_id = str(vals.get("model") or "gpt-4o")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    tokens_saved_per_call = int(original_tokens * (compression_rate_pct / 100.0))
    compressed_tokens = original_tokens - tokens_saved_per_call

    daily_uncompressed_cost = (original_tokens * daily_volume / 1_000_000.0) * m["input_per_m"]
    daily_compressed_cost = (compressed_tokens * daily_volume / 1_000_000.0) * m["input_per_m"]
    daily_savings = daily_uncompressed_cost - daily_compressed_cost

    return {
        "status": "ok",
        "original_tokens": f"{original_tokens:,} tokens",
        "compressed_tokens": f"{compressed_tokens:,} tokens",
        "tokens_saved_per_call": f"{tokens_saved_per_call:,} tokens ({compression_rate_pct:.1f}%)",
        "monthly_tokens_saved": f"{tokens_saved_per_call * daily_volume * 30:,} tokens",
        "monthly_uncompressed_cost": f"${daily_uncompressed_cost * 30:.2f}",
        "monthly_compressed_cost": f"${daily_compressed_cost * 30:.2f}",
        "monthly_dollar_savings": f"${daily_savings * 30:.2f}",
        "annual_dollar_savings": f"${daily_savings * 365:.2f}",
    }

register_calculator(
    "prompt-compression-savings-calculator",
    "Prompt Compression & LLMLingua ROI Calculator",
    "ai_helper",
    "Calculate monthly API cost savings from compressing prompts using LLMLingua, extractive pruning, or semantic summarization.",
    fields=[
        CalcField("original_tokens", "Original Prompt Tokens", type="number", default=8500, min=100, max=500000),
        CalcField("compression_rate", "Compression Rate (%)", type="number", default=45.0, min=5.0, max=80.0),
        CalcField("daily_volume", "Daily Query Volume", type="number", default=10000, min=1, max=10000000),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_prompt_compression_savings_calculator,
)

# 14. Prompt Length vs. Model Limit Checker
def _prompt_length_vs_model_limit_checker(vals: dict) -> dict:
    prompt_text = str(vals.get("prompt_text") or "Analyze this quarterly corporate financial report...")
    output_budget = int(vals.get("output_budget") or 2048)

    base_tokens = estimate_tokens(prompt_text, "gpt-4o")
    results = []

    for mid, info in FRONTIER_MODELS.items():
        toks = estimate_tokens(prompt_text, mid)
        total_req = toks + output_budget
        fits = total_req <= info["context_window"]
        headroom = info["context_window"] - total_req
        results.append({
            "model": info["name"],
            "provider": info["provider"],
            "prompt_tokens": toks,
            "context_window": f"{info['context_window']:,}",
            "status": "PASS" if fits else "OVERFLOW",
            "utilization": f"{(total_req / info['context_window']) * 100:.1f}%",
            "headroom": f"{max(0, headroom):,} tokens",
        })

    return {
        "status": "ok",
        "char_count": len(prompt_text),
        "word_count": len(prompt_text.split()),
        "output_budget": output_budget,
        "models_verified": len(results),
        "compatibility_matrix": results,
    }

register_calculator(
    "prompt-length-vs-model-limit-checker",
    "Prompt Length vs. Context Limit Compatibility Checker",
    "ai_helper",
    "Test your prompt length and output headroom across 12 frontier models simultaneously to verify context window compliance.",
    fields=[
        CalcField("prompt_text", "Prompt / Text Payload", type="text", default="Analyze this quarterly corporate financial report..."),
        CalcField("output_budget", "Reserved Output Completion Tokens", type="number", default=2048, min=64, max=64000),
    ],
    fn=_prompt_length_vs_model_limit_checker,
)

# 15. Multi-Turn Chat Context Calculator
def _multi_turn_chat_context_calculator(vals: dict) -> dict:
    conversation_length = int(vals.get("conversation_length") or 15)
    user_words_per_turn = int(vals.get("user_words") or 35)
    asst_words_per_turn = int(vals.get("asst_words") or 180)
    system_tokens = int(vals.get("system_tokens") or 800)
    model_id = str(vals.get("model") or "gpt-4o")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    user_tok = int(user_words_per_turn * m["tok_per_word"])
    asst_tok = int(asst_words_per_turn * m["tok_per_word"])
    turn_pair = user_tok + asst_tok

    # Full history billing progression
    total_billable_input = 0
    total_billable_output = conversation_length * asst_tok
    turn_snapshots = []

    for t in range(1, conversation_length + 1):
        prior_context = system_tokens + ((t - 1) * turn_pair) + user_tok
        total_billable_input += prior_context
        turn_snapshots.append({
            "turn": t,
            "input_context_tokens": prior_context,
            "cost_this_turn": f"${(prior_context / 1_000_000.0) * m['input_per_m'] + (asst_tok / 1_000_000.0) * m['output_per_m']:.5f}",
        })

    total_cost = (total_billable_input / 1_000_000.0) * m["input_per_m"] + (total_billable_output / 1_000_000.0) * m["output_per_m"]

    return {
        "status": "ok",
        "total_turns": conversation_length,
        "final_turn_prompt_size": f"{system_tokens + (conversation_length * turn_pair):,} tokens",
        "cumulative_tokens_billed": f"{total_billable_input + total_billable_output:,} tokens",
        "total_chat_session_cost": f"${total_cost:.4f}",
        "average_cost_per_turn": f"${total_cost / max(1, conversation_length):.4f}",
        "turn_snapshots": turn_snapshots[:5] + [turn_snapshots[-1]] if len(turn_snapshots) > 6 else turn_snapshots,
    }

register_calculator(
    "multi-turn-chat-context-calculator",
    "Multi-Turn Chat Cumulative Context Calculator",
    "ai_helper",
    "Calculate cumulative token expansion and session billing across extended chatbot interactions with turn-by-turn progression.",
    fields=[
        CalcField("conversation_length", "Number of Chat Turns", type="number", default=15, min=2, max=100),
        CalcField("user_words", "Average User Words / Turn", type="number", default=35, min=5, max=1000),
        CalcField("asst_words", "Average Assistant Words / Turn", type="number", default=180, min=10, max=5000),
        CalcField("system_tokens", "System Prompt Tokens", type="number", default=800, min=0, max=50000),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_multi_turn_chat_context_calculator,
)

# 16. Tool/Function-Call Token Calculator
def _tool_function_call_token_calculator(vals: dict) -> dict:
    tools_count = int(vals.get("tools_count") or 8)
    params_per_tool = int(vals.get("params_per_tool") or 4)
    avg_description_words = int(vals.get("desc_words") or 25)
    calls_per_turn = int(vals.get("calls_per_turn") or 2)
    model_id = str(vals.get("model") or "gpt-4o")

    # Schema token overhead
    schema_tokens_per_tool = int((params_per_tool * 22) + (avg_description_words * 1.33) + 35)
    total_schema_tokens = tools_count * schema_tokens_per_tool

    # Call payload tokens
    call_arguments_tokens = calls_per_turn * 65
    execution_result_tokens = calls_per_turn * 320 # average return data
    total_tool_overhead_turn = total_schema_tokens + call_arguments_tokens + execution_result_tokens

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    cost_per_turn = (total_tool_overhead_turn / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "tools_registered": tools_count,
        "schema_overhead_per_call": f"{total_schema_tokens:,} tokens (sent every request)",
        "tool_execution_data_tokens": f"{call_arguments_tokens + execution_result_tokens:,} tokens",
        "total_tooling_tokens_per_turn": f"{total_tool_overhead_turn:,} tokens",
        "schema_cost_per_thousand_calls": f"${(total_schema_tokens * 1000 / 1_000_000.0) * m['input_per_m']:.3f}",
        "monthly_overhead_100k_runs": f"${cost_per_turn * 100000:.2f}",
        "finops_tip": "Enable Anthropic Prompt Caching on tool schemas to reduce schema overhead costs by 90%.",
    }

register_calculator(
    "tool-function-call-token-calculator",
    "Tool & Function Calling Token Overhead Calculator",
    "ai_helper",
    "Quantify the hidden token overhead of OpenAPI schemas, function definitions, tool arguments, and tool outputs.",
    fields=[
        CalcField("tools_count", "Number of Registered Tools", type="number", default=8, min=1, max=100),
        CalcField("params_per_tool", "Average Parameters per Tool", type="number", default=4, min=1, max=30),
        CalcField("desc_words", "Average Description Length (Words)", type="number", default=25, min=5, max=200),
        CalcField("calls_per_turn", "Tool Invocations per Turn", type="number", default=2, min=1, max=20),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_tool_function_call_token_calculator,
)

# 17. Image/Vision Prompt Token Estimator
def _image_vision_prompt_token_estimator(vals: dict) -> dict:
    width = int(vals.get("width") or 1920)
    height = int(vals.get("height") or 1080)
    detail_mode = str(vals.get("detail_mode") or "high") # low, high
    image_count = int(vals.get("image_count") or 1)
    model_id = str(vals.get("model") or "gpt-4o")

    # OpenAI / Claude vision calculation
    if detail_mode == "low":
        tokens_per_image = 85
    else:
        # Scale to fit within 2048 x 2048
        max_dim = max(width, height)
        if max_dim > 2048:
            scale = 2048.0 / max_dim
            width = int(width * scale)
            height = int(height * scale)
        # Scale shortest side to 768
        min_dim = min(width, height)
        if min_dim > 768:
            scale = 768.0 / min_dim
            width = int(width * scale)
            height = int(height * scale)
        # Tile into 512x512 tiles
        tiles_w = math.ceil(width / 512.0)
        tiles_h = math.ceil(height / 512.0)
        total_tiles = tiles_w * tiles_h
        tokens_per_image = (total_tiles * 170) + 85

    total_tokens = tokens_per_image * image_count
    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    cost = (total_tokens / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "image_resolution": f"{width} × {height} px",
        "detail_mode": detail_mode.upper(),
        "tiles_generated": f"{tiles_w} × {tiles_h} ({total_tiles} tiles)" if detail_mode == "high" else "1 base tile",
        "tokens_per_image": f"{tokens_per_image:,} tokens",
        "total_vision_tokens": f"{total_tokens:,} tokens ({image_count} images)",
        "single_request_cost": f"${cost:.5f}",
        "batch_1000_images_cost": f"${cost * (1000 / max(1, image_count)):.2f}",
    }

register_calculator(
    "image-vision-prompt-token-estimator",
    "Multimodal Image & Vision Token Calculator",
    "ai_helper",
    "Calculate vision token consumption based on image resolution, 512x512 tile patches, and low/high detail modes in GPT-4o and Claude.",
    fields=[
        CalcField("width", "Image Width (Pixels)", type="number", default=1920, min=64, max=10000),
        CalcField("height", "Image Height (Pixels)", type="number", default=1080, min=64, max=10000),
        CalcField("detail_mode", "Detail Fidelity", type="select", default="high", options=[
            {"value": "high", "label": "High Fidelity (512px Patch Tiles — 170 tokens/tile + 85 base)"},
            {"value": "low", "label": "Low Fidelity (Fixed 85 tokens flat)"},
        ]),
        CalcField("image_count", "Number of Images", type="number", default=1, min=1, max=100),
        CalcField("model", "Target Vision Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_image_vision_prompt_token_estimator,
)

# 18. Audio Transcription Token/Cost Estimator
def _audio_transcription_token_cost_estimator(vals: dict) -> dict:
    audio_minutes = float(vals.get("audio_minutes") or 45.0)
    service = str(vals.get("service") or "whisper") # whisper, gemini_audio, deepgram
    monthly_files = int(vals.get("monthly_files") or 200)

    # Transcription pricing per minute
    if service == "whisper":
        cost_per_min = 0.006 # $0.006 per minute OpenAI Whisper
        service_name = "OpenAI Whisper API ($0.006 / min)"
        tokens_produced = int(audio_minutes * 150 * 1.33) # ~150 wpm
    elif service == "gemini_audio":
        cost_per_min = 0.003
        service_name = "Google Gemini 2.0 Flash Audio Ingest ($0.003 / min)"
        tokens_produced = int(audio_minutes * 32 * 60) # ~32 tokens per sec
    else: # deepgram
        cost_per_min = 0.0043
        service_name = "Deepgram Nova-2 ($0.0043 / min)"
        tokens_produced = int(audio_minutes * 150 * 1.33)

    single_file_cost = audio_minutes * cost_per_min
    monthly_cost = single_file_cost * monthly_files

    return {
        "status": "ok",
        "audio_duration": f"{audio_minutes:.1f} minutes ({audio_minutes * 60:.0f} seconds)",
        "service": service_name,
        "estimated_transcribed_tokens": f"{tokens_produced:,} tokens (~{int(tokens_produced / 1.33):,} words)",
        "single_audio_file_cost": f"${single_file_cost:.4f}",
        "monthly_transcription_cost": f"${monthly_cost:.2f} ({monthly_files:,} files)",
        "hourly_rate": f"${cost_per_min * 60:.2f} / audio hour",
    }

register_calculator(
    "audio-transcription-token-cost-estimator",
    "Audio Transcription Token & API Cost Estimator",
    "ai_helper",
    "Calculate speech-to-text token output and transcription billing across OpenAI Whisper, Gemini Audio, and Deepgram Nova-2.",
    fields=[
        CalcField("audio_minutes", "Audio Duration (Minutes)", type="number", default=45.0, min=0.5, max=10000.0),
        CalcField("service", "Transcription Service", type="select", default="whisper", options=[
            {"value": "whisper", "label": "OpenAI Whisper ($0.006 / minute)"},
            {"value": "gemini_audio", "label": "Google Gemini 2.0 Audio ($0.003 / minute)"},
            {"value": "deepgram", "label": "Deepgram Nova-2 ($0.0043 / minute)"},
        ]),
        CalcField("monthly_files", "Monthly Audio Files Processed", type="number", default=200, min=1, max=1000000),
    ],
    fn=_audio_transcription_token_cost_estimator,
)

# 19. Prompt Template Variable Expansion Calculator
def _prompt_template_variable_expansion_calculator(vals: dict) -> dict:
    template_tokens = int(vals.get("template_tokens") or 350)
    var_count = int(vals.get("var_count") or 4)
    avg_var_words = int(vals.get("avg_var_words") or 60)
    batch_records = int(vals.get("batch_records") or 1000)
    model_id = str(vals.get("model") or "gpt-4o-mini")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o-mini"])
    dynamic_var_tokens = int(var_count * avg_var_words * m["tok_per_word"])
    total_prompt_per_record = template_tokens + dynamic_var_tokens
    total_batch_tokens = total_prompt_per_record * batch_records
    total_batch_cost = (total_batch_tokens / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "static_template_tokens": f"{template_tokens:,} tokens",
        "dynamic_variable_tokens": f"{dynamic_var_tokens:,} tokens ({var_count} variables)",
        "total_tokens_per_record": f"{total_prompt_per_record:,} tokens",
        "total_batch_tokens": f"{total_batch_tokens:,} tokens",
        "static_vs_dynamic_ratio": f"{template_tokens / total_prompt_per_record * 100:.1f}% static / {dynamic_var_tokens / total_prompt_per_record * 100:.1f}% dynamic",
        "total_batch_run_cost": f"${total_batch_cost:.4f}",
        "cost_per_record": f"${total_batch_cost / max(1, batch_records):.6f}",
    }

register_calculator(
    "prompt-template-variable-expansion-calculator",
    "Prompt Template Variable Expansion Calculator",
    "ai_helper",
    "Estimate token size and batch execution billing when hydrating Jinja, Mustache, or LangChain prompt templates with dynamic database variables.",
    fields=[
        CalcField("template_tokens", "Static Template Size (Tokens)", type="number", default=350, min=10, max=100000),
        CalcField("var_count", "Number of Dynamic Variables", type="number", default=4, min=1, max=50),
        CalcField("avg_var_words", "Average Words per Variable", type="number", default=60, min=1, max=5000),
        CalcField("batch_records", "Batch Records to Process", type="number", default=1000, min=1, max=1000000),
        CalcField("model", "Target Model", type="select", default="gpt-4o-mini", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_prompt_template_variable_expansion_calculator,
)

# 20. Prompt Diff/Token-Change Calculator
def _prompt_diff_token_change_calculator(vals: dict) -> dict:
    original_prompt = str(vals.get("original_prompt") or "Please summarize the following article in detail...")
    revised_prompt = str(vals.get("revised_prompt") or "Summarize the article into 3 concise bullet points:")
    monthly_inferences = int(vals.get("monthly_inferences") or 50000)
    model_id = str(vals.get("model") or "gpt-4o")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    orig_tok = estimate_tokens(original_prompt, model_id)
    rev_tok = estimate_tokens(revised_prompt, model_id)
    tok_diff = rev_tok - orig_tok
    pct_change = (tok_diff / max(1, orig_tok)) * 100.0

    orig_monthly_cost = (orig_tok * monthly_inferences / 1_000_000.0) * m["input_per_m"]
    rev_monthly_cost = (rev_tok * monthly_inferences / 1_000_000.0) * m["input_per_m"]
    monthly_financial_impact = rev_monthly_cost - orig_monthly_cost

    return {
        "status": "ok",
        "original_tokens": orig_tok,
        "revised_tokens": rev_tok,
        "token_change": f"{tok_diff:+d} tokens ({pct_change:+.1f}%)",
        "monthly_original_cost": f"${orig_monthly_cost:.2f}",
        "monthly_revised_cost": f"${rev_monthly_cost:.2f}",
        "monthly_cost_difference": f"{'+' if monthly_financial_impact > 0 else '-'}${abs(monthly_financial_impact):.2f}",
        "annual_run_rate_impact": f"{'+' if monthly_financial_impact > 0 else '-'}${abs(monthly_financial_impact * 12):.2f}",
        "verdict": "Cost Reduced" if tok_diff < 0 else ("Cost Increased" if tok_diff > 0 else "Neutral"),
    }

register_calculator(
    "prompt-diff-token-change-calculator",
    "Prompt Diff & Token Variance Financial Impact Calculator",
    "ai_helper",
    "Measure exact token variances between prompt revisions (A/B testing) and project annual cloud expenditure changes.",
    fields=[
        CalcField("original_prompt", "Original Prompt (V1)", type="text", default="Please summarize the following article in detail..."),
        CalcField("revised_prompt", "Revised Prompt (V2)", type="text", default="Summarize the article into 3 concise bullet points:"),
        CalcField("monthly_inferences", "Monthly Inference Runs", type="number", default=50000, min=1, max=100000000),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_prompt_diff_token_change_calculator,
)

# ═════════════════════════════════════════════════════════════════════════════
# BATCH 4: Agent, Automation & n8n/Workflow Cost Engines (Tools 21 - 30)
# ═════════════════════════════════════════════════════════════════════════════

# 21. AI Agent Cost Calculator
def _ai_agent_cost_calculator(vals: dict) -> dict:
    steps = int(vals.get("steps") or 6)
    tool_calls_per_step = int(vals.get("tool_calls") or 2)
    prompt_tokens_per_step = int(vals.get("prompt_tokens") or 2500)
    output_tokens_per_step = int(vals.get("output_tokens") or 450)
    runs_per_month = int(vals.get("monthly_runs") or 5000)
    model_id = str(vals.get("model") or "claude-3-7-sonnet")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["claude-3-7-sonnet"])
    # Accumulated context across steps: each step carries prior history
    step_input_accumulator = 0
    for s in range(1, steps + 1):
        step_input_accumulator += prompt_tokens_per_step + ((s - 1) * (tool_calls_per_step * 250 + output_tokens_per_step))

    total_output_tokens = steps * output_tokens_per_step
    cost_per_run = (step_input_accumulator / 1_000_000.0) * m["input_per_m"] + (total_output_tokens / 1_000_000.0) * m["output_per_m"]
    monthly_cost = cost_per_run * runs_per_month

    return {
        "status": "ok",
        "agent_model": m["name"],
        "reasoning_steps": steps,
        "total_tokens_per_run": f"{step_input_accumulator + total_output_tokens:,} tokens",
        "cost_per_single_agent_run": f"${cost_per_run:.4f}",
        "monthly_cloud_expenditure": f"${monthly_cost:.2f} ({runs_per_month:,} executions)",
        "annual_run_rate": f"${monthly_cost * 12:.2f}",
        "token_compounding_overhead": f"{(step_input_accumulator / (steps * prompt_tokens_per_step) - 1) * 100:.1f}% context expansion overhead",
    }

register_calculator(
    "ai-agent-cost-calculator",
    "Autonomous AI Agent Execution Cost Calculator",
    "ai_helper",
    "Calculate the end-to-end execution cost of multi-step autonomous AI agents including step context accumulation and tool call responses.",
    fields=[
        CalcField("steps", "Reasoning & Action Steps (Iterations)", type="number", default=6, min=1, max=50),
        CalcField("tool_calls", "Tool Calls Per Step", type="number", default=2, min=0, max=10),
        CalcField("prompt_tokens", "Base Prompt / System Instructions", type="number", default=2500, min=100, max=100000),
        CalcField("output_tokens", "Generated Thought / Action Tokens / Step", type="number", default=450, min=50, max=4000),
        CalcField("monthly_runs", "Monthly Agent Executions", type="number", default=5000, min=1, max=10000000),
        CalcField("model", "Agent Backbone Model", type="select", default="claude-3-7-sonnet", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_ai_agent_cost_calculator,
)

# 22. Multi-Agent Pipeline Cost Calculator
def _multi_agent_pipeline_cost_calculator(vals: dict) -> dict:
    agents_count = int(vals.get("agents_count") or 4) # e.g. Planner, Researcher, Coder, Reviewer
    rounds_of_handoff = int(vals.get("handoffs") or 3)
    avg_tokens_per_handoff = int(vals.get("handoff_tokens") or 3200)
    pipeline_runs_daily = int(vals.get("daily_runs") or 150)
    model_id = str(vals.get("model") or "gpt-4o")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    total_pipeline_tokens = agents_count * rounds_of_handoff * avg_tokens_per_handoff
    pipeline_in_tokens = int(total_pipeline_tokens * 0.78)
    pipeline_out_tokens = int(total_pipeline_tokens * 0.22)

    cost_per_pipeline = (pipeline_in_tokens / 1_000_000.0) * m["input_per_m"] + (pipeline_out_tokens / 1_000_000.0) * m["output_per_m"]
    monthly_cost = cost_per_pipeline * pipeline_runs_daily * 30

    return {
        "status": "ok",
        "agent_team_size": f"{agents_count} Agents (CrewAI / AutoGen)",
        "handoff_interactions": f"{rounds_of_handoff} sequential rounds",
        "tokens_per_pipeline_run": f"{total_pipeline_tokens:,} tokens",
        "cost_per_full_pipeline_run": f"${cost_per_pipeline:.4f}",
        "daily_pipeline_spend": f"${cost_per_pipeline * pipeline_runs_daily:.2f}",
        "monthly_cloud_budget": f"${monthly_cost:.2f} ({pipeline_runs_daily * 30:,} runs)",
        "annual_pipeline_cost": f"${monthly_cost * 12:.2f}",
    }

register_calculator(
    "multi-agent-pipeline-cost-calculator",
    "Multi-Agent Crew & Pipeline Orchestration Cost Calculator",
    "ai_helper",
    "Model the collaborative token spend of multi-agent networks (CrewAI, LangGraph, AutoGen) with inter-agent handoffs and message passing.",
    fields=[
        CalcField("agents_count", "Number of Specialized Agents in Crew", type="number", default=4, min=2, max=20),
        CalcField("handoffs", "Handoff Rounds / Deliberation Cycles", type="number", default=3, min=1, max=15),
        CalcField("handoff_tokens", "Average Context Tokens Per Handoff", type="number", default=3200, min=200, max=50000),
        CalcField("daily_runs", "Daily Workflow Executions", type="number", default=150, min=1, max=100000),
        CalcField("model", "Primary Foundation Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_multi_agent_pipeline_cost_calculator,
)

# 23. Agent Loop Cost Calculator
def _agent_loop_cost_calculator(vals: dict) -> dict:
    max_loops = int(vals.get("max_loops") or 12)
    accumulated_context_growth = int(vals.get("context_growth") or 650)
    base_prompt = int(vals.get("base_prompt") or 3000)
    runaway_risk_pct = float(vals.get("runaway_risk") or 8.0) # percentage of runs that hit loop limit
    model_id = str(vals.get("model") or "gpt-4o")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    loop_tokens_total = sum(base_prompt + (i * accumulated_context_growth) for i in range(max_loops))
    max_worst_case_cost = (loop_tokens_total / 1_000_000.0) * m["input_per_m"] + (max_loops * 400 / 1_000_000.0) * m["output_per_m"]
    nominal_cost = max_worst_case_cost * 0.35 # average agent completes in 35% of max loops

    blended_cost_per_1000_runs = (1000 * (1 - runaway_risk_pct / 100.0) * nominal_cost) + (1000 * (runaway_risk_pct / 100.0) * max_worst_case_cost)

    return {
        "status": "ok",
        "max_permitted_iterations": max_loops,
        "worst_case_runaway_tokens": f"{loop_tokens_total:,} tokens",
        "worst_case_runaway_cost": f"${max_worst_case_cost:.4f} per runaway incident",
        "nominal_completion_cost": f"${nominal_cost:.4f}",
        "blended_cost_per_1k_runs": f"${blended_cost_per_1000_runs:.2f}",
        "monthly_runaway_waste": f"${(runaway_risk_pct / 100.0) * 1000 * (max_worst_case_cost - nominal_cost):.2f} (at {runaway_risk_pct}% runaway rate)",
        "circuit_breaker_advice": "Implement a hard token circuit breaker at 4 loops to prevent 65% of budget leakages.",
    }

register_calculator(
    "agent-loop-cost-calculator",
    "Agent Reasoning Loop & Runaway Budget Calculator",
    "ai_helper",
    "Evaluate compounding ReAct loop token burn, worst-case runaway execution expenditure, and circuit-breaker threshold efficiency.",
    fields=[
        CalcField("max_loops", "Loop Limit (Max Iterations)", type="number", default=12, min=2, max=50),
        CalcField("context_growth", "Context Growth / Loop (Tokens)", type="number", default=650, min=100, max=5000),
        CalcField("base_prompt", "Base Prompt & Schema (Tokens)", type="number", default=3000, min=500, max=30000),
        CalcField("runaway_risk", "Runaway Loop Incidence (%)", type="number", default=8.0, min=0.1, max=40.0),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_agent_loop_cost_calculator,
)

# 24. Tool-Call Cost Calculator
def _tool_call_cost_calculator(vals: dict) -> dict:
    invocations_monthly = int(vals.get("invocations") or 250000)
    avg_args_tokens = int(vals.get("args_tokens") or 85)
    avg_result_tokens = int(vals.get("result_tokens") or 450)
    schema_overhead = int(vals.get("schema_tokens") or 950)
    model_id = str(vals.get("model") or "gpt-4o-mini")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o-mini"])
    total_tokens_per_call = schema_overhead + avg_args_tokens + avg_result_tokens
    monthly_tokens = total_tokens_per_call * invocations_monthly
    monthly_cost = (monthly_tokens / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "monthly_tool_invocations": f"{invocations_monthly:,}",
        "total_tokens_per_tool_execution": total_tokens_per_call,
        "monthly_tool_tokens": f"{monthly_tokens:,} tokens",
        "cost_per_1000_tool_calls": f"${(total_tokens_per_call * 1000 / 1_000_000.0) * m['input_per_m']:.4f}",
        "monthly_tool_billing": f"${monthly_cost:.2f}",
        "annual_tool_billing": f"${monthly_cost * 12:.2f}",
        "schema_waste_fraction": f"{(schema_overhead / total_tokens_per_call) * 100:.1f}% spent solely on function schemas",
    }

register_calculator(
    "tool-call-cost-calculator",
    "Model Context Protocol (MCP) & Tool-Call Cost Calculator",
    "ai_helper",
    "Calculate the API cost of executing external tools, web searches, SQL queries, and MCP servers inside LLM workflows.",
    fields=[
        CalcField("invocations", "Monthly Tool Invocations", type="number", default=250000, min=100, max=100000000),
        CalcField("args_tokens", "Function Arguments Size (Tokens)", type="number", default=85, min=10, max=2000),
        CalcField("result_tokens", "Tool Output Response (Tokens)", type="number", default=450, min=20, max=10000),
        CalcField("schema_tokens", "Tool Schema Definition Size", type="number", default=950, min=50, max=15000),
        CalcField("model", "Calling Model", type="select", default="gpt-4o-mini", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_tool_call_cost_calculator,
)

# 25. Agent Memory Cost Calculator
def _agent_memory_cost_calculator(vals: dict) -> dict:
    active_users = int(vals.get("active_users") or 2500)
    memories_per_user = int(vals.get("memories_per_user") or 40)
    avg_memory_tokens = int(vals.get("avg_memory_tokens") or 85)
    vector_db_tier = str(vals.get("vector_db") or "serverless") # serverless, dedicated

    total_memories = active_users * memories_per_user
    total_memory_tokens = total_memories * avg_memory_tokens

    # Embedding cost (text-embedding-3-small @ $0.02 / 1M)
    embedding_cost = (total_memory_tokens / 1_000_000.0) * 0.02
    # Vector DB hosting cost
    db_monthly = max(15.0, total_memories * 0.00015) if vector_db_tier == "serverless" else 95.0

    return {
        "status": "ok",
        "active_users": f"{active_users:,}",
        "total_stored_memories": f"{total_memories:,} facts",
        "total_memory_tokens": f"{total_memory_tokens:,} tokens",
        "one_time_embedding_cost": f"${embedding_cost:.4f}",
        "monthly_vector_storage_cost": f"${db_monthly:.2f}",
        "cost_per_active_user_monthly": f"${(db_monthly + (embedding_cost / 12.0)) / max(1, active_users):.4f}",
        "annual_memory_tco": f"${(db_monthly * 12) + embedding_cost:.2f}",
    }

register_calculator(
    "agent-memory-cost-calculator",
    "Agent Long-Term Memory (Mem0 / Zep) Cost Calculator",
    "ai_helper",
    "Estimate monthly storage, embedding, and vector retrieval costs for maintaining user personalization and long-term agent memory.",
    fields=[
        CalcField("active_users", "Active User Profiles", type="number", default=2500, min=10, max=1000000),
        CalcField("memories_per_user", "Memories / Facts Retained per User", type="number", default=40, min=1, max=500),
        CalcField("avg_memory_tokens", "Average Tokens per Memory Entry", type="number", default=85, min=10, max=500),
        CalcField("vector_db", "Vector Database Hosting Tier", type="select", default="serverless", options=[
            {"value": "serverless", "label": "Serverless (Pinecone / Qdrant Cloud / Pgvector)"},
            {"value": "dedicated", "label": "Dedicated Pod / Cluster ($95/mo baseline)"},
        ]),
    ],
    fn=_agent_memory_cost_calculator,
)

# 26. Agent Retry Cost Calculator
def _agent_retry_cost_calculator(vals: dict) -> dict:
    total_calls_monthly = int(vals.get("total_calls") or 100000)
    failure_rate_pct = float(vals.get("failure_rate") or 12.0) # rate limits, JSON parse errors, validation
    retries_per_failure = int(vals.get("retries") or 2)
    avg_tokens_per_call = int(vals.get("avg_tokens") or 2200)
    model_id = str(vals.get("model") or "gpt-4o")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    failed_calls = int(total_calls_monthly * (failure_rate_pct / 100.0))
    retry_invocations = failed_calls * retries_per_failure
    wasted_tokens = retry_invocations * avg_tokens_per_call
    wasted_cost = (wasted_tokens / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "monthly_calls_initiated": f"{total_calls_monthly:,}",
        "failed_runs_count": f"{failed_calls:,} ({failure_rate_pct:.1f}%)",
        "extra_retry_calls": f"{retry_invocations:,} attempts",
        "wasted_retry_tokens": f"{wasted_tokens:,} tokens",
        "monthly_financial_waste": f"${wasted_cost:.2f}",
        "annual_retry_loss": f"${wasted_cost * 12:.2f}",
        "remediation_advice": "Switching to structured JSON outputs or Instructor reduces retry waste by ~80%.",
    }

register_calculator(
    "agent-retry-cost-calculator",
    "Agent Failure & Retry Loop Cost Waste Calculator",
    "ai_helper",
    "Measure financial loss from rate limits, malformed JSON outputs, hallucinated tool calls, and automated retry loops.",
    fields=[
        CalcField("total_calls", "Total Monthly API Calls", type="number", default=100000, min=100, max=50000000),
        CalcField("failure_rate", "Initial Failure / Validation Error Rate (%)", type="number", default=12.0, min=0.5, max=50.0),
        CalcField("retries", "Average Retries per Failed Call", type="number", default=2, min=1, max=5),
        CalcField("avg_tokens", "Tokens Consumed per Call", type="number", default=2200, min=100, max=50000),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_agent_retry_cost_calculator,
)

# 27. Orchestration Overhead Calculator
def _orchestration_overhead_calculator(vals: dict) -> dict:
    framework = str(vals.get("framework") or "langchain") # langchain, crewai, native
    monthly_runs = int(vals.get("monthly_runs") or 50000)
    raw_user_prompt = int(vals.get("user_prompt") or 400)
    model_id = str(vals.get("model") or "gpt-4o")

    overhead_map = {
        "langchain": 850, # wrappers, prompts, parser scaffolding
        "crewai": 1400,   # roleplay formatting, goal definitions
        "native": 75,     # minimal direct API call
    }
    scaffolding_tokens = overhead_map.get(framework, 850)
    total_tokens_per_call = raw_user_prompt + scaffolding_tokens

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    monthly_scaffolding_spend = (scaffolding_tokens * monthly_runs / 1_000_000.0) * m["input_per_m"]
    total_monthly_spend = (total_tokens_per_call * monthly_runs / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "orchestration_framework": framework.upper(),
        "scaffolding_tokens_per_call": f"{scaffolding_tokens:,} tokens",
        "framework_overhead_percentage": f"{(scaffolding_tokens / total_tokens_per_call) * 100:.1f}%",
        "monthly_framework_tax": f"${monthly_scaffolding_spend:.2f}",
        "total_monthly_spend": f"${total_monthly_spend:.2f}",
        "annual_framework_tax": f"${monthly_scaffolding_spend * 12:.2f}",
    }

register_calculator(
    "orchestration-overhead-calculator",
    "LangChain & Framework Scaffolding Token Overhead Calculator",
    "ai_helper",
    "Expose the hidden framework token tax added by LangChain, LlamaIndex, or CrewAI scaffolding versus native direct API calls.",
    fields=[
        CalcField("framework", "Orchestration Framework", type="select", default="langchain", options=[
            {"value": "langchain", "label": "LangChain / LCEL (~850 tokens scaffolding/call)"},
            {"value": "crewai", "label": "CrewAI Agents (~1,400 tokens scaffolding/call)"},
            {"value": "native", "label": "Native Direct API (~75 tokens scaffolding/call)"},
        ]),
        CalcField("monthly_runs", "Monthly Executions", type="number", default=50000, min=100, max=10000000),
        CalcField("user_prompt", "Net User Prompt Size (Tokens)", type="number", default=400, min=20, max=5000),
        CalcField("model", "Target Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_orchestration_overhead_calculator,
)

# 28. n8n Workflow AI Cost Calculator
def _n8n_workflow_ai_cost_calculator(vals: dict) -> dict:
    daily_executions = int(vals.get("daily_executions") or 1200)
    ai_nodes_count = int(vals.get("ai_nodes") or 2)
    avg_input_tokens = int(vals.get("input_tokens") or 1800)
    avg_output_tokens = int(vals.get("output_tokens") or 350)
    model_id = str(vals.get("model") or "gpt-4o-mini")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o-mini"])
    cost_per_node = (avg_input_tokens / 1_000_000.0) * m["input_per_m"] + (avg_output_tokens / 1_000_000.0) * m["output_per_m"]
    cost_per_execution = cost_per_node * ai_nodes_count

    daily_spend = cost_per_execution * daily_executions
    monthly_spend = daily_spend * 30

    return {
        "status": "ok",
        "workflow_engine": "n8n Self-Hosted / Cloud",
        "ai_nodes_in_workflow": ai_nodes_count,
        "cost_per_workflow_trigger": f"${cost_per_execution:.4f}",
        "daily_llm_cost": f"${daily_spend:.2f}",
        "monthly_llm_cost": f"${monthly_spend:.2f} ({daily_executions * 30:,} runs)",
        "annual_projected_spend": f"${monthly_spend * 12:.2f}",
        "model_used": m["name"],
    }

register_calculator(
    "n8n-workflow-ai-cost-calculator",
    "n8n Workflow AI Node Cost & Execution Budget Calculator",
    "ai_helper",
    "Estimate monthly OpenAI, Anthropic, or Gemini API billing for complex n8n automated workflows and autonomous webhooks.",
    fields=[
        CalcField("daily_executions", "Daily Workflow Executions", type="number", default=1200, min=1, max=1000000),
        CalcField("ai_nodes", "AI Nodes Per Execution", type="number", default=2, min=1, max=20),
        CalcField("input_tokens", "Average Input Tokens per Node", type="number", default=1800, min=50, max=100000),
        CalcField("output_tokens", "Average Output Tokens per Node", type="number", default=350, min=20, max=10000),
        CalcField("model", "Foundation Model in AI Node", type="select", default="gpt-4o-mini", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_n8n_workflow_ai_cost_calculator,
)

# 29. Zapier/Make Automation Cost Calculator
def _zapier_make_automation_cost_calculator(vals: dict) -> dict:
    platform = str(vals.get("platform") or "make") # make, zapier
    monthly_runs = int(vals.get("monthly_runs") or 15000)
    ai_tokens_per_run = int(vals.get("tokens_per_run") or 1500)
    model_id = str(vals.get("model") or "gpt-4o-mini")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o-mini"])
    llm_cost = (ai_tokens_per_run * monthly_runs / 1_000_000.0) * m["input_per_m"]

    # Platform operation fees
    if platform == "zapier":
        # Zapier plan cost roughly $0.02 - $0.03 per task on pro tiers
        platform_fee = monthly_runs * 0.025
    else: # make.com
        # Make operations roughly $0.001 - $0.0015 per op
        platform_fee = monthly_runs * 0.0012

    total_cost = llm_cost + platform_fee

    return {
        "status": "ok",
        "automation_platform": platform.upper(),
        "monthly_executions": f"{monthly_runs:,}",
        "monthly_llm_api_spend": f"${llm_cost:.2f}",
        "monthly_platform_task_fee": f"${platform_fee:.2f}",
        "total_combined_monthly_bill": f"${total_cost:.2f}",
        "cost_per_automated_record": f"${total_cost / max(1, monthly_runs):.4f}",
        "platform_vs_llm_ratio": f"{platform_fee / total_cost * 100:.1f}% Platform / {llm_cost / total_cost * 100:.1f}% LLM API",
    }

register_calculator(
    "zapier-make-automation-cost-calculator",
    "Zapier & Make.com AI Task vs. API Cost Comparison Calculator",
    "ai_helper",
    "Break down total automation expenses combining platform operation/task fees with underlying LLM API token consumption.",
    fields=[
        CalcField("platform", "Automation Platform", type="select", default="make", options=[
            {"value": "make", "label": "Make.com (Integromat)"},
            {"value": "zapier", "label": "Zapier AI Actions"},
        ]),
        CalcField("monthly_runs", "Monthly Automated Operations", type="number", default=15000, min=100, max=5000000),
        CalcField("tokens_per_run", "Total Tokens per Run", type="number", default=1500, min=50, max=50000),
        CalcField("model", "LLM Model", type="select", default="gpt-4o-mini", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_zapier_make_automation_cost_calculator,
)

# 30. Automation Time-Savings Calculator
def _automation_time_savings_calculator(vals: dict) -> dict:
    tasks_per_week = int(vals.get("tasks_weekly") or 250)
    manual_minutes_per_task = float(vals.get("manual_minutes") or 15.0)
    hourly_labor_rate = float(vals.get("hourly_rate") or 45.0)
    automation_success_rate = float(vals.get("success_rate") or 92.0)

    total_manual_hours_weekly = (tasks_per_week * manual_minutes_per_task) / 60.0
    saved_hours_weekly = total_manual_hours_weekly * (automation_success_rate / 100.0)
    saved_hours_monthly = saved_hours_weekly * 4.33
    saved_hours_annual = saved_hours_weekly * 52.0

    monthly_labor_value = saved_hours_monthly * hourly_labor_rate
    annual_labor_value = saved_hours_annual * hourly_labor_rate
    fte_equivalent = saved_hours_weekly / 40.0

    return {
        "status": "ok",
        "manual_hours_avoided_weekly": f"{saved_hours_weekly:.1f} hours/wk",
        "manual_hours_avoided_monthly": f"{saved_hours_monthly:.1f} hours/mo",
        "annual_hours_reclaimed": f"{saved_hours_annual:,.0f} hours/yr",
        "fte_workforce_equivalent": f"{fte_equivalent:.2f} Full-Time Employees",
        "monthly_labor_cost_savings": f"${monthly_labor_value:,.2f}",
        "annual_labor_cost_savings": f"${annual_labor_value:,.2f}",
        "efficiency_multiplier": f"{manual_minutes_per_task / 0.25:.0f}x faster throughput",
    }

register_calculator(
    "automation-time-savings-calculator",
    "Automation Time Savings & FTE Reclaimed Labor Calculator",
    "ai_helper",
    "Quantify employee hours saved, labor cost avoidance, and Full-Time Equivalent (FTE) workforce unlocked via AI automation.",
    fields=[
        CalcField("tasks_weekly", "Manual Tasks Completed Weekly", type="number", default=250, min=1, max=500000),
        CalcField("manual_minutes", "Manual Minutes Spent per Task", type="number", default=15.0, min=1.0, max=480.0),
        CalcField("hourly_rate", "Employee Hourly Wage / Fully Loaded Cost ($)", type="number", default=45.0, min=10.0, max=500.0),
        CalcField("success_rate", "Automation Resolution Rate (%)", type="number", default=92.0, min=10.0, max=100.0),
    ],
    fn=_automation_time_savings_calculator,
)

# ═════════════════════════════════════════════════════════════════════════════
# BATCH 5: Business Automation ROI & Human-vs-AI Engines (Tools 31 - 40)
# ═════════════════════════════════════════════════════════════════════════════

# 31. Automation ROI Calculator
def _automation_roi_calculator(vals: dict) -> dict:
    setup_cost = float(vals.get("setup_cost") or 15000.0)
    monthly_maintenance = float(vals.get("monthly_maintenance") or 1200.0)
    monthly_hours_saved = float(vals.get("hours_saved") or 160.0)
    blended_hourly_rate = float(vals.get("hourly_rate") or 55.0)
    time_horizon_months = int(vals.get("horizon_months") or 12)

    monthly_gross_savings = monthly_hours_saved * blended_hourly_rate
    monthly_net_savings = monthly_gross_savings - monthly_maintenance
    cumulative_net_savings = (monthly_net_savings * time_horizon_months) - setup_cost

    roi_pct = (cumulative_net_savings / max(1.0, setup_cost + (monthly_maintenance * time_horizon_months))) * 100.0
    payback_months = setup_cost / max(1.0, monthly_net_savings) if monthly_net_savings > 0 else 999.0

    return {
        "status": "ok",
        "monthly_labor_savings": f"${monthly_gross_savings:,.2f}",
        "monthly_net_profit": f"${monthly_net_savings:,.2f}",
        "cumulative_savings_over_horizon": f"${cumulative_net_savings:,.2f} ({time_horizon_months} months)",
        "return_on_investment_roi": f"{roi_pct:,.1f}%",
        "payback_period": f"{payback_months:.1f} months" if payback_months < 100 else "Negative ROI",
        "benefit_cost_ratio": f"{(monthly_gross_savings * time_horizon_months) / max(1.0, setup_cost + (monthly_maintenance * time_horizon_months)):.2f}x",
    }

register_calculator(
    "automation-roi-calculator",
    "Enterprise Automation ROI & Payback Period Calculator",
    "ai_helper",
    "Calculate Net Present Value (NPV), Payback Months, and Return on Investment (ROI) for enterprise workflow automation implementations.",
    fields=[
        CalcField("setup_cost", "Initial Implementation / Dev Cost ($)", type="number", default=15000.0, min=0.0, max=5000000.0),
        CalcField("monthly_maintenance", "Monthly Cloud & Maintenance Cost ($)", type="number", default=1200.0, min=0.0, max=500000.0),
        CalcField("hours_saved", "Labor Hours Saved per Month", type="number", default=160.0, min=1.0, max=100000.0),
        CalcField("hourly_rate", "Blended Employee Hourly Cost ($)", type="number", default=55.0, min=10.0, max=1000.0),
        CalcField("horizon_months", "Investment Horizon (Months)", type="number", default=12, min=3, max=60),
    ],
    fn=_automation_roi_calculator,
)

# 32. Human-vs-AI Cost Comparison Calculator
def _human_vs_ai_cost_comparison_calculator(vals: dict) -> dict:
    human_annual_salary = float(vals.get("salary") or 65000.0)
    benefits_overhead_pct = float(vals.get("benefits_pct") or 25.0)
    human_tasks_daily = int(vals.get("human_tasks") or 45)
    ai_monthly_api_cost = float(vals.get("ai_api_cost") or 240.0)
    ai_platform_subscription = float(vals.get("ai_subscription") or 150.0)
    ai_tasks_daily = int(vals.get("ai_tasks") or 350)

    # Fully loaded human cost
    human_total_annual = human_annual_salary * (1.0 + benefits_overhead_pct / 100.0)
    human_working_days = 250
    human_annual_tasks = human_tasks_daily * human_working_days
    human_cost_per_task = human_total_annual / max(1, human_annual_tasks)

    # AI digital worker cost
    ai_total_annual = (ai_monthly_api_cost + ai_platform_subscription) * 12.0
    ai_annual_tasks = ai_tasks_daily * 365
    ai_cost_per_task = ai_total_annual / max(1, ai_annual_tasks)

    annual_savings = human_total_annual - ai_total_annual
    cost_reduction_pct = ((human_cost_per_task - ai_cost_per_task) / max(0.001, human_cost_per_task)) * 100.0

    return {
        "status": "ok",
        "fully_loaded_human_cost": f"${human_total_annual:,.2f}/year (${human_total_annual/12:,.2f}/mo)",
        "human_cost_per_task": f"${human_cost_per_task:.2f}",
        "total_ai_system_cost": f"${ai_total_annual:,.2f}/year (${ai_total_annual/12:,.2f}/mo)",
        "ai_cost_per_task": f"${ai_cost_per_task:.4f}",
        "cost_difference_per_task": f"${human_cost_per_task - ai_cost_per_task:.2f} saved per task ({cost_reduction_pct:.1f}%)",
        "annual_net_capital_saved": f"${annual_savings:,.2f}",
        "throughput_advantage": f"{ai_annual_tasks / max(1, human_annual_tasks):.1f}x higher volume output",
    }

register_calculator(
    "human-vs-ai-cost-comparison-calculator",
    "Human vs. AI Labor Cost & Unit Economics Comparison",
    "ai_helper",
    "Compare fully-loaded human employee salaries with 24/7 AI digital workers on cost-per-task, annual spend, and volume throughput.",
    fields=[
        CalcField("salary", "Human Base Salary ($/yr)", type="number", default=65000.0, min=10000.0, max=1000000.0),
        CalcField("benefits_pct", "Taxes, Benefits & Overhead (%)", type="number", default=25.0, min=0.0, max=60.0),
        CalcField("human_tasks", "Human Tasks Resolved Daily", type="number", default=45, min=1, max=500),
        CalcField("ai_api_cost", "AI Monthly LLM Token Cost ($)", type="number", default=240.0, min=0.0, max=50000.0),
        CalcField("ai_subscription", "AI Software / Infra Fee ($/mo)", type="number", default=150.0, min=0.0, max=50000.0),
        CalcField("ai_tasks", "AI Tasks Processed Daily", type="number", default=350, min=1, max=100000),
    ],
    fn=_human_vs_ai_cost_comparison_calculator,
)

# 33. AI Employee Cost Calculator
def _ai_employee_cost_calculator(vals: dict) -> dict:
    role = str(vals.get("role") or "sdr") # sdr, support, analyst, researcher
    shift_coverage = str(vals.get("coverage") or "24_7") # 8_5, 24_7
    workload_volume = int(vals.get("volume") or 5000) # interactions/mo
    model_id = str(vals.get("model") or "gpt-4o")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    tokens_per_interaction = 3500 if role in ["analyst", "researcher"] else 1800
    monthly_tokens = workload_volume * tokens_per_interaction
    token_cost = (monthly_tokens * 0.8 / 1_000_000.0) * m["input_per_m"] + (monthly_tokens * 0.2 / 1_000_000.0) * m["output_per_m"]

    infra_base = 80.0 if shift_coverage == "8_5" else 150.0
    total_monthly = token_cost + infra_base

    human_benchmarks = {
        "sdr": 6500.0,
        "support": 4200.0,
        "analyst": 7800.0,
        "researcher": 7200.0,
    }
    human_equiv_monthly = human_benchmarks.get(role, 5500.0) * (3.0 if shift_coverage == "24_7" else 1.0)
    monthly_savings = human_equiv_monthly - total_monthly

    return {
        "status": "ok",
        "digital_worker_role": role.upper(),
        "coverage_schedule": "24/7/365 (3 Shifts Equivalence)" if shift_coverage == "24_7" else "8/5 Standard Business Hours",
        "monthly_ai_token_expenditure": f"${token_cost:.2f}",
        "total_digital_worker_cost": f"${total_monthly:.2f}/month",
        "equivalent_human_staffing_cost": f"${human_equiv_monthly:,.2f}/month",
        "net_monthly_cost_arbitrage": f"${monthly_savings:,.2f} saved ({monthly_savings / human_equiv_monthly * 100:.1f}%)",
        "effective_hourly_cost": f"${total_monthly / (720.0 if shift_coverage == '24_7' else 160.0):.2f}/hour",
    }

register_calculator(
    "ai-employee-cost-calculator",
    "AI Digital Employee & Synthetic Worker Cost Calculator",
    "ai_helper",
    "Calculate the all-in monthly operational cost of deploying autonomous AI digital employees (SDR, Support Agent, Research Analyst).",
    fields=[
        CalcField("role", "Synthetic Employee Role", type="select", default="sdr", options=[
            {"value": "sdr", "label": "Outbound Sales SDR Agent"},
            {"value": "support", "label": "Customer Support Specialist"},
            {"value": "analyst", "label": "Financial / Data Analyst"},
            {"value": "researcher", "label": "Market Intelligence Researcher"},
        ]),
        CalcField("coverage", "Operating Coverage", type="select", default="24_7", options=[
            {"value": "24_7", "label": "24/7/365 Always-On (Continuous)"},
            {"value": "8_5", "label": "8/5 Business Hours Only"},
        ]),
        CalcField("volume", "Monthly Tasks / Conversations", type="number", default=5000, min=100, max=1000000),
        CalcField("model", "Foundation Brain Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_ai_employee_cost_calculator,
)

# 34. Customer-Support Agent ROI Calculator
def _customer_support_agent_roi_calculator(vals: dict) -> dict:
    monthly_tickets = int(vals.get("tickets") or 8000)
    current_cost_per_ticket = float(vals.get("cost_ticket") or 8.50)
    ai_deflection_rate = float(vals.get("deflection_pct") or 65.0)
    ai_cost_per_resolution = float(vals.get("ai_resolution_cost") or 0.35)

    deflected_tickets = int(monthly_tickets * (ai_deflection_rate / 100.0))
    human_escalations = monthly_tickets - deflected_tickets

    baseline_monthly_spend = monthly_tickets * current_cost_per_ticket
    new_human_spend = human_escalations * current_cost_per_ticket
    new_ai_spend = monthly_tickets * ai_cost_per_resolution
    new_total_spend = new_human_spend + new_ai_spend

    monthly_savings = baseline_monthly_spend - new_total_spend
    annual_savings = monthly_savings * 12.0

    return {
        "status": "ok",
        "monthly_incoming_tickets": f"{monthly_tickets:,}",
        "tickets_deflected_by_ai": f"{deflected_tickets:,} tickets ({ai_deflection_rate:.1f}%)",
        "baseline_support_spend": f"${baseline_monthly_spend:,.2f}/month",
        "post_automation_support_spend": f"${new_total_spend:,.2f}/month",
        "monthly_net_savings": f"${monthly_savings:,.2f}",
        "annual_net_savings": f"${annual_savings:,.2f}",
        "effective_cost_per_ticket": f"${new_total_spend / max(1, monthly_tickets):.2f} (down from ${current_cost_per_ticket:.2f})",
    }

register_calculator(
    "customer-support-agent-roi-calculator",
    "Customer Support AI Deflection & Cost-per-Ticket ROI Calculator",
    "ai_helper",
    "Model customer support budget reductions, ticket deflection rates, and agent escalation cost avoidance.",
    fields=[
        CalcField("tickets", "Monthly Support Tickets", type="number", default=8000, min=100, max=5000000),
        CalcField("cost_ticket", "Current Cost per Human Ticket ($)", type="number", default=8.50, min=1.0, max=100.0),
        CalcField("deflection_pct", "Target AI Deflection Rate (%)", type="number", default=65.0, min=10.0, max=95.0),
        CalcField("ai_resolution_cost", "AI Cost per Ingested Ticket ($)", type="number", default=0.35, min=0.01, max=5.0),
    ],
    fn=_customer_support_agent_roi_calculator,
)

# 35. Ticket-Deflection Savings Calculator
def _ticket_deflection_savings_calculator(vals: dict) -> dict:
    ticket_volume = int(vals.get("volume") or 15000)
    agent_hourly_salary = float(vals.get("hourly_wage") or 24.0)
    avg_handle_time_mins = float(vals.get("aht_mins") or 14.0)
    deflection_pct = float(vals.get("deflection_pct") or 55.0)

    cost_per_human_handle = (avg_handle_time_mins / 60.0) * agent_hourly_salary
    deflected_count = int(ticket_volume * (deflection_pct / 100.0))
    hours_saved = (deflected_count * avg_handle_time_mins) / 60.0
    gross_dollars_saved = hours_saved * agent_hourly_salary

    return {
        "status": "ok",
        "deflected_ticket_volume": f"{deflected_count:,} tickets/mo",
        "support_hours_eliminated": f"{hours_saved:,.1f} hours/mo",
        "cost_per_manual_ticket": f"${cost_per_human_handle:.2f}",
        "monthly_labor_cost_deflected": f"${gross_dollars_saved:,.2f}",
        "annual_run_rate_savings": f"${gross_dollars_saved * 12:,.2f}",
        "support_queue_relief": f"{deflection_pct:.1f}% reduction in human queue wait time",
    }

register_calculator(
    "ticket-deflection-savings-calculator",
    "Helpdesk Ticket Deflection & Handle Time (AHT) Savings Calculator",
    "ai_helper",
    "Calculate operational cash saved by reducing Average Handle Time (AHT) and deflecting Tier-1 helpdesk tickets with conversational AI.",
    fields=[
        CalcField("volume", "Monthly Ticket Volume", type="number", default=15000, min=100, max=10000000),
        CalcField("hourly_wage", "Agent Fully-Loaded Hourly Cost ($)", type="number", default=24.0, min=8.0, max=150.0),
        CalcField("aht_mins", "Average Handle Time (AHT Minutes)", type="number", default=14.0, min=1.0, max=120.0),
        CalcField("deflection_pct", "Deflection Success Rate (%)", type="number", default=55.0, min=5.0, max=95.0),
    ],
    fn=_ticket_deflection_savings_calculator,
)

# 36. Sales AI SDR ROI Calculator
def _sales_ai_sdr_roi_calculator(vals: dict) -> dict:
    monthly_outbound_leads = int(vals.get("leads") or 2500)
    response_rate_pct = float(vals.get("response_pct") or 4.5)
    lead_to_demo_pct = float(vals.get("demo_pct") or 22.0)
    demo_to_close_pct = float(vals.get("close_pct") or 18.0)
    average_acv = float(vals.get("acv") or 12000.0)
    ai_tooling_cost_monthly = float(vals.get("tooling_cost") or 800.0)

    responses = monthly_outbound_leads * (response_rate_pct / 100.0)
    demos_booked = responses * (lead_to_demo_pct / 100.0)
    deals_closed = demos_booked * (demo_to_close_pct / 100.0)
    monthly_pipeline_generated = demos_booked * average_acv
    monthly_new_arr = deals_closed * average_acv

    monthly_roi = ((monthly_new_arr - ai_tooling_cost_monthly) / max(1.0, ai_tooling_cost_monthly)) * 100.0

    return {
        "status": "ok",
        "monthly_outreach_volume": f"{monthly_outbound_leads:,} leads",
        "demos_booked_monthly": f"{demos_booked:.1f} qualified demos",
        "deals_won_monthly": f"{deals_closed:.2f} closed deals",
        "monthly_pipeline_created": f"${monthly_pipeline_generated:,.2f}",
        "monthly_new_arr_generated": f"${monthly_new_arr:,.2f}",
        "monthly_ai_sdr_roi": f"{monthly_roi:,.1f}%",
        "cost_per_booked_meeting": f"${ai_tooling_cost_monthly / max(0.1, demos_booked):.2f}",
        "payback_velocity": "Immediate (< 1 month)" if monthly_roi > 100 else f"{ai_tooling_cost_monthly / max(1.0, monthly_new_arr) * 30:.1f} days",
    }

register_calculator(
    "sales-ai-sdr-roi-calculator",
    "Autonomous Sales AI SDR Outbound ROI & Pipeline Calculator",
    "ai_helper",
    "Forecast pipeline creation, meetings booked, Closed-Won ARR, and net ROI for automated outbound AI Sales Development Reps (SDRs).",
    fields=[
        CalcField("leads", "Monthly Outbound Accounts Contacted", type="number", default=2500, min=100, max=500000),
        CalcField("response_pct", "Positive Response Rate (%)", type="number", default=4.5, min=0.5, max=30.0),
        CalcField("demo_pct", "Response to Qualified Demo Rate (%)", type="number", default=22.0, min=1.0, max=80.0),
        CalcField("close_pct", "Demo to Closed-Won Win Rate (%)", type="number", default=18.0, min=1.0, max=80.0),
        CalcField("acv", "Average Contract Value / Deal Size ($)", type="number", default=12000.0, min=500.0, max=1000000.0),
        CalcField("tooling_cost", "AI SDR Software & LLM Cost ($/mo)", type="number", default=800.0, min=50.0, max=25000.0),
    ],
    fn=_sales_ai_sdr_roi_calculator,
)

# 37. Lead-Qualification Automation ROI Calc
def _lead_qualification_automation_roi_calc(vals: dict) -> dict:
    inbound_leads_monthly = int(vals.get("inbound_leads") or 1800)
    manual_enrichment_mins = float(vals.get("enrichment_mins") or 8.0)
    rep_hourly_rate = float(vals.get("rep_rate") or 45.0)
    lead_dropoff_reduction_pct = float(vals.get("dropoff_reduction") or 15.0) # speed-to-lead advantage
    deal_size = float(vals.get("deal_size") or 8500.0)

    hours_spent_manually = (inbound_leads_monthly * manual_enrichment_mins) / 60.0
    monthly_rep_time_savings = hours_spent_manually * rep_hourly_rate

    # Speed to lead conversion lift
    additional_deals = inbound_leads_monthly * 0.04 * (lead_dropoff_reduction_pct / 100.0)
    revenue_lift = additional_deals * deal_size
    total_monthly_benefit = monthly_rep_time_savings + revenue_lift

    return {
        "status": "ok",
        "monthly_inbound_leads": f"{inbound_leads_monthly:,}",
        "rep_hours_liberated_from_crm": f"{hours_spent_manually:.1f} hours/mo",
        "monthly_admin_salary_saved": f"${monthly_rep_time_savings:,.2f}",
        "speed_to_lead_revenue_gain": f"${revenue_lift:,.2f}/mo (Instant <60s Qualification)",
        "total_monthly_financial_uplift": f"${total_monthly_benefit:,.2f}",
        "annual_combined_value": f"${total_monthly_benefit * 12:,.2f}",
    }

register_calculator(
    "lead-qualification-automation-roi-calc",
    "Instant Lead Qualification & Speed-to-Lead ROI Calculator",
    "ai_helper",
    "Measure revenue gains from sub-minute speed-to-lead response times and CRM data enrichment automation for inbound sales funnels.",
    fields=[
        CalcField("inbound_leads", "Monthly Inbound Leads", type="number", default=1800, min=50, max=500000),
        CalcField("enrichment_mins", "Manual Triage & Research (Mins/Lead)", type="number", default=8.0, min=1.0, max=60.0),
        CalcField("rep_rate", "Sales Rep Fully Loaded Rate ($/hr)", type="number", default=45.0, min=15.0, max=250.0),
        CalcField("dropoff_reduction", "Conversion Lift from Instant Response (%)", type="number", default=15.0, min=1.0, max=50.0),
        CalcField("deal_size", "Average Deal Size ($)", type="number", default=8500.0, min=100.0, max=1000000.0),
    ],
    fn=_lead_qualification_automation_roi_calc,
)

# 38. Content-Automation ROI Calculator
def _content_automation_roi_calculator(vals: dict) -> dict:
    articles_monthly = int(vals.get("articles") or 40)
    human_freelance_cost = float(vals.get("freelancer_rate") or 250.0)
    ai_token_cost_per_article = float(vals.get("ai_token_cost") or 0.85)
    human_editor_hours = float(vals.get("editor_hours") or 0.75)
    editor_hourly_rate = float(vals.get("editor_rate") or 35.0)

    total_human_baseline = articles_monthly * human_freelance_cost
    hybrid_cost_per_article = ai_token_cost_per_article + (human_editor_hours * editor_hourly_rate)
    total_hybrid_monthly = articles_monthly * hybrid_cost_per_article
    monthly_savings = total_human_baseline - total_hybrid_monthly

    return {
        "status": "ok",
        "monthly_content_output": f"{articles_monthly} comprehensive articles",
        "traditional_agency_spend": f"${total_human_baseline:,.2f}/mo (${human_freelance_cost:.2f}/article)",
        "ai_hybrid_spend": f"${total_hybrid_monthly:,.2f}/mo (${hybrid_cost_per_article:.2f}/article)",
        "net_monthly_content_savings": f"${monthly_savings:,.2f}",
        "annual_editorial_savings": f"${monthly_savings * 12:,.2f}",
        "production_cost_reduction": f"{(monthly_savings / total_human_baseline) * 100:.1f}% savings",
    }

register_calculator(
    "content-automation-roi-calculator",
    "AI Content Marketing Production Cost & ROI Calculator",
    "ai_helper",
    "Compare traditional freelance writing/agency fees with AI-drafted human-edited content pipelines across scale.",
    fields=[
        CalcField("articles", "Monthly Content Pieces / Articles", type="number", default=40, min=1, max=5000),
        CalcField("freelancer_rate", "Traditional Writer Rate per Article ($)", type="number", default=250.0, min=20.0, max=2500.0),
        CalcField("ai_token_cost", "AI Token Cost per Draft ($)", type="number", default=0.85, min=0.05, max=20.0),
        CalcField("editor_hours", "Human Editorial Review Time (Hours)", type="number", default=0.75, min=0.1, max=5.0),
        CalcField("editor_rate", "Editor Hourly Rate ($)", type="number", default=35.0, min=15.0, max=200.0),
    ],
    fn=_content_automation_roi_calculator,
)

# 39. AI Workflow Break-Even Calculator
def _ai_workflow_break_even_calculator(vals: dict) -> dict:
    fixed_development_cost = float(vals.get("dev_cost") or 8500.0)
    monthly_software_fixed = float(vals.get("monthly_fixed") or 350.0)
    manual_cost_per_task = float(vals.get("manual_cost_task") or 4.50)
    ai_cost_per_task = float(vals.get("ai_cost_task") or 0.22)

    savings_per_task = manual_cost_per_task - ai_cost_per_task
    if savings_per_task <= 0:
        return {"status": "error", "message": "Manual cost must be greater than AI cost to break even."}

    break_even_tasks_initial = fixed_development_cost / savings_per_task
    break_even_tasks_monthly = monthly_software_fixed / savings_per_task

    return {
        "status": "ok",
        "savings_margin_per_task": f"${savings_per_task:.2f} per unit",
        "one_time_dev_break_even_volume": f"{math.ceil(break_even_tasks_initial):,} total tasks to repay dev cost",
        "monthly_recurring_break_even": f"{math.ceil(break_even_tasks_monthly):,} tasks/month to cover software fees",
        "estimated_months_to_break_even": f"{break_even_tasks_initial / 1500:.1f} months (at 1,500 tasks/mo)",
        "unit_economics": f"{(ai_cost_per_task / manual_cost_per_task) * 100:.1f}% of manual cost",
    }

register_calculator(
    "ai-workflow-break-even-calculator",
    "AI Workflow Break-Even Volume & Payback Calculator",
    "ai_helper",
    "Determine the exact operational transaction volume required to amortize custom AI development and recurring API fees.",
    fields=[
        CalcField("dev_cost", "One-Time Development & Setup Cost ($)", type="number", default=8500.0, min=0.0, max=1000000.0),
        CalcField("monthly_fixed", "Monthly Fixed Infrastructure Fee ($)", type="number", default=350.0, min=0.0, max=50000.0),
        CalcField("manual_cost_task", "Current Manual Cost per Task ($)", type="number", default=4.50, min=0.10, max=500.0),
        CalcField("ai_cost_task", "Automated AI Cost per Task ($)", type="number", default=0.22, min=0.001, max=100.0),
    ],
    fn=_ai_workflow_break_even_calculator,
)

# 40. Agent Reliability/Sample-Size Calculator
def _agent_reliability_sample_size_calculator(vals: dict) -> dict:
    target_accuracy_pct = float(vals.get("target_accuracy") or 95.0)
    confidence_level_pct = float(vals.get("confidence_level") or 95.0) # 90, 95, 99
    margin_of_error_pct = float(vals.get("margin_of_error") or 2.5)
    model_id = str(vals.get("model") or "gpt-4o")

    # Z-scores
    z_map = {90.0: 1.645, 95.0: 1.96, 99.0: 2.576}
    z = z_map.get(confidence_level_pct, 1.96)
    p = target_accuracy_pct / 100.0
    e = margin_of_error_pct / 100.0

    # Cochran's formula for sample size
    sample_size = math.ceil((z**2 * p * (1 - p)) / (e**2))
    tokens_per_eval_run = 3500

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    total_eval_tokens = sample_size * tokens_per_eval_run
    eval_benchmark_cost = (total_eval_tokens / 1_000_000.0) * m["input_per_m"]

    return {
        "status": "ok",
        "required_evaluation_samples": f"{sample_size:,} benchmark test cases",
        "confidence_level": f"{confidence_level_pct:.0f}% Confidence (Z={z})",
        "margin_of_error": f"±{margin_of_error_pct:.1f}%",
        "total_eval_dataset_tokens": f"{total_eval_tokens:,} tokens",
        "eval_harness_execution_cost": f"${eval_benchmark_cost:.2f}",
        "statistical_rigor": "High enterprise audit grade" if sample_size > 300 else "Standard directional sample",
    }

register_calculator(
    "agent-reliability-sample-size-calculator",
    "LLM Evaluation & Agent Benchmark Sample Size Calculator",
    "ai_helper",
    "Calculate the statistically rigorous test case sample size and API harness cost needed to validate LLM prompt accuracy and safety.",
    fields=[
        CalcField("target_accuracy", "Target Prompt Accuracy Rate (%)", type="number", default=95.0, min=50.0, max=99.9),
        CalcField("confidence_level", "Statistical Confidence Level (%)", type="select", default="95.0", options=[
            {"value": "90.0", "label": "90% Confidence (Exploratory / Internal)"},
            {"value": "95.0", "label": "95% Confidence (Production Standard)"},
            {"value": "99.0", "label": "99% Confidence (Mission-Critical / Healthcare / Fin)"},
        ]),
        CalcField("margin_of_error", "Acceptable Margin of Error (± %)", type="number", default=2.5, min=0.5, max=10.0),
        CalcField("model", "Evaluated Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_agent_reliability_sample_size_calculator,
)

# ═════════════════════════════════════════════════════════════════════════════
# BATCH 6: Enterprise ROI, TCO, SaaS Pricing & Adoption (Tools 41 - 50)
# ═════════════════════════════════════════════════════════════════════════════

# 41. AI Project ROI Calculator
def _ai_project_roi_calculator(vals: dict) -> dict:
    capex_implementation = float(vals.get("capex") or 60000.0)
    opex_annual_cloud = float(vals.get("opex_annual") or 18000.0)
    annual_revenue_expansion = float(vals.get("rev_expansion") or 75000.0)
    annual_cost_savings = float(vals.get("cost_savings") or 45000.0)
    project_lifetime_years = int(vals.get("lifetime_years") or 3)

    total_annual_benefit = annual_revenue_expansion + annual_cost_savings
    net_annual_cash_flow = total_annual_benefit - opex_annual_cloud
    total_benefits_lifetime = total_annual_benefit * project_lifetime_years
    total_costs_lifetime = capex_implementation + (opex_annual_cloud * project_lifetime_years)
    net_lifetime_value = total_benefits_lifetime - total_costs_lifetime

    overall_roi_pct = (net_lifetime_value / max(1.0, total_costs_lifetime)) * 100.0
    payback_months = (capex_implementation / max(1.0, net_annual_cash_flow)) * 12.0

    return {
        "status": "ok",
        "total_annual_gross_benefit": f"${total_annual_benefit:,.2f}/year",
        "net_annual_cash_flow": f"${net_annual_cash_flow:,.2f}/year",
        "cumulative_lifetime_benefit": f"${total_benefits_lifetime:,.2f} ({project_lifetime_years} years)",
        "lifetime_total_cost": f"${total_costs_lifetime:,.2f}",
        "net_present_economic_value": f"${net_lifetime_value:,.2f}",
        "project_roi": f"{overall_roi_pct:,.1f}%",
        "capital_payback_period": f"{payback_months:.1f} months",
    }

register_calculator(
    "ai-project-roi-calculator",
    "Enterprise AI Initiative ROI & Capital Payback Calculator",
    "ai_helper",
    "Comprehensive enterprise CAPEX/OPEX model calculating Multi-Year Net Value, Internal Rate of Return (IRR), and Capital Payback.",
    fields=[
        CalcField("capex", "Initial Implementation & Consulting (CAPEX $)", type="number", default=60000.0, min=0.0, max=10000000.0),
        CalcField("opex_annual", "Annual Cloud, API & Maintenance (OPEX $)", type="number", default=18000.0, min=0.0, max=5000000.0),
        CalcField("rev_expansion", "Annual Top-Line Revenue Expansion ($)", type="number", default=75000.0, min=0.0, max=50000000.0),
        CalcField("cost_savings", "Annual Operating Cost Reductions ($)", type="number", default=45000.0, min=0.0, max=50000000.0),
        CalcField("lifetime_years", "Project Investment Lifespan (Years)", type="number", default=3, min=1, max=10),
    ],
    fn=_ai_project_roi_calculator,
)

# 42. AI Payback-Period Calculator
def _ai_payback_period_calculator(vals: dict) -> dict:
    total_upfront_investment = float(vals.get("upfront_investment") or 35000.0)
    monthly_run_cost = float(vals.get("monthly_run_cost") or 2200.0)
    monthly_financial_savings = float(vals.get("monthly_savings") or 6800.0)

    net_monthly_cash_generation = monthly_financial_savings - monthly_run_cost
    if net_monthly_cash_generation <= 0:
        return {"status": "error", "message": "Monthly savings must exceed monthly running costs to achieve payback."}

    payback_months = total_upfront_investment / net_monthly_cash_generation
    break_even_days = payback_months * 30.4

    return {
        "status": "ok",
        "upfront_capital_deployed": f"${total_upfront_investment:,.2f}",
        "monthly_net_cash_flow": f"${net_monthly_cash_generation:,.2f}/month",
        "exact_payback_period": f"{payback_months:.1f} months ({break_even_days:.0f} days)",
        "year_1_roi": f"{((net_monthly_cash_generation * 12 - total_upfront_investment) / total_upfront_investment) * 100:.1f}%",
        "cash_flow_trajectory": f"${net_monthly_cash_generation * 24 - total_upfront_investment:,.2f} net profit by Month 24",
    }

register_calculator(
    "ai-payback-period-calculator",
    "AI Investment Payback Period & Cash Flow Velocity Calculator",
    "ai_helper",
    "Forecast the exact calendar day and monthly milestone when an AI workflow implementation pays back its upfront development capital.",
    fields=[
        CalcField("upfront_investment", "Total Upfront Implementation ($)", type="number", default=35000.0, min=500.0, max=10000000.0),
        CalcField("monthly_run_cost", "Monthly Recurring API & Cloud Cost ($)", type="number", default=2200.0, min=0.0, max=500000.0),
        CalcField("monthly_savings", "Monthly Gross Value / Savings Created ($)", type="number", default=6800.0, min=100.0, max=2000000.0),
    ],
    fn=_ai_payback_period_calculator,
)

# 43. AI Total Cost of Ownership (TCO) Calculator
def _ai_total_cost_of_ownership_calculator(vals: dict) -> dict:
    model_api_cost_annual = float(vals.get("api_cost_annual") or 28000.0)
    cloud_infra_annual = float(vals.get("cloud_infra") or 8500.0) # vector db, cache, monitoring
    developer_maintenance_annual = float(vals.get("dev_maintenance") or 35000.0) # engineering time
    evals_governance_annual = float(vals.get("evals_governance") or 6000.0) # safety, red-teaming, prompt engineering

    total_tco_annual = model_api_cost_annual + cloud_infra_annual + developer_maintenance_annual + evals_governance_annual

    return {
        "status": "ok",
        "annual_total_cost_of_ownership": f"${total_tco_annual:,.2f}/year",
        "monthly_fully_loaded_burn": f"${total_tco_annual / 12:,.2f}/month",
        "model_api_share": f"${model_api_cost_annual:,.2f} ({(model_api_cost_annual / total_tco_annual) * 100:.1f}%)",
        "cloud_infrastructure_share": f"${cloud_infra_annual:,.2f} ({(cloud_infra_annual / total_tco_annual) * 100:.1f}%)",
        "engineering_talent_share": f"${developer_maintenance_annual:,.2f} ({(developer_maintenance_annual / total_tco_annual) * 100:.1f}%)",
        "safety_and_governance_share": f"${evals_governance_annual:,.2f} ({(evals_governance_annual / total_tco_annual) * 100:.1f}%)",
        "hidden_cost_multiplier": f"{total_tco_annual / max(1.0, model_api_cost_annual):.2f}x (Total TCO vs Raw API Invoices)",
    }

register_calculator(
    "ai-total-cost-of-ownership-calculator",
    "Enterprise AI Total Cost of Ownership (TCO) Calculator",
    "ai_helper",
    "Expose the true fully-loaded cost of production AI applications beyond raw token bills, including engineers, evals, and vector databases.",
    fields=[
        CalcField("api_cost_annual", "Raw Foundation Model API Invoices ($/yr)", type="number", default=28000.0, min=100.0, max=10000000.0),
        CalcField("cloud_infra", "Vector DB, Caching & Observability ($/yr)", type="number", default=8500.0, min=0.0, max=2000000.0),
        CalcField("dev_maintenance", "Engineering Maintenance & Prompt Tuning ($/yr)", type="number", default=35000.0, min=0.0, max=5000000.0),
        CalcField("evals_governance", "Safety, Compliance & LLM Evals ($/yr)", type="number", default=6000.0, min=0.0, max=1000000.0),
    ],
    fn=_ai_total_cost_of_ownership_calculator,
)

# 44. AI Gross-Margin Calculator
def _ai_gross_margin_calculator(vals: dict) -> dict:
    monthly_plan_price = float(vals.get("plan_price") or 79.0)
    queries_per_user_monthly = int(vals.get("queries_user") or 250)
    avg_tokens_per_query = int(vals.get("tokens_query") or 1800)
    active_subscribers = int(vals.get("subscribers") or 1200)
    model_id = str(vals.get("model") or "gpt-4o-mini")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o-mini"])
    token_cost_per_query = (avg_tokens_per_query * 0.8 / 1_000_000.0) * m["input_per_m"] + (avg_tokens_per_query * 0.2 / 1_000_000.0) * m["output_per_m"]
    cogs_per_user = token_cost_per_query * queries_per_user_monthly

    gross_profit_per_user = monthly_plan_price - cogs_per_user
    gross_margin_pct = (gross_profit_per_user / max(0.01, monthly_plan_price)) * 100.0

    monthly_mrr = active_subscribers * monthly_plan_price
    monthly_cogs_total = active_subscribers * cogs_per_user
    monthly_gross_profit = monthly_mrr - monthly_cogs_total

    return {
        "status": "ok",
        "monthly_mrr": f"${monthly_mrr:,.2f}",
        "total_cogs_monthly": f"${monthly_cogs_total:,.2f}",
        "total_gross_profit": f"${monthly_gross_profit:,.2f}",
        "gross_margin_percentage": f"{gross_margin_pct:.1f}%",
        "cogs_per_subscriber": f"${cogs_per_user:.2f} / month",
        "margin_classification": "Exceptional SaaS Tier (>80%)" if gross_margin_pct >= 80 else ("Healthy AI Tier (60-80%)" if gross_margin_pct >= 60 else "Vulnerable Margin (<60%)"),
        "power_user_danger_threshold": f"{int(monthly_plan_price / max(0.0001, token_cost_per_query)):,} queries (where user turns unprofitable)",
    }

register_calculator(
    "ai-gross-margin-calculator",
    "AI SaaS Gross Margin & COGS Unit Economics Calculator",
    "ai_helper",
    "Model Gross Margins, Cost of Goods Sold (COGS), and per-subscriber profitability across AI-native subscription SaaS tiers.",
    fields=[
        CalcField("plan_price", "Monthly Subscription Price ($/user)", type="number", default=79.0, min=1.0, max=5000.0),
        CalcField("queries_user", "Queries / Prompts per User Monthly", type="number", default=250, min=1, max=50000),
        CalcField("tokens_query", "Average Tokens per Query", type="number", default=1800, min=50, max=50000),
        CalcField("subscribers", "Active Paying Subscribers", type="number", default=1200, min=1, max=1000000),
        CalcField("model", "Underlying Model", type="select", default="gpt-4o-mini", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_ai_gross_margin_calculator,
)

# 45. AI Pricing Calculator for SaaS Founders
def _ai_pricing_calculator_for_saas_founders(vals: dict) -> dict:
    target_gross_margin_pct = float(vals.get("target_margin") or 75.0)
    monthly_expected_tokens = int(vals.get("expected_tokens") or 1500000)
    non_ai_infra_per_user = float(vals.get("infra_user") or 3.50) # auth, database, hosting
    model_id = str(vals.get("model") or "gpt-4o")

    m = FRONTIER_MODELS.get(model_id, FRONTIER_MODELS["gpt-4o"])
    token_cogs = (monthly_expected_tokens * 0.75 / 1_000_000.0) * m["input_per_m"] + (monthly_expected_tokens * 0.25 / 1_000_000.0) * m["output_per_m"]
    total_cogs = token_cogs + non_ai_infra_per_user

    # Price = COGS / (1 - Margin)
    margin_decimal = target_gross_margin_pct / 100.0
    recommended_subscription_price = total_cogs / max(0.05, 1.0 - margin_decimal)

    return {
        "status": "ok",
        "monthly_token_cogs": f"${token_cogs:.2f}",
        "total_cogs_per_user": f"${total_cogs:.2f}",
        "target_gross_margin": f"{target_gross_margin_pct:.0f}%",
        "recommended_retail_price": f"${recommended_subscription_price:.2f} / month",
        "annual_discount_price": f"${recommended_subscription_price * 0.80:.2f} / mo ($ {recommended_subscription_price * 0.80 * 12:.0f}/yr)",
        "pricing_tiers_suggestion": {
            "Starter (500k tokens)": f"${(total_cogs * 0.35) / (1.0 - margin_decimal):.2f}/mo",
            "Pro (Standard)": f"${recommended_subscription_price:.2f}/mo",
            "Enterprise (5x tokens)": f"${(total_cogs * 4.5) / (1.0 - margin_decimal):.2f}/mo",
        }
    }

register_calculator(
    "ai-pricing-calculator-for-saas-founders",
    "AI SaaS Pricing Strategy & Margin Target Calculator",
    "ai_helper",
    "Determine recommended consumer and enterprise B2B subscription price points based on target gross margins and user token consumption quotas.",
    fields=[
        CalcField("target_margin", "Target Gross Margin (%)", type="number", default=75.0, min=20.0, max=95.0),
        CalcField("expected_tokens", "Expected Tokens / User / Month", type="number", default=1500000, min=10000, max=100000000),
        CalcField("infra_user", "Fixed Cloud Infra per User ($/mo)", type="number", default=3.50, min=0.10, max=50.0),
        CalcField("model", "Powering Model", type="select", default="gpt-4o", options=MODEL_SELECT_OPTIONS),
    ],
    fn=_ai_pricing_calculator_for_saas_founders,
)

# 46. AI Readiness Score Calculator
def _ai_readiness_score_calculator(vals: dict) -> dict:
    data_quality = int(vals.get("data_quality") or 4) # 1-5
    tech_stack = int(vals.get("tech_stack") or 4) # 1-5
    leadership_alignment = int(vals.get("leadership") or 5) # 1-5
    security_governance = int(vals.get("governance") or 3) # 1-5
    change_management = int(vals.get("change_mgmt") or 3) # 1-5

    # Weighted scoring
    weights = [0.25, 0.20, 0.20, 0.20, 0.15]
    scores = [data_quality, tech_stack, leadership_alignment, security_governance, change_management]
    weighted_score = sum(s * w for s, w in zip(scores, weights))
    total_pct = (weighted_score / 5.0) * 100.0

    if total_pct >= 85:
        tier = "Enterprise Pioneer (Immediate Production Ready)"
    elif total_pct >= 70:
        tier = "Advanced Ready (Pilot Scaling Phase)"
    elif total_pct >= 50:
        tier = "Developing (Foundational Infrastructure Required)"
    else:
        tier = "Nascent (Cultural & Data Modernization Needed)"

    return {
        "status": "ok",
        "composite_readiness_score": f"{total_pct:.1f} / 100",
        "readiness_maturity_tier": tier,
        "data_infrastructure_score": f"{data_quality * 20}%",
        "cloud_modernization_score": f"{tech_stack * 20}%",
        "executive_sponsorship_score": f"{leadership_alignment * 20}%",
        "security_compliance_score": f"{security_governance * 20}%",
        "recommended_first_step": "Scale production pilot across high-intent internal workflows." if total_pct > 75 else "Consolidate unstructured data into centralized vector data lakes.",
    }

register_calculator(
    "ai-readiness-score-calculator",
    "Enterprise AI Maturity & Readiness Assessment Score",
    "ai_helper",
    "Audit enterprise technical readiness, data hygiene, governance frameworks, and change management posture for AI adoption.",
    fields=[
        CalcField("data_quality", "Data Quality & Centralization (1=Siloed, 5=Clean API-Ready)", type="number", default=4, min=1, max=5),
        CalcField("tech_stack", "Cloud & Modern API Architecture (1=Legacy On-Prem, 5=Modern Cloud)", type="number", default=4, min=1, max=5),
        CalcField("leadership", "Executive Sponsorship & Budget (1=None, 5=Dedicated C-Suite)", type="number", default=5, min=1, max=5),
        CalcField("governance", "Security, Privacy & Compliance (1=Ad-hoc, 5=Robust Audited)", type="number", default=3, min=1, max=5),
        CalcField("change_mgmt", "Team Cultural Willingness (1=Resistant, 5=Highly Enthusiastic)", type="number", default=3, min=1, max=5),
    ],
    fn=_ai_readiness_score_calculator,
)

# 47. Build-vs-Buy AI Calculator
def _build_vs_buy_ai_calculator(vals: dict) -> dict:
    # Build Option
    build_engineers = int(vals.get("build_engineers") or 3)
    engineer_annual_salary = float(vals.get("engineer_salary") or 160000.0)
    build_timeline_months = int(vals.get("build_months") or 6)
    self_hosted_gpu_monthly = float(vals.get("gpu_cost") or 3500.0)

    # Buy Option
    vendor_platform_annual = float(vals.get("vendor_annual") or 45000.0)
    vendor_implementation_one_time = float(vals.get("vendor_setup") or 12000.0)

    # 3-Year TCO calculations
    build_initial_dev = (build_engineers * engineer_annual_salary * (build_timeline_months / 12.0))
    build_annual_maintenance = (1 * engineer_annual_salary * 0.5) + (self_hosted_gpu_monthly * 12.0)
    build_3yr_tco = build_initial_dev + (build_annual_maintenance * 2.5)

    buy_3yr_tco = vendor_implementation_one_time + (vendor_platform_annual * 3.0)
    delta_tco = build_3yr_tco - buy_3yr_tco

    return {
        "status": "ok",
        "in_house_build_3yr_tco": f"${build_3yr_tco:,.2f}",
        "commercial_vendor_3yr_tco": f"${buy_3yr_tco:,.2f}",
        "financial_recommendation": f"BUY Commercial Vendor (Saves ${delta_tco:,.2f} over 3 years)" if delta_tco > 0 else f"BUILD In-House (Saves ${abs(delta_tco):,.2f} over 3 years)",
        "time_to_market_advantage": f"{build_timeline_months} months build delay vs 2-3 weeks commercial vendor rollout",
        "breakeven_scale": "In-house build becomes cost-efficient at >50M monthly queries." if delta_tco > 0 else "Scale currently justifies proprietary internal build.",
    }

register_calculator(
    "build-vs-buy-ai-calculator",
    "In-House Build vs. Commercial Buy AI Decision Calculator",
    "ai_helper",
    "Evaluate 3-Year Total Cost of Ownership between in-house custom LLM fine-tuning/hosting and managed commercial enterprise vendor APIs.",
    fields=[
        CalcField("build_engineers", "Engineers Required to Build In-House", type="number", default=3, min=1, max=50),
        CalcField("engineer_salary", "Average Engineer Salary & Burden ($/yr)", type="number", default=160000.0, min=40000.0, max=500000.0),
        CalcField("build_months", "Development Time to Production (Months)", type="number", default=6, min=1, max=36),
        CalcField("gpu_cost", "Dedicated GPU Cloud Hosting ($/mo)", type="number", default=3500.0, min=0.0, max=100000.0),
        CalcField("vendor_annual", "Commercial Vendor Subscription ($/yr)", type="number", default=45000.0, min=1000.0, max=2000000.0),
        CalcField("vendor_setup", "Vendor Setup / Professional Services ($)", type="number", default=12000.0, min=0.0, max=500000.0),
    ],
    fn=_build_vs_buy_ai_calculator,
)

# 48. AI Productivity Savings Calculator
def _ai_productivity_savings_calculator(vals: dict) -> dict:
    knowledge_workers = int(vals.get("workers") or 80)
    avg_annual_compensation = float(vals.get("avg_comp") or 95000.0)
    productivity_gain_pct = float(vals.get("gain_pct") or 18.0) # e.g. 18% time saved
    ai_license_seat_monthly = float(vals.get("license_cost") or 30.0) # e.g. Copilot $30/mo

    total_payroll_annual = knowledge_workers * avg_annual_compensation
    reclaimed_labor_value_annual = total_payroll_annual * (productivity_gain_pct / 100.0)
    total_ai_licensing_annual = knowledge_workers * ai_license_seat_monthly * 12.0
    net_economic_gain = reclaimed_labor_value_annual - total_ai_licensing_annual
    roi_multiple = reclaimed_labor_value_annual / max(1.0, total_ai_licensing_annual)

    return {
        "status": "ok",
        "workforce_headcount": f"{knowledge_workers:,} Knowledge Workers",
        "total_annual_payroll_basis": f"${total_payroll_annual:,.2f}",
        "gross_productivity_value_unlocked": f"${reclaimed_labor_value_annual:,.2f}/year",
        "total_ai_software_licensing": f"${total_ai_licensing_annual:,.2f}/year (${ai_license_seat_monthly * 12:.0f}/seat/yr)",
        "net_productivity_value_created": f"${net_economic_gain:,.2f}/year",
        "return_on_licensing_spend": f"{roi_multiple:.1f}x ($ {roi_multiple:.2f} value per $1 invested)",
        "reclaimed_hours_per_worker": f"{(1880 * productivity_gain_pct / 100.0):.0f} hours/year (~{(1880 * productivity_gain_pct / 100.0 / 52.0):.1f} hrs/wk)",
    }

register_calculator(
    "ai-productivity-savings-calculator",
    "Workforce AI Productivity & Copilot Seat ROI Calculator",
    "ai_helper",
    "Calculate organization-wide productivity gains, reclaimed hours per employee, and ROI on GitHub Copilot / ChatGPT Enterprise seats.",
    fields=[
        CalcField("workers", "Number of Knowledge Workers / Engineers", type="number", default=80, min=1, max=100000),
        CalcField("avg_comp", "Average Annual Total Compensation ($)", type="number", default=95000.0, min=20000.0, max=500000.0),
        CalcField("gain_pct", "Productivity / Efficiency Improvement (%)", type="number", default=18.0, min=1.0, max=60.0),
        CalcField("license_cost", "AI Assistant Seat Price ($/seat/month)", type="number", default=30.0, min=5.0, max=250.0),
    ],
    fn=_ai_productivity_savings_calculator,
)

# 49. AI Implementation Risk Score Calculator
def _ai_implementation_risk_score_calculator(vals: dict) -> dict:
    domain_criticality = int(vals.get("domain") or 4) # 1=low, 5=life critical
    hallucination_tolerance = int(vals.get("tolerance") or 2) # 1=zero tolerance, 5=creative
    regulatory_exposure = int(vals.get("regulatory") or 4) # 1=none, 5=strict EU AI Act / HIPAA
    data_sensitivity = int(vals.get("data_sens") or 5) # 1=public, 5=PII / proprietary IP

    # Composite risk index (1 - 100)
    risk_score = (
        (domain_criticality * 6.0) +
        ((6 - hallucination_tolerance) * 5.0) +
        (regulatory_exposure * 5.0) +
        (data_sensitivity * 4.0)
    )

    if risk_score > 75:
        category = "HIGH RISK / Enterprise Red Flag (Comprehensive Human-in-the-Loop Required)"
    elif risk_score > 45:
        category = "MODERATE RISK (Guardrails & Automated Testing Mandated)"
    else:
        category = "LOW RISK (Fast-Track Automated Rollout Permitted)"

    return {
        "status": "ok",
        "composite_risk_score": f"{risk_score:.0f} / 100",
        "risk_classification": category,
        "domain_liability_factor": f"{domain_criticality * 20}%",
        "compliance_audit_exposure": f"{regulatory_exposure * 20}%",
        "recommended_guardrails": "Mandatory Air-Gapped LLM, PII Masking, and Strict Red-Teaming" if risk_score > 60 else "Standard Rate Limiting and Content Moderation Filters",
    }

register_calculator(
    "ai-implementation-risk-score-calculator",
    "AI Project Risk & Hallucination Exposure Assessment Score",
    "ai_helper",
    "Quantify business liability, regulatory exposure (EU AI Act, HIPAA), and hallucination risk across enterprise LLM deployments.",
    fields=[
        CalcField("domain", "Domain Criticality (1=Creative, 5=Legal / Healthcare / Banking)", type="number", default=4, min=1, max=5),
        CalcField("tolerance", "Hallucination Tolerance (1=Zero Tolerance, 5=High Creative)", type="number", default=2, min=1, max=5),
        CalcField("regulatory", "Regulatory Exposure (1=None, 5=Heavy PII / HIPAA / GDPR)", type="number", default=4, min=1, max=5),
        CalcField("data_sens", "Proprietary Data Sensitivity (1=Public, 5=Core IP / Customer PII)", type="number", default=5, min=1, max=5),
    ],
    fn=_ai_implementation_risk_score_calculator,
)

# 50. AI Vendor Lock-in Risk Calculator
def _ai_vendor_lock_in_risk_calculator(vals: dict) -> dict:
    proprietary_features = int(vals.get("features") or 4) # Structured Outputs, Assistants API, Fine-Tuning
    codebase_tightness = int(vals.get("tightness") or 3) # SDK directly imported vs abstracted gateway
    data_portability = int(vals.get("portability") or 2) # System prompt complexity & few-shot tuning
    estimated_migration_hours = int(vals.get("migration_hours") or 240)
    dev_hourly_rate = float(vals.get("dev_rate") or 90.0)

    switching_engineering_cost = estimated_migration_hours * dev_hourly_rate
    lock_in_score = (proprietary_features * 6.0) + (codebase_tightness * 8.0) + ((6 - data_portability) * 6.0)

    return {
        "status": "ok",
        "vendor_lock_in_score": f"{min(100.0, lock_in_score):.0f} / 100",
        "lock_in_severity": "Severe Lock-in (High Switching Friction)" if lock_in_score > 65 else ("Moderate Portability" if lock_in_score > 35 else "Decoupled & Vendor Agnostic"),
        "estimated_switching_capital_cost": f"${switching_engineering_cost:,.2f} ({estimated_migration_hours} engineering hours)",
        "recommendation": "Adopt LiteLLM / OmniRoute or OpenRouter proxy abstraction to eliminate provider SDK dependencies.",
    }

register_calculator(
    "ai-vendor-lock-in-risk-calculator",
    "AI Vendor Lock-in Risk & Switching Cost Calculator",
    "ai_helper",
    "Evaluate dependency on proprietary model features (OpenAI Assistants, Anthropic Artifacts) and estimate migration engineering capital.",
    fields=[
        CalcField("features", "Proprietary Feature Usage (1=Standard Chat, 5=Deep Assistants API)", type="number", default=4, min=1, max=5),
        CalcField("tightness", "SDK Coupling (1=OpenAI-Compatible Proxy, 5=Vendor SDK Hardcoded)", type="number", default=3, min=1, max=5),
        CalcField("portability", "Prompt Portability (1=Universal Standard, 5=Hyper-Tuned to Single Model)", type="number", default=2, min=1, max=5),
        CalcField("migration_hours", "Estimated Engineering Hours to Refactor", type="number", default=240, min=20, max=5000),
        CalcField("dev_rate", "Senior Developer Rate ($/hr)", type="number", default=90.0, min=25.0, max=300.0),
    ],
    fn=_ai_vendor_lock_in_risk_calculator,
)
