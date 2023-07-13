// import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import {resolve} from 'path';

const pathResolve = (dir: string): any => {  
  return resolve(__dirname, ".", dir);    
};
 
const alias: Record<string, string> = {
  // eslint-disable-next-line comma-dangle
  '@': pathResolve("src")
};


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias,
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  base: './',
  server: {
    open:true,
    port: 8000,
  },
});
