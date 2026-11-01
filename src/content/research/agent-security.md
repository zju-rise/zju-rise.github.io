---
purpose: "Research overview, topics, and system-level perspective for agent security."
maintain: "Edit overview, topics, pipeline, and perspective to update the Research page. Link papers using the agent-security direction ID."
sample: false
draft: false
placeholder: false
title: "Agent Security"
order: 0
overview: >-
  Agent security focuses on protecting AI systems that reason, use tools, and
  collaborate to complete tasks. Key questions concern how untrusted inputs
  influence decisions, how permissions constrain actions, and how failures
  propagate across tools, memory, and multiple agents.
topics:
  - "Prompt injection and instruction integrity: protecting agent behavior against malicious instructions embedded in retrieved content, messages, and tool outputs."
  - "Tool-use and execution security: constraining permissions, validating actions, and protecting sensitive data during interactions with external services."
  - "Memory and multi-agent security: examining memory poisoning, information leakage, and the propagation of compromised messages between agents."
  - "Security evaluation and defenses: developing threat models, realistic attack scenarios, and assessments of defense effectiveness under adversarial conditions."
pipeline: >-
  Instructions → Planning → Tool use → Memory → Collaboration.
  Each stage introduces trust boundaries between the agent, external information,
  and the systems available for action.
perspective: >-
  System-level analysis connects model behavior with permissions, data access,
  and execution outcomes. The goal is reliable task completion within explicit
  security boundaries, even in the presence of adversarial inputs.
---
