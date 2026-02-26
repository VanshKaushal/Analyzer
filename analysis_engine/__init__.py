"""
AI Analysis Engine — Handles LLM review logic, diff analysis and metric calculation.
"""

from .llm_reviewer import review_code_diff
from .metrics_calculator import calculate_metrics

__all__ = ["review_code_diff", "calculate_metrics"]
