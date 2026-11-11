# Pre-training

### Amount of Computation 

Pre-training is a computationally expensive process, and designing a base model typically starts by creating a compute budget. The required compute is measured in FLOPs (Floating Point Operations), which quantify the total amount of computation. As a rule of thumb, the FLOPs required to train a model is:

***Amount of Computation, C (FLOPs) ≈ 6 · N · D***

where N is the parameter count and D is the number of tokens in the training data. The equation is a simplification, and the ratio 6 can be different in a few different situations but it holds quite well for standard architectures.

In reality, hardware cannot run at its theoretical peak capacity because training is limited by VRAM memory bandwidth, communication latency, and GPU idling. Therefore, training pipelines are evaluated using MFU (Model FLOPs Utilization), which is the ratio of actual model throughput to theoretical peak hardware FLOPS, where FLOPS (with a capital S) is Floating Point Operations per second, a measurement of computational efficiency of the GPU. MFU typically floats between 35% and 45%, depending on the optimization of the code, I/O operations, and networks. The best pipelines reach 50% to 60% utilization, and an MFU under 30% is regarded as low. If you have an MFU of 50%, you need to provision twice as much compute capacity relative to the required FLOPs.

### Context Window & Data Packing

#### Context Window
Before starting the pre-training, the model's context window size must be decided and the training data needs to be packed accordingly. The size of the context window defines how much the model can "see" at once. A longer context window allows the model to consider longer inputs when producing outputs, which is especially beneficial for tasks that need to process long texts for coherent outputs, such as summarizing or analyzing long texts, or having long conversations with the model.

However, doubling the context window quadruples the compute required for processing the sequence. With long context windows (> 8k), sequence processing starts consuming a large share of total compute, increasing the FLOPs needed for training the model beyond 6ND. At the extremes, really long and really short context windows decrease the MFU and need more complex maneuvers in pre-training in order to keep training efficient and costs moderate.

#### Data Packing
When the size of the context window is decided, the training data is packed into sequences sized to that context window, as the model can only process inputs of that specific length at once. There are a few options for how this data packing is done, considering that documents and individual texts in the training dataset are rarely the exact size of the context window.

The most common approach is sequence packing, where multiple documents and texts are concatenated into a continuous stream of tokens, which is then sliced into chunks that match the context window size. In sequence packing, you have to clearly differentiate the documents from each other to avoid context contamination. In context contamination, the model assumes that the contents of two different documents are related, simply because they are in the same input sequence.

Differentiating two documents can be done by using an attention mask, where the model cannot see more than one document at a time although they are in the same input sequence, or by simply inserting an end-of-text token between documents. With end-of-text tokens, the model can still 'see' both documents, but learns to differentiate them from each other as training progresses. Segment attention with an attention mask creates a better outcome, but is more complex to implement. There is always the option of padding, where one document is placed in one input sequence and any remaining positions are filled with empty tokens. Padding is computationally a quite inefficient option, and it is rarely used.

### Distributed Setup
### Hyperparameters and learning strategy
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
