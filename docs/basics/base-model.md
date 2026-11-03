# Base model

Building an AI model from scratch starts by creating a base model. A base model understands the structure of language and holds vast knowledge, but it lacks useful skills for intended use and needs follow-up measures to be able to provide practical value for its end user. For example, if you are building a chat model, its base model's sole ability is to predict the next word, not to have a conversation. 

In this section, we will explore what goes into creating a base model: what kind of decisions we can or must make, keeping the purpose of the final model in mind. A big part of decision-making is related to costs: training a base model is the most expensive part of creating a modern LLM, and many of these choices also directly affect the future operational expenses of the model.

This is not a deep dive into neural networks or core LLM principles. It is simply a demonstrative look at different engineering tactics in base model creation that affect the final model outcome.

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
When we think of an LLM, the first association is usually some kind of chatbot or AI assistant, such as ChatGPT or Gemini. Despite strong associations, not all LLMs are built strictly for chatting with users. You can also use an LLM for tasks like text classification, code generation, or text summarization, although different tasks may need a different kind of engine.

The engine of every modern LLM is an architecture called the Transformer. Transformers process sequences of tokens and create an output sequence through layers of decoder and/or encoder blocks. Encoder and decoder have similarities: both include positional encoding, residual connections, layer norms, and a feed-forward network. 

The difference is that the encoder has something called “Bidirectional Self-Attention”, where tokens evaluate themselves and all the tokens before and after. The decoder has a causal mask, so it can only view the token in evaluation and tokens before that, limiting its view to the present and past. Encoder's abilities lie in understanding the input sequence and its context, whereas decoders are good at regenerating text in natural language. Without getting too deep into theory, let's review some practical applications:

  ### Encoder-Decoder-Style Transformers
The origin of transformers, created for translating languages into other languages. The encoder reads the input sequence and understands it. The decoder writes the output based on what the encoder understood and what it has produced itself. Although originally designed for translation, this architecture is ideally suited for any task that requires transforming one type of sequence into another:

  + Text summarization
  + Data-to-text generation
  + Machine translation  

Given the Encoder-Decoder-style transformer's ability to *transform* inputs to outputs, its utility reaches beyond natural language processing. For example, this kind of architecture has been used successfully in studies where it was applied to process sequential time-series data and predict remaining useful life (RUL) in industrial equipment.

  ### Encoder-Only Transformers
Encoder-Only transformers can't generate text; instead, they produce vectors as an output. Encoder-Only architecture is used in various tasks, for example:

  + Text classification tasks (spam detection, language identification, sentiment analysis...)
    + Needs a task-specific head, which generates the output for the user based on the encoder's output vector.
  + Semantic search (RAG solutions)
    + Does not need a task-specific head; the output vector (embedding) is the final product.
  
  ### Decoder-Only Transformers
Decoder-only transformers are the core of all modern AI assistants and chatbots. Its main capability is to predict the next token (word) and generate text by adding the produced token to the input sequence and predicting the next token. The decoder-only architecture rules the AI world due to its versatility and ability to handle a wide variety of tasks.


### Defining the dimensions




## Training data
## Tokenization
## Pre-training
## Summary



  https://arxiv.org/pdf/2308.09884
