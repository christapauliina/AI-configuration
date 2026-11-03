# Base model

Building an AI chat model from scratch starts by creating a base model. A base model understands the structure of language and holds vast knowledge, but it lacks conversational skills. Its sole ability is to predict the next word. Though it is good at producing continuous text, it does not provide much practical value to an everyday user on its own. 

In this section, we will explore what goes into creating a base model: what kind of decisions we can or must make, keeping the purpose of the final model in mind. A big part of decision-making is related to costs: training a base model is the most expensive part of creating a modern LLM, and many of these choices also directly affect the future operational expenses of the model.

This is not a deep dive into neural networks or core LLM principles. It is simply a demonstrative look at different engineering tactics in basemodel creation that affect the final model outcome.

### Table of Contents
  - [Architecture](#Architecture)
  - [Training Data](#Training-data)
  - [Tokenization](#Tokenization)
  - [Pre-training](#Pre-training)
  - [Summary](#Summary)

## Architecture

### Setting the Boundaries
Before diving into architectural options and choices, it is crucial to define the goals, budget, and constraints for your base model. Defining the exact purpose of the final product will heavily impact the decisions made during the building stage. Training and running a base model comes with a monetary cost, but it also takes a toll on our natural resources. There is no need to overdo capabilities: doing so will likely stretch or completely overdo your budget. 

Clearly define your expected tasks, task priorities (such as speed, accuracy, and cost), and the resources allocated for both training the base model and running the final product. 

### Choosing the Engine
When we think of an LLM, the first association is usually some kind of chatbot or AI assistant, such as ChatGPT or Gemini. That said, not all LLMs are built strictly for chatting with users. You can also train an LLM for tasks like text classification, code generation, or text summarization. 

At the core of every modern LLM lies a neural network architecture called the Transformer. Instead of processing text one word or token at a time, the transformer is capable of evaluating the dependencies and semantics of all words in an input text/sequence simultaneously. Transformers enable modern models to "understand" and produce natural language. However, while every LLM uses a Transformer, not every LLM uses the exact same type of Transformer. 

There

  ### Encoder-Decoder-style Transformers
The origin of transformers. Encoder reads the input sequence and understands it. Decoder writes the output based on what decoder understood and what itself have produced. Although originally designed for translation, this architecture is ideally suited for any task that requires transforming one type of sequence into another:

  + Text summarization
  + Data to text generation
  + Machine translation  

Given the Encoder-Decoder-style transformers ability to *transform* inputs to outputs, its utility reaches beyond natural language processing. For example this kind of architechture has been used successfully in study where it was applied to process sequential time-series data and predict remaining useful life (RUL) in industrial equipment.

  ### Encoder-Only Transformers
Encoder-Only transformer can't generate text, instead it produces vectors as an output. Encoder-Only transformer usually needs a task-specific head, which generates the output for user based on encoders output vector. Encoder-Only -architechture is used in various tasks, for example
  + Semantic search (RAG-solutions)
  + Text classification (spam detecting, language identification, sentimental analysis)
  
  ### Decoder-style Transformers

Decorer-Only Transformes are the core of all modern AI-assintants and chatbots. 

### Defining the dimensions




## Training data
## Tokenization
## Pre-training
## Summary



  https://arxiv.org/pdf/2308.09884
