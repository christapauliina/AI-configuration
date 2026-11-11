import DefaultTheme from 'vitepress/theme'
import Expand from './Expand.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Expand', Expand)
  }
}