# Architecture

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
