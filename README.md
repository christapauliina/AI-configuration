# AI Configuration

A comprehensive technical guide and reference for large language model development, combining theoretical foundations with practical, code-level configuration patterns.

This repository hosts the source documentation and VitePress site published at:  
[AI Configuration Documentation](https://christapauliina.github.io/AI-configuration/)

Accompanying C# / .NET 10 runnable code examples:  
[AI Configuration Examples (.NET 10)](https://github.com/christapauliina/ai-configuration-examples)
---

## Purpose and Scope

Most applications do not train machine learning models from scratch. Instead, developers consume pre-trained foundation models and adapt them to specific problem domains through configuration layers. These range from prompt engineering and inference parameter tuning to runtime tool calling, external Model Context Protocol (MCP) servers, and multi-agent systems.

The objective of this project is to bridge the gap between high-level conceptual explanations and low-level source code. It is structured into two main sections:

1. **AI Fundamentals**: Theoretical grounding on how foundation models are constructed, pre-trained, and aligned. This section establishes the mechanical intuition for why models respond to downstream configurations the way they do.
2. **AI Configuration**: Hands-on examination of configuration layers, paired with practical code demonstrations, token consumption analysis, and architectural trade-offs.

---

## Content Structure

### 1. AI Fundamentals (`/llm-foundations/`)
A grounded technical look into the underlying architecture of modern LLMs, avoiding unnecessary mathematical density while maintaining engineering precision:

* **Base Model Architecture**: Core transformer mechanisms, self-attention, and scaling fundamentals.
* **Training Data**: Dataset composition, filtering, deduplication, and quality thresholds.
* **Tokenization**: Subword tokenization algorithms, vocabulary constraints, and structural implications.
* **Pre-training**: Next-token prediction, loss surfaces, compute budgets, and emergent abilities.
* **Aligned Model** *(In progress)*: Instruction tuning, SFT, and preference optimization (RLHF / DPO).
* **Future Directions** *(In progress)*: Architecture trends and emerging inference paradigms.

### 2. AI Configuration (`/llm-configuration/`)
Detailed breakdowns of configuration patterns paired with execution traces, real-world metrics, and source code implementations:

* **Model - Memory**: Managing multi-turn state via explicit conversation histories and context window pruning.
* **Model - System Prompts**: Defining agent roles, behavioral steering, and prompt boundary enforcement.
* **Model - Parameters**: Determinism vs variance control (`Temperature`, `TopP`, `MaxOutputTokens`) and reasoning effort handling.
* **Agent - Local Tools**: Exposing local function calls via schema extraction and runtime invocation middleware.
* **Agent - MCP (Model Context Protocol)**: Integrating external tool providers over stdio, comparing token footprints of general-purpose vs targeted custom MCP servers.
* **Advanced - Multi-Agent Orchestration**: Coordinating autonomous agents in hierarchical research, analysis, and generation pipelines.
* **Advanced - RAG** *(In progress)*
* **Advanced - Fine-Tuning** *(In progress)*
* **Frameworks & Use Cases** *(In progress)*

---

## Local Development

The documentation is built with [VitePress](https://vitepress.dev/).

### Prerequisites
* Node.js 18+ or 20+
* npm
