// import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
// import glsl from 'vite-plugin-glsl'

import { resolve } from 'path'

const pathResolve = (dir: string): any => {
  return resolve(__dirname, '.', dir)
}

const alias: Record<string, string> = {
  // eslint-disable-next-line comma-dangle
  '@': pathResolve('src')
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx() 
    // glsl({
		// 	include: [
		// 		// Glob pattern, or array of glob patterns to import
		// 		'**/*.glsl',
		// 		'**/*.wgsl',
		// 		'**/*.vert',
		// 		'**/*.frag',
		// 		'**/*.vs',
		// 		'**/*.fs',
		// 	],
		// 	exclude: undefined, // Glob pattern, or array of glob patterns to ignore
		// 	warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
		// 	defaultExtension: 'glsl', // Shader suffix when no extension is specified
		// 	compress: false, // Compress output shader code
		// 	root: '/',
		// }),
  ],
  resolve: {
    alias,
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  base: './',
  server: {
    open: true,
    port: 8000
  }
})
