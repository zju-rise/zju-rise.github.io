---
purpose: "Editable research entry for the RISE website."
maintain: "Edit fields below; see docs/maintenance.md for examples."
sample: true
draft: false
title: "Agent Security"
order: 0
overview: "AI agents increasingly retrieve information, execute code, use external tools, and collaborate with other agents. These capabilities create new trust boundaries: an instruction hidden in a document or a compromised tool response can influence decisions far beyond the original input. We investigate how such attacks propagate through agent workflows and how systems can detect, contain, and recover from them."
topics: ["Prompt injection and untrusted instructions: identifying how external content crosses trust boundaries and changes an agent’s goals, decisions, or tool calls.", "Secure tool use and autonomous workflows: evaluating permissions, sensitive information exposure, and the consequences of executing actions on a user’s behalf.", "Multi-agent collaboration: studying communication channels, delegated tasks, and the spread of malicious behavior between cooperating agents."]
pipeline: "Instructions → Reasoning → Tools"
perspective: "We evaluate the complete workflow, from retrieved content to external actions. Our goal is to understand where trust is assumed, where it breaks, and which safeguards remain effective in realistic tasks."
---


