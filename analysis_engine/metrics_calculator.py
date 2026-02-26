"""
Metrics Calculator — Generates standard confidence scores and risk metrics.
"""

from typing import Dict, Any

def calculate_confidence_score(report: Dict[str, Any]) -> int:
    """
    Computes a base confidence score (0-100) based on perceived risk level
    and the quantity of issues reported.
    """
    risk_level = report.get("risk_level", "Unknown")
    issues = report.get("issues", [])
    
    base_score = 100
    
    if risk_level == "Critical":
        base_score -= 50
    elif risk_level == "High":
        base_score -= 30
    elif risk_level == "Medium":
        base_score -= 15
    elif risk_level == "Low":
        # Even low risk issues impact confidence slightly if there are many
        base_score -= min(len(issues) * 2, 10)
    else:
        # Unknown risk level gets a severe penalty
        base_score -= 20
        
    return max(0, base_score)

def calculate_metrics(parsed_report: Dict[str, Any]) -> Dict[str, Any]:
    """
    Standardize metrics derived from an LLM report.
    """
    confidence_score = calculate_confidence_score(parsed_report)
    
    issues_by_type = {}
    for issue in parsed_report.get("issues", []):
        issue_type = issue.get("type", "General")
        issues_by_type[issue_type] = issues_by_type.get(issue_type, 0) + 1
        
    metrics = {
        "confidence_score": confidence_score,
        "risk_level": parsed_report.get("risk_level", "Unknown"),
        "total_issues": len(parsed_report.get("issues", [])),
        "issues_by_type": issues_by_type,
    }
    
    return metrics
