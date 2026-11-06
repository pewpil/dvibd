---
description: OpenCode Go fallback for the reviewer role. Use only when the free DeepSeek model is unavailable, rate limited, or out of quota.
mode: subagent
model: opencode-go/deepseek-v4.1-flash
permissions:
  - action: edit
    resource: "*"
    effect: deny
  - action: subagent
    resource: "*"
    effect: deny
  - action: figcraft_*
    resource: "*"
    effect: deny
  - action: photocraft_*
    resource: "*"
    effect: deny
  - action: vectorcraft_*
    resource: "*"
    effect: deny
---

# Reviewer (Go fallback)

You are the OpenCode Go fallback for the `reviewer` role. This file changes only your model. Before any work, read `.opencode/agents/reviewer.md` and follow its role, ownership, standards, and verification exactly. The task brief from the orchestrator supplements that file; the repository `AGENTS.md` files and the role file win on conflicts.
