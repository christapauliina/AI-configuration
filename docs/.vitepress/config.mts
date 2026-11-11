import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "AI -configuration",
  description: "Documentation and guide for LLM development",
  base: '/AI-configuration/',

  themeConfig: {
    nav: [
      { text: 'Main', link: '/' },
      { text: 'LLM Foundations', link: '/llm-foundations/' }
    ],

    sidebar: {
      '/llm-foundations/': [
        {
          text: 'Base Model',
          items: [
            { text: 'Introduction', link: '/llm-foundations/base-model/index'},
            { text: 'Architecture', link: '/llm-foundations/base-model/architecture' },
            { text: 'Tokenization', link: '/llm-foundations/base-model/tokenization' },
            { text: 'Training Data', link: '/llm-foundations/base-model/training-data' },
            { text: 'Pre-training & Compute', link: '/llm-foundations/base-model/pre-training' }
          ]
        }
      ]
    }
  }
})