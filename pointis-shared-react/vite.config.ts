import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';
import styleImport from 'vite-plugin-style-import';

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
        react(),
    ],
    build: {
        cssCodeSplit: true,
        minify: true,
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            name: 'MyLibrary',
            fileName: (format) => `my-library.${format}.js`,
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react-router-dom',
                'react-icons',
                '@reduxjs/toolkit',
                'react-redux',
                '@tiptap/core',
                '@tiptap/react',
                'lodash',
                'node_modules',
                ...Object.keys(require('./package.json').dependencies || {}),
                ...Object.keys(require('./package.json').peerDependencies || {})
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    lodash: '_',
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                include: ["src/**/*.less"],
                javascriptEnabled: true,
            },
        },
    },
});
