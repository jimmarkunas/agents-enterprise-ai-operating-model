# A.G.E.N.T.S. Enterprise Model Repository Contract

This repository is a reference and documentation root for the A.G.E.N.T.S. enterprise AI operating model.

- Keep documentation and template changes scoped to this repository.
- Do not treat this repository as an application runtime or API implementation root.
- Preserve the supplied PDF, DOCX, template kit, and branding assets unless explicitly named.
- Do not invent adoption claims, customer facts, metrics, or endorsements.
- Before mutating, confirm the current branch and working-tree status.

## Task Boundary

This repository is the sole mutation root for A.G.E.N.T.S. Enterprise Model documentation/framework work assigned here. Every task has exactly one mutation root. Supporting repositories may be read only when explicitly needed. No repository outside this mutation root may be modified unless Jim explicitly authorizes that exact cross-repository scope. LIFE OS, portfolio, and archive repositories are never mutation targets for work routed here unless Jim explicitly authorizes otherwise. MCP/tool availability never overrides repository routing or mutation-root rules.

Before mutation, the agent must:

1. identify the repository;
2. confirm this mutation root;
3. read `AGENTS.md` and `CLAUDE.md`;
4. confirm the current branch and working-tree status;
5. state the intended files to change and the proof commands/checks to run.

If task context, stale instructions, an MCP, an IDE, or another agent points mutation at the wrong repository, stop with exactly:

`WRONG_REPOSITORY_STOP`

Make only the smallest change needed for the requested outcome. No broad cleanup, unrelated refactors, architecture expansion, dependency churn, or opportunistic modernization. Run the repository's documented proof/acceptance checks appropriate to the change. Stop when the requested proof is complete; do not continue into adjacent work without Jim's instruction.
