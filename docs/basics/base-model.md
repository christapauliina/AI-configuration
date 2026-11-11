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

### Choosing transformers
When we think of an LLM, the first association is usually some kind of chatbot or AI assistant, such as ChatGPT or Gemini. Despite strong associations, not all LLMs are built strictly for chatting with users. You can also use an LLM for tasks like text classification, code generation, or text summarization.

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

Regarding the overall architecture of a model, we must define its depth and width, which determine the model's overall size. Width defines the size of the vector used to represent a token inside the model. The wider the vector, the more meanings and nuances can be encoded for an individual token, leading to a more nuanced understanding by the model. Depht is simply a representation of how many transformers is stacked on top of eachother. The more depth the model have, the more complex chain of reasoning model will be able to do.

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
  + **Informational density** Content with reasoning and substance vs. low value text
  + **Safety** Leaving out unaccurate and toxic material and filtering personal identifiable information

When the frontier models are growing to larger scale, there is somewhat an issue of availability of enough quality training data. Therefore in some models part of the training data is synthetic data, which is AI generated high quality text and reasoning. 

## Tokenization
Before feeding the training data to a model, the data must be transformed into a form that a machine can understand. In a wild simplification, the raw training data is first broken down into a sequence of symbols known as tokens, assigned a numerical ID for each token, and used to create a vocabulary for the model. Regarding tokenization, there are two main things to consider — what size the tokens are and how many will fit into the model's vocabulary. Both play a big part in the model's performance and are tightly coupled to each other.

### Tokenizer
A tokenizer is a tool used to convert raw text into smaller sequences (tokens) and creating a vocabulary for the model from those tokens. In natural language processing, the main types of tokenization are word-level, character-level, and subword-level. The smaller the unit, the more memory and computation the model needs to process inputs. 

#### Character-level tokenization
In character-level tokenization, the input sequence length increases, causing the context window to fill more rapidly and making the model quite compute-heavy to run. On the other hand, character-level tokenization significantly decreases the model's vocabulary size, as there are far fewer unique characters than words. Morphologically rich and low-resource languages can take advantage of character-level tokenization because it captures the internal structure of the language effectively. The main issue is that individual characters do not carry semantic meaning like words do. Character-level tokenization makes it harder for the model to achieve a deep understanding of meaning and can perform poorly on tasks that demand complex reasoning.
#### Word-level tokenization
Tokenization that splits raw text into words based on whitespace or punctuation is called word-level tokenization. As words carry semantic meaning, models based on word-level tokenization grasp meanings more effectively and perform better in complex reasoning. The main issues are, firstly, that with word-level tokenization the vocabulary size increases substantially, increasing the model size and therefore making training and running the model expensive. Secondly, pure word-based models suffer from the OOV (Out-Of-Vocabulary) problem, where new words, inflections, and compound forms cannot be recognized if they are not included in the model's vocabulary. Even a wrong or different spelling of a word can confuse the model. Word-based vocabulary is especially unfit for morphologically rich or low-resource languages
#### Subword-level tokenization
In modern models, a solution has been found in between word-level and character-level tokenization as they use sub-word tokenization. As a core principle of sub-word tokenization, frequently used words remain intact in the vocabulary, while rarer words are broken into smaller sequences. For example, the verb "use" could be a token itself, but reuse could be broken into two tokens: "re" and "use". There are many different options for algorithms that do sub-word tokenization, but most of them have characters (or bytes for special characters) included by default, which eliminates the OOV problem. Since there is always a possibility to break a word into smaller components, there is no situation where an unknown word could appear. 

Sub-word tokenization combines the best qualities of word-level and character-level tokenization. Models that are based on sub-word tokenization are able to understand meaning efficiently, perform well at complex reasoning, and are also suited for morphologically rich or low-resource languages. Sub-word tokenization allows keeping the vocabulary size moderate, which makes training and running the model more cost-efficient.

#### Vocabulary Size Trade-offs
Vocabulary size is directly coupled with the tokenization strategy. In most subword tokenization algorithms, the target vocabulary size must be defined before building the tokenizer. Choosing size of vocabulary is a direct trade-off between model efficiency and input efficiency, and it should always be balanced against the overall width and depth of the model.

A vocabulary that is too large in relation to the model's dimensions reserves big a part of memory just to store the model's "knowledge", which takes away from the actual "thinking" process and reduces overall performance. Too small a vocabulary creates the same kind of negative effects as character-level tokenization. Finding the right size is a balancing act between the model's performance and computational efficiency. The vocabulary can be aggregated from the training data, parts of training data, or from a separately aggregated vocabulary.

## Pre-training

Pre-training is a computationally expensive process, and designing a base model typically starts by creating a compute budget. The required compute is measured in FLOPs (Floating Point Operations), which quantify the total amount of computation. As a rule of thumb, the FLOPs required to train a model is:

***Amount of Computation, C (FLOPs) ≈ 6 · N · D***

where N is the parameter count and D is the number of tokens in the training data. The equation is a simplification, and the ratio 6 can be different in a few different situations but it holds quite well for standard architectures.

In reality, hardware cannot run at its theoretical peak capacity because training is limited by VRAM memory bandwidth, communication latency, and GPU idling. Therefore, training pipelines are evaluated using MFU (Model FLOPs Utilization), which is the ratio of actual model throughput to theoretical peak hardware FLOPS, where FLOPS (with a capital S) is Floating Point Operations per second, a measurement of computational efficiency of the GPU. MFU typically floats between 35% and 45%, depending on the optimization of the code, I/O operations, and networks. The best pipelines reach 50% to 60% utilization, and an MFU under 30% is regarded as low. If you have an MFU of 50%, you need to provision twice as much compute capacity relative to the required FLOPs.

## Context Window & Data Packing

Before starting the pre-training, the model's context window size must be decided and the training data needs to be packed accordingly. The size of the context window defines how much the model can "see" at once. A longer context window allows the model to consider longer inputs when producing outputs, which is especially beneficial for tasks that need to process long texts for coherent outputs, such as summarizing or analyzing long texts, or having long conversations with the model.

However, doubling the context window quadruples the compute required for processing the sequence. With long context windows (> 8k), sequence processing starts consuming a large share of total compute, increasing the FLOPs needed for training the model beyond 6ND. At the extremes, really long and really short context windows decrease the MFU and need more complex maneuvers in pre-training in order to keep training efficient and costs moderate.

## Wrap-up

As a final thought, each decision on building a base model must be viewed as part of a whole rather than in isolation. For most use cases below the frontier, performance targets can largely be met simply by scaling up model size. In practice financial constraints make this a non-option for many builders — which is exactly why architectural choices and training efficiency matter. Furthermore, as technology advances and collective knowledge grows, training base models will likely become somewhat cheaper. I personally believe this will lead to a broader rollout of domain-specific base models across various industries. 

## Deeper reads:

https://arxiv.org/pdf/2001.08361
https://arxiv.org/pdf/2308.09884
