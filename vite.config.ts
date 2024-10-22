import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        minify: false,
        rollupOptions: {
            input: {
                content: 'src/ext/content.js',
                script: 'src/ext/script.js',
                background: 'src/ext/background.js',
                main: 'src/popup/main.tsx',
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
            },
        }
    }
})