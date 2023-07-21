import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'

import 'ant-design-vue/dist/reset.css'

import './scss/app.scss';


const app = createApp(App)
app.use(router)
app.use(Antd)

app.mount('#app')
// ;(function (doc, win) {
//   const fn = () => {
//     const docEl = doc.documentElement,
//       clientWidth = docEl.clientWidth
//     if (!clientWidth) return
//     docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px'
//   }
//   if (!doc.addEventListener) return
//   win.addEventListener('resize', fn)
//   doc.addEventListener('DOMContentLoaded', fn)
// })(document, window)
