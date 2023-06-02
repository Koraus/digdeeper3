import { PluginOption, defineConfig } from "vite";
import BuildInfo from 'vite-plugin-info';
import react from '@vitejs/plugin-react';
import packageLockJson from "../package-lock.json";
import { createHtmlPlugin } from 'vite-plugin-html';

const importMap = {
    "three": `https://unpkg.com/three@${packageLockJson.packages["node_modules/three"].version}/build/three.module.js`,
    "@fontsource/noto-sans-mono": "_noop",
};

export default defineConfig(async ({
    command,
}) => {
    const glsl = (await import("vite-plugin-glsl")).default;

    // The resulting bundle would load some parts from public resources
    //   isntead of including them.
    // Note: Contrary, the dev env is considered to be an offline env
    //   and to rely on local resources only
    const isForOnlineEnv = true;

    const isBuild = command === "build";
    const isBuildForOnlineEnv = isBuild && isForOnlineEnv;

    return ({
        resolve: {
            alias: {
                ...(isBuildForOnlineEnv && importMap),
            },
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
            ...(isBuildForOnlineEnv ? [{
                name: "_noop",
                enforce: "pre",
                load: id => id === "_noop" ? "" : undefined,
            }] as PluginOption[] : []),
            react({
                jsxImportSource: "@emotion/react",
                babel: {
                    plugins: ["@emotion/babel-plugin"],
                },
            }),
            glsl(),
            createHtmlPlugin({
                // minify: false,
                inject: {
                    tags: [
                        ...(isBuildForOnlineEnv ? [
                            // Google Fonts
                            ...[{
                                injectTo: "head",
                                tag: "link",
                                attrs: {
                                    rel: "preconnect",
                                    href: "https://fonts.googleapis.com",
                                },
                            }, {
                                injectTo: "head",
                                tag: "link",
                                attrs: {
                                    rel: "preconnect",
                                    crossorigin: "",
                                    href: "https://fonts.gstatic.com",
                                },
                            }, {
                                injectTo: "head",
                                tag: "link",
                                attrs: {
                                    rel: "stylesheet",
                                    crossorigin: "",
                                    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Mono&display=swap",
                                },
                            }],

                            // Import Map
                            ...Object.values(importMap)
                                .filter(href => href !== "_noop")
                                .map(href => (({
                                    injectTo: "head",
                                    tag: "link",
                                    attrs: { rel: "modulepreload", crossorigin: "", href }
                                }) as const)),
                        ] as const : []),
                    ],
                }
            }),
            BuildInfo(),
        ],

        server: {
            port: 8434,
        },

        base: "./"
    });
});