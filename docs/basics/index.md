# AI BASICS

Broadly, we tend to think that you simply gather training data, feed it through a neural network, and *voila* you have an LLM. There is an underlying assumption that a bigger dataset and a larger neural network automatically result in a more capable and intelligent model. The reality is far more complex.


## Introduction

In most use cases, we don't actually build AI models ourselves; instead, we use already published models and configure them to best fulfill our needs. In this section, we take a slightly more in-depth look under the hood of these published models. While this section isn't strictly mandatory for configuring your LLM models or agents, understanding these core concepts will help you grasp why and how specific techniques work in practice.

## Contents

At its simplest, creating a publish-ready AI model includes three main stages: creating a base model, teaching the base model how to behave to get an aligned model, and optionally using advanced technologies to enhance the model's capabilities. Each stage has its own section, where we go through the main concepts and technologies.

### 1. Base Model
- Architecture, Tokenization, Pre-training, Compute

### 2. Aligned Model
- Supervised fine-tuning (SFT), Reward modeling, RLHF, DPO, RLVR

### 3. Advanced Technologies & Glimpse to the Future
- Specialization, Model combination, MoE (Mixture of Experts), Future trends
