import { defineConfig } from 'vite'
import eslint from '@rollup/plugin-eslint'

export default defineConfig({
    build: {
        sourcemap: 'hidden'
    },
    plugins: [
        eslint({
            include: ['**/*.vue', '**/*.js'],
            exclude: ['node_modules', 'dist', '**/*.css', '**/*.svg']
        })
    ]
})
