---
description: OpenCode Go fallback for the backend role. Use only when the free DeepSeek model is unavailable, rate limited, or out of quota.
mode: subagent
model: opencode-go/deepseek-v4.1-flash
permissions:
  - action: subagent
    resource: "*"
    effect: deny
---

# Backend Engineer (Go fallback)

You are the OpenCode Go fallback for the `backend` role. This file changes only your model. Before any work, read `.opencode/agents/backend.md` and follow its role, ownership, standards, and verification exactly. The task brief from the orchestrator supplements that file; the repository `AGENTS.md` files and the role file win on conflicts.
