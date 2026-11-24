import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "AI -configuration",
  description: "Documentation and guide for LLM development",
  base: '/AI-configuration/',
  appearance: false,

  themeConfig: {
    siteTitle:false,
    outline:false,
   
    nav: [
      { text: 'AI Fundamentals ', link: '/llm-foundations/' },
      { text: 'AI Configuration', link: '/llm-configuration/'}
    ],

    sidebar: {
      '/llm-foundations/': [
        {
          text: 'AI Fundamentals', 
          link: '/llm-foundations/',
        },
        {
          text: 'Base Model', 
          link: '/llm-foundations/base-model/index',
          items: [
            { text: 'Architecture', link: '/llm-foundations/base-model/architecture' },
            { text: 'Training Data', link: '/llm-foundations/base-model/training-data' },
            { text: 'Tokenization', link: '/llm-foundations/base-model/tokenization' },
            { text: 'Pre-training', link: '/llm-foundations/base-model/pre-training' }
          ]
        },
        {
          text: 'Aligned Model (in progress)'
        },
        {
          text: 'Future (in progress)'
        }
      ],
      '/llm-configuration/': [
        {
          text: 'AI Configuration', 
          link: '/llm-configuration/',
        },
        {
          text: 'Configurations', 
          link: '/llm-configuration/configurations/index',
          items: [
            { text: '01. Model - Memory', link: '/llm-configuration/configurations/01.model-memory' },
            { text: '02. Model - System Prompt', link: '/llm-configuration/configurations/02.model-systemprompt' },
            { text: '03. Model - Parameters', link: '/llm-configuration/configurations/03.model-parameters' },
            { text: '04. Agent - Tools', link: '/llm-configuration/configurations/04.agent-tools' },
            { text: '05. Agent - MCP', link: '/llm-configuration/configurations/05.agent-mcp' },
            { text: '06. Advanced - Multi-Agent Orchestration', link: '/llm-configuration/configurations/06.advanced-orchestration' },
            { text: '07. Advanced - Rag', link: '/llm-configuration/configurations/07.advanced-rag' },
            { text: '08. Advanced - Fine Tuning', link: '/llm-configuration/configurations/08.advanced-finetune' }
          ]
        },
        {
          text: 'Frameworks (in progress)' 
        },
        {
          text: 'Use cases (in progress)' ,
        }
      ]
    }


  }
})