# Pre-training



### Amount of Computation needed

Pre-training is a computationally expensive process, and designing a base model typically starts by creating a compute budget. The required compute is measured in FLOPs (Floating Point Operations), which quantify the total amount of computation. As a rule of thumb, the FLOPs required to train a model is:

***Amount of Computation, C (FLOPs) ≈ 6 · N · D***

where N is the parameter count and D is the number of tokens in the training data. The equation is a simplification, and the ratio 6 can be different in a few different situations but it holds quite well for standard architectures.

In reality, hardware cannot run at its theoretical peak capacity because training is limited by VRAM memory bandwidth, communication latency, and GPU idling. Therefore, training pipelines are evaluated using MFU (Model FLOPs Utilization), which is the ratio of actual model throughput to theoretical peak hardware FLOPS, where FLOPS (with a capital S) is Floating Point Operations per second, a measurement of computational efficiency of the GPU. MFU typically floats between 35% and 45%, depending on the optimization of the code, I/O operations, and networks. The best pipelines reach 50% to 60% utilization, and an MFU under 30% is regarded as low. If you have an MFU of 50%, you need to provision twice as much compute capacity relative to the required FLOPs.

### Defining Context Window Lenght
Before starting the pre-training, the model's context window size must be decided and the training data needs to be packed accordingly. The size of the context window defines how much the model can "see" at once. A longer context window allows the model to consider longer inputs when producing outputs, which is especially beneficial for tasks that need to process long texts for coherent outputs, such as summarizing or analyzing long texts, or having long conversations with the model.

However, doubling the context window quadruples the compute required for processing the sequence. With long context windows (> 8k), sequence processing starts consuming a large share of total compute, increasing the FLOPs needed for training the model beyond 6ND. At the extremes, really long and really short context windows decrease the MFU and need more complex maneuvers in pre-training in order to keep training efficient and costs moderate.

### Data Packing
When the size of the context window is decided, the training data is packed into sequences sized to that context window, as the model can only process inputs of that specific length at once. There are a few options for how this data packing is done, considering that documents and individual texts in the training dataset are rarely the exact size of the context window.

The most common approach is sequence packing, where multiple documents and texts are concatenated into a continuous stream of tokens, which is then sliced into chunks that match the context window size. In sequence packing, you have to clearly differentiate the documents from each other to avoid context contamination. In context contamination, the model assumes that the contents of two different documents are related, simply because they are in the same input sequence.

Differentiating two documents can be done by using an attention mask, where the model cannot see more than one document at a time although they are in the same input sequence, or by simply inserting an end-of-text token between documents. With end-of-text tokens, the model can still 'see' both documents, but learns to differentiate them from each other as training progresses. Segment attention with an attention mask creates a better outcome, but is more complex to implement. There is always the option of padding, where one document is placed in one input sequence and any remaining positions are filled with empty tokens. Padding is computationally a quite inefficient option, and it is rarely used.

### Hyperparameters and Learning Strategy
<br>
<Expand info="This chapter abstracts away much of the underlying neural network theory and linear algebra to keep the focus on the key consepts. Optional term explanations are provided for readers who want a bit more depth. – you can skip them if you prefer the high-level view.">Note: </Expand>
<br>

Unlike in traditional machine learning, overfitting and underfitting don't play the same role when training an LLM. Training is stopped when further improvements are no longer worth the computational cost, not when there is nothing left to learn. Since there is always potential left on the table, underfitting is the default state for LLMs. Overfitting, on the other hand, is rare, because most training sequences pass through the model only once, giving the model little chance to memorize the text. A notable exception is repeated data: when the same information appears many times in the training data, the model may end up memorizing it word for word. 

Since overfitting and underfitting are rarely the problem, the real risks lie in training anomalies. Training can become unstable, causing a lasting drop in model performance or even diverging completely, or it can simply be inefficient. In all cases, a significant share of the computational budget goes to waste, and in the worst-case scenario, there is no budget left to restart training from scratch.


### Training distribution




### Hyperparameters and Learning strategy


### Training loop
3. Esitestit ja mittakaavakokeet (Small-Scale Runs)
Kukaan ei aja täyttä klusteria kylmiltään. Ennen varsinaista ajoa suoritetaan:

Muistin ja vakauden profilointi: Varmistetaan, että malli mahtuu VRAMiin (OOM-virheiden eliminointi) ja mitataan todellinen MFU (Model FLOPs Utilization). Jos MFU jää alle 40–50 %:n, rinnakkaistusstrategiaa ja tiedonsiirto-operaatioita viilataan.

Loss-käyrän ennustettavuus: Ajetaan muutama sata tai tuhat askelta ja tarkistetaan, että häviö (cross-entropy loss) laskee tasaisesti odotetulla tavalla.

4. Koulutussilmukan ajo (The Main Loop)
Varsinainen koulutus pyörii päivistä useisiin kuukausiin. Silmukka etenee askel kerrallaan:

Datan lataus (Dataloader): Esipakattuja binääritiedostoja luetaan levyltä suoraan muistiin (usein memmap-tekniikalla ilman ylimääräistä prosessointia).

Forward Pass: Malli laskee logits-arvot syötetyille sekvensseille. FlashAttention huolehtii huomiomatriisien muistitehokkaasta laskennasta.

Loss-laskenta: Lasketaan seuraavan tokenin ennustamisen ristientropia (Next-Token Prediction).

Backward Pass: Lasketaan gradientit suhteessa mallin painoihin.

Gradient Clipping: Gradienttien normi rajataan (tyypillisesti arvoon 1.0), jotta estetään räjähtävät gradientit (gradient explosion).

Optimizer Step: Päivitetään painot hajautetusti (esim. ZeRO/FSDP).
