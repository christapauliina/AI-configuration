# Base model

Building an AI model from scratch starts by creating a base model. A base model understands the structure of language and holds vast knowledge, but it lacks useful skills for intended use and needs follow-up measures to be able to provide practical value for its end user. For example, if you are building a chat model, its base model's sole ability is to predict the next word, not to have a conversation. 

In this section, we will explore what goes into creating a base model: what kind of decisions we can or must make, keeping the purpose of the final model in mind. A big part of decision-making is related to costs: training a base model is the most expensive part of creating a modern LLM, and many of these choices also directly affect the future operational expenses of the model.

This is not a deep dive into neural networks or transformes. It is simply a demonstrative look at different engineering tactics in base model creation that affect the final model outcome, so there will be some simplifycations pointed in the deeper tecnhical aspects.

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

  #### Encoder-Decoder-Style Transformers
The origin of transformers, created for translating languages into other languages. The encoder reads the input sequence and understands it. The decoder writes the output based on what the encoder understood and what it has produced itself. Although originally designed for translation, this architecture is ideally suited for any task that requires transforming one type of sequence into another:

  + Text summarization
  + Data-to-text generation
  + Machine translation  

Given the Encoder-Decoder-style transformer's ability to *transform* inputs to outputs, its utility reaches beyond natural language processing. For example, this kind of architecture has been used successfully in studies where it was applied to process sequential time-series data and predict remaining useful life (RUL) in industrial equipment.

  #### Encoder-Only Transformers
Encoder-Only transformers can't generate text; instead, they produce vectors as an output. Encoder-Only architecture is used in various tasks, for example:

  + Text classification tasks (spam detection, language identification, sentiment analysis...)
    + Needs a task-specific head, which generates the output for the user based on the encoder's output vector.
  + Semantic search (RAG solutions)
    + Does not need a task-specific head; the output vector (embedding) is the final product.
  
  #### Decoder-Only Transformers
Decoder-only transformers are the core of all modern AI assistants and chatbots. Its main capability is to predict the next token (word) and generate text by adding the produced token to the input sequence and predicting the next token. The decoder-only architecture rules the AI world due to its versatility and ability to handle a wide variety of tasks.

### Defining the dimensions

Regarding the overall architecture of a model, we must define its depth and width, which determine the model's overall size. Width defines the size of the vector used to represent a token inside the model. The wider the vector, the more meanings and nuances can be encoded for an individual token, leading to a more nuanced understanding by the model. 

Depht is simply a represation of how many transformers is stacked on top of eachother. The more depth the model have, the more complex chain of reasoning model will be able to do.

Altough depth and widht includes many interesting qualities and technical aspects, in 2020 Kaplan etc. showed that in view of a models performace the main factor is overall size, not the relationship between widht and depth, as long as dimensions are in reasonable relation to eachother. When referring to a model's size, the unit used is parameters. To keep this presentation demonstrative, we won't dive into the technical depths of why model size is calculated the way it is. However, since the size isn't simply depth x width and parameter quantity is widely used when describing models, I think it's worth taking a quick look at:

***Quantity of Parameters =  V · d<sub>model</sub> + 12 · L · d<sub>model</sub><sup>2</sup>***

In the equation above, ***V*** represents the model's vocabulary size, ***d<sub>model</sub>***  the width, and ***L***  the number of transformers, i.e., layers or depth. The presented equation is a simplified approximation of the model size (assuming a standard 4x FFN expansion), but sufficiently valid in this context as we don't go deeper into transformer architechture. When we want to scale a model to a better perfomance, we can increase the vocabulary, depth or widht (of course keeping the relations to each other reasonable). Worth to notice that scaling increases the costs of training and running, so usually the main question is "How large model i can afford to build" instead of "How large model should I build". 

## Training data

Training data is the data that we feed to a model in its pre-training phase. Through training data, a model learns the structure of language, gains factual knowledge, and captures the semantic relationships between words. If you want to build a multimodal model, which can generate other forms of answers (ect. pictures) or multilingual model, other types of content and languages should be present in training material. The quality and quantity of training data are major factors in a model's performance.

### Quantity
The quantity of training data should be in some relation to the model's size. In 2022, the Chinchilla research stated that in a training phase for a compute-optimal model, there should be approximately 20 tokens per one parameter in the model. Compute-optimal in this context refers to the training costs of a model. Of course there should be some sort of measures taken to optimize the training phase costs, but Chinchilla-way optimizing leads to a bigger models in effort to achieve desired performance. Big models are expensive to run and therefore nowadays, many of the models are "over-trained" in terms of having 100–200 tokens per parameter. "Over-training" allows the model to learn more deeply from the data with a smaller model, which increases the training costs, but decreases considerably the costs of running the model.

### Quality
In recent years, following major breakthroughs in understanding the relationship between training data size and model performance, the focus has been shifting toward training data quality.  "Garbage in, garbage out" - applies also to LLM:s. The vast majority of raw training data is scraped from internet by bots, most of which is unusable in its initial state. Raw data needs to be cleaned an de-duplicated. For example, datasets like Common Crawl—containing petabytes of raw HTML from the web—yield only 1% to 10% usable text depending on the filtering. We wont be diving deeper into the cleaning of raw data. 

When evaluating dataset quality, it can be viewed from several  perspectives:
  + **Diversity and balance** Training datas coverage across different domains, perspectives and language improves generalization and prevents bias
  + **Informational density** Content with reasing and substance vs. low value text
  + **Safety** Leaving out unaccurate and toxic material and filtering personal identifiable information

When the frontier models are growing to larger scale, there is somewhat an issue of availability of enough quality training data. Therefore in some models are part of the training data is synthetic data, which is AI generated high quality text and reasoning. 

## Tokenization

Before feeding the training data to a model, the data must be transformed into a form that a machine can understand. In a wild simplification, the raw training data is first broken down into a sequence of symbols known as tokens, after which all the tokens are fed to an algorithm that builds a token vocabulary for the model.

Regarding to tokenizing there is two main things to consider - what size the tokens are and how many we'll fit to models vocabulary. Both are 

## Pre-training
## Wrap-up

As a final thought, each decision on building a base model must be viewed as part of a whole rather than in isolation. For most use cases below the frontier, performance targets can largely be met simply by scaling up model size. In practice financial constraints make this a non-option for many builders — which is exactly why architectural choices and training efficiency matter. Furthermore, as technology advances and collective knowledge grows, training base models will likely become somewhat cheaper. I personally believe this will lead to a broader rollout of domain-specific base models across various industries. 

## Deeper reads:

https://arxiv.org/pdf/2001.08361
https://arxiv.org/pdf/2308.09884
