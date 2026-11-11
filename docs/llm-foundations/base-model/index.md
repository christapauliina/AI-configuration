# Base model

Building an AI model from scratch starts by creating a base model. A base model understands the structure of language and holds vast knowledge, but it lacks useful skills for intended use and needs follow-up measures to be able to provide practical value for its end user. For example, if you are building a chat model, its base model's sole ability is to predict the next word, not to have a conversation.

In this section, we will explore what goes into creating a base model: what kind of decisions we can or must make, keeping the purpose of the final model in mind. A big part of decision-making is related to costs: training a base model is the most expensive part of creating a modern LLM, and many of these choices also directly affect the future operational expenses of the model.

This is not a deep dive into neural networks or transformes. It is simply a demonstrative look at different engineering tactics in base model creation that affect the final model outcome, so there will be some simplifycations pointed in the deeper tecnhical aspects.

## Table of Contents
### Architecture
### Training Data
### Tokenization
### Pre-training
### Summary
