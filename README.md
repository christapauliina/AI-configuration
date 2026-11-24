# AI Configuration

A practical guide to configuring LLMs and agents: what happens inside a foundation model, and how prompts, parameters, tools, MCP servers and multi-agent setups change its behaviour and its token cost. Every configuration chapter is backed by a runnable C# demo and measured with real token counts.

**Read it:** [christapauliina.github.io/AI-configuration](https://christapauliina.github.io/AI-configuration/llm-configuration/)
**Run the demos:** [ai-configuration-examples](https://github.com/christapauliina/ai-configuration-examples) (C# / .NET 10, `Microsoft.Extensions.AI`)

---

## Key findings

All numbers come from the demo applications in the examples repo (GPT-5.2 on Microsoft Foundry). They are single runs meant to illustrate a principle, not benchmarks.

| Finding | Evidence |
|---|---|
| Higher reasoning effort is not automatically better | Same prompt: 601 reasoning tokens (low) vs 5,755 (high), roughly 10x the cost, and the high-effort result was weaker in this test. → [Parameters](https://christapauliina.github.io/AI-configuration/llm-configuration/configurations/03.model-parameters) |
| A general-purpose MCP server has a large fixed cost | Power BI Modeling MCP: a plain greeting used 12,631 tokens, one question with six tool calls used 95,544. → [MCP](https://christapauliina.github.io/AI-configuration/llm-configuration/configurations/05.agent-mcp) |
| MCP itself does not save tokens, a small toolset does | The same tools exposed locally or via MCP send identical JSON schemas. A focused two-tool server kept the greeting at 87 tokens (not directly comparable, different task). → [MCP](https://christapauliina.github.io/AI-configuration/llm-configuration/configurations/05.agent-mcp) |
| A system prompt is not a security boundary | The demo shows a working prompt injection against a topic-restricted assistant. → [System prompt](https://christapauliina.github.io/AI-configuration/llm-configuration/configurations/02.model-systemprompt) |
| Splitting agents keeps context clean | The research agent's ~18,400 tokens stayed out of the analyst's context because it is wrapped as a tool. → [Orchestration](https://christapauliina.github.io/AI-configuration/llm-configuration/configurations/06.advanced-orchestration) |

---

## What's inside

### 1. AI Fundamentals — `/llm-foundations/`
How base models are built, explained between "superficial summary" and "academic paper". Simplifications are flagged where they happen.

- Architecture (encoder / decoder / encoder-decoder, model dimensions)
- Training data (quantity vs quality, Chinchilla, over-training)
- Tokenization (character / word / subword, vocabulary trade-offs)
- Pre-training (compute budget, data packing, optimizer, learning rate, precision, gradient clipping)
- Aligned model, future directions — *in progress*

### 2. AI Configuration — `/llm-configuration/`
Each chapter pairs a short knowledge base with screenshots from a demo app.

| Chapter | Demo projects |
|---|---|
| 01 Model — Memory | 01, 02 |
| 02 Model — System prompt | 03 |
| 03 Model — Parameters | 04, 05 |
| 04 Agent — Tools | 06, 07 |
| 05 Agent — MCP | 08, 09, 10 |
| 06 Advanced — Multi-agent orchestration | 11 |
| 07 RAG, 08 Fine-tuning, Frameworks, Use cases | *in progress* |

---

## Status

Published and usable: chapters 01–06 and the base-model foundations. Work in progress: RAG, fine-tuning, aligned models, parts of the pre-training chapter (batching, training loop), frameworks and use cases. Unfinished sections are marked on the site.

---

## Run the docs locally

Requires Node.js 20+ and npm.

```bash
git clone https://github.com/christapauliina/AI-configuration.git
cd AI-configuration
npm ci
npm run docs:dev      # dev server with hot reload
npm run docs:build    # production build into docs/.vitepress/dist
npm run docs:preview  # preview the production build
```

The site is built with [VitePress](https://vitepress.dev/) and deployed to GitHub Pages by GitHub Actions on every push to `main`.

---

## Feedback

Spotted an error or have a suggestion? Open an [issue](https://github.com/christapauliina/AI-configuration/issues).


