# Pre-training

<br>
<Expand info="This chapter abstracts away much of the underlying neural network theory and linear algebra to keep the focus on the key consepts.">Note: </Expand>
<br>

### What actually happens in pre-training inside the model?
In pre-training, packed training data sequences are passed through the neural network in batches. Each token in the model's vocabulary is mapped to a vector, where every component reflects the knowledge and meaning associated with that token. The neural network consists of billions of parameters—weights in each node that transform the knowledge attached to the tokens by relating them to other tokens in the sequence. After the batch of sequences has gone through the network, the model attempts to predict the next token.

Because the correct token is already known as it is part of the sequence, a loss function calculates the exact error between the model's predictions and the true outcomes. Backpropagation then calculates the direction and magnitude—the gradient—by which each weight should be adjusted for more accurate results. The network's weights are then updated based on these gradients by the optimizer, and another batch of training sequences is passed through the model. 

This continuous cycle of transforming tokens, calculating the error, deriving gradients via backpropagation, and updating the weights makes the model increasingly accurate over time

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

### Batching 

*In progress*

### Hyperparameters and Learning Strategy


Unlike in traditional machine learning, overfitting and underfitting don't play the same role when training an LLM. Training is stopped when further improvements are no longer worth the computational cost, not when there is nothing left to learn. Since there is always potential left on the table, underfitting is the default state for LLMs. Overfitting, on the other hand, is rare, because most training sequences pass through the model only once, giving the model little chance to memorize the text. A notable exception is repeated data: when the same information appears many times in the training data, the model may end up memorizing it word for word.

When defining training hyperparameters and training strategies, there are four key things to consider: optimizer, learning rate, training precision and gradient clipping. Each one of them has the power to create training anomalies, which are the real risks in training an LLM. Training anomalies can mean inefficient training or the training diverging completely (crashing beyond the point of recovery). In either case, a significant share of the computational budget goes to waste, and in the worst-case scenario, there is no budget left to restart training from scratch.

#### Optimizer

As backpropagation calculates the gradients, which indicate the magnitude and direction in which the weights should be adjusted, the optimizer is the component that changes the values of the weights inside the neural network. If the gradients were used as such to adjust the weights, training would have a high chance of crashing, stagnating or oscillating.

In training stagnation, the model stops learning too early. The weights get stuck in a flat region, such as a so-called "saddle point", where the gradients are close to zero. As a result, the updates become tiny and learning practically stops, even though a bigger adjustment would push the model past this point and improve the results greatly. Training oscillation is quite the opposite. The model attempts to learn "too much" at once, causing the weights to jump erratically across the optimization landscape. Because the adjustments are too large, the weights bounce back and forth—overshooting the target over and over—and the optimal point is left untouched.

To control the adjustment of weights in a manner that prevents oscillation and stagnation, the optimizer keeps a memory of each parameter's past gradients. This memory contains two key pieces of information: the average direction the gradients have been pointing, known as momentum, and the average magnitude of the gradients, known as variance.

If the momentum has pushed the weights in the same direction multiple times, the optimizer accelerates and takes bigger steps in that direction, which effectively prevents stagnation. On the other hand, if the variance is high, meaning the gradients have been large, the optimizer decreases the step size for that specific parameter. Dampening the updates for volatile weights prevents them from acting erratically, which effectively prevents oscillation.

#### Learning rate

In addition to the gradient history, the optimizer is guided by a defined learning rate. If the learning rate is high, the optimizer adjusts the weights more by default; if the learning rate is low, the weight adjustments are proportionally smaller.

Since the weights in a neural network are initialized randomly, the learning rate is set low at the beginning of training, as the momentum and variance values in the optimizer have not yet stabilized. As training progresses, the learning rate is raised to its peak. This is called the warm-up phase. At the peak learning rate, the model is actively adjusting the weights. Towards the end of training, as the model is approaching a general solution, the learning rate is lowered in the decay stage. The active adjustments of the learning rate (warm-up, peak, decay) prevent instability at the beginning, stagnation in the middle and oscillation at the end of training.

#### Precision

Models have billions of weights, and for each weight we have an individual gradient, and for each individual gradient we have the momentum and variance of that gradient stored in the optimizer. The way these attributes are stored in training has a big impact on overall memory consumption and the speed of calculations. To make calculations faster and save memory, most calculations in training are performed in 16-bit form (FP16 or BF16) instead of 32-bit form.

In FP16, the maximum value a 16-bit float can represent is ~65,504, and if the values grows above that, the value does not "fit" into the format and is eventually represented by NaN (Not a Number) in the neural network (overflow). The same occurs with very small numbers, where FP16 rounds extremely small numbers to zero (underflow). If any gradient is NaN, it contaminates the whole neural network in just a few steps, giving every gradient a value of NaN (as the network works by matrix multiplication). This is called a NaN crash, and it kills the training run. If any gradient gets a value of 0, the weight of that gradient will not be adjusted in that round. If a large share of gradients gets a value of zero, learning can slow down or even stall in parts of the network.

As overflow and underflow are major causes of failed training, FP16 representation is nowadays usually replaced by BF16 representation, which is not as precise as FP16, but can represent much bigger and smaller values.

#### Gradient clipping

Even with a carefully tuned optimizer, gradients can grow too large, resulting in exploding gradients. A sudden spike in gradients can be caused by a learning rate that is too high, an unusual batch of data, or a combination of both. Exploding gradients may result in a loss spike, where the loss suddenly jumps up and the model's predictions get worse instead of better. The model can often recover from a loss spike on its own, but in the worst-case scenario, it leads to a lasting drop in model performance or full divergence, which can end in a NaN crash. To limit the damage of exploding gradients, a gradient clipping threshold must be defined. Gradient clipping scales the gradients down if they exceed the preset value, acting as a final safety mechanism that reduces the risk of loss spikes and overflows.

### Training distribution
*in progress*
### Small scale runs
*in progress*
### Training loop
*in progress*