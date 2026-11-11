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
      { text: 'Home', link: '/' },
      { text: 'AI Fundamentals ', link: '/llm-foundations/' },
      { text: 'AI Configuration', link: '/llm-configuration'}
    ],

    sidebar: {
      '/llm-foundations/': [
        {
          text: 'Home', 
          link: '/',
        },
        {
          text: 'AI Fundamentals home', 
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
          text: 'Aligned Model', 
          link: '/llm-foundations/base-model/index',
          items: [
            { text: 'Architecture', link: '/llm-foundations/base-model/architecture' },
            { text: 'Tokenization', link: '/llm-foundations/base-model/tokenization' },
            { text: 'Training Data', link: '/llm-foundations/base-model/training-data' },
            { text: 'Pre-training', link: '/llm-foundations/base-model/pre-training' }
          ]
        }
      ]
    }
  }
})