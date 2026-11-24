# Configurations

This page is divided in three sections

1. Model Configurations
2. Agent Configurations
3. Advanced Configurations
 
Before diving deeper into configurations, let's clarify the difference between a model and an agent. It is good to keep in mind that the terms are not yet solidified and are used quite inconsistently throughout the field. On this page, any mention of models and agents refers to the definitions established in this page. 

When we talk about a model, we mean a standalone LLM that has no access to anything beyond itself. That means a model only "knows" what it was exposed to during training, and its only ability is to generate output. If we want the model to access newer knowledge or perform tasks, we have to provide it with tools, such as web search, a code interpreter, or local file access. A model equipped with tools and the autonomy to decide when to use them is what we define as an agent.

Together, these layers make up the harness: the surrounding configuration and application logic that governs how a model or agent behaves in a real system.

All the source code in C# can be found on GitHub here: 