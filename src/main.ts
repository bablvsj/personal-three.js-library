import { createApp } from 'vue';
import App from './App.vue';
import '../src/assets/styles/index.css';
import router from './router/index.js';

const app = createApp(App);
app.use(router);

app.mount('#app');

(function(doc, win){
  const fn = () => {
    const docEl = doc.documentElement,
      clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px';
  };
  if (!doc.addEventListener) return;
  win.addEventListener('resize', fn);
  doc.addEventListener('DOMContentLoaded', fn);
})(document, window);
