import { defineConfig } from "vite";
import BuildInfo from 'vite-plugin-info';
import react from '@vitejs/plugin-react';
import packageLockJson from "../package-lock.json";
import { createHtmlPlugin } from 'vite-plugin-html';

const importMap = {
    "three": `https://unpkg.com/three@${packageLockJson.packages["node_modules/three"].version}/build/three.module.js`,
};

export default defineConfig(({
    command,
}) => ({
    resolve: {
        alias: {
            ...(command === "build" && importMap),
        }
    },
    build: {
        // minify: false,
        rollupOptions: {
            output: {
                // manualChunks(id) {
                //     const match = id.match(/node_modules\/(.*?)\//);
                //     if (!match) { return; }
                //     const name = match[1];
                //     if (name === "three") { return name; }
                // }
            }
        }
    },
    plugins: [
        react({
            jsxImportSource: "@emotion/react",
            babel: {
                plugins: ["@emotion/babel-plugin"],
            },
        }),
        createHtmlPlugin({
            // minify: false,
            inject: {
                tags: [
                    ...(command !== "build" ? [] :
                        Object.values(importMap).map(href => ({
                            injectTo: "head",
                            tag: "link",
                            attrs: { rel: "modulepreload", crossorigin: "", href },
                        } as const))
                    ),
                ],
            }
        }),
        BuildInfo(),
    ],
    server: {
        port: 8434,
    },
    base: "./",
}));