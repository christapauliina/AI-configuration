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
