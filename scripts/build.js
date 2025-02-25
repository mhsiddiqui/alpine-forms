/* eslint-disable */
import fs from 'fs';
import esbuild from 'esbuild';

const pluginName = 'alpine.forms';

async function build(options) {
    options.define ||= {};
    options.define['process.env.NODE_ENV'] = process.argv.includes('--watch') ? `'production'` : `'development'`;

    try {
        if (process.argv.includes('--watch')) {
            const ctx = await esbuild.context(options);
            await ctx.watch();  // Enables watch mode
            console.log(`Watching for changes...`);
        } else {
            await esbuild.build(options);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

// CDN
build({
    entryPoints: [`src/cdn.js`],
    outfile: `dist/${pluginName}.min.js`,
    bundle: true,
    // minify: true,
    sourcemap: false,
    platform: 'browser',
    define: { CDN: 'true' },
    target: "es2019",
});

// Example
build({
    entryPoints: [`src/cdn.js`],
    outfile: `examples/${pluginName}.js`,
    bundle: true,
    minify: false,
    sourcemap: false,
    platform: 'browser',
    define: { CDN: 'true' },
    target: "es2019",
});

// Module (ESM)
build({
    entryPoints: [`src/module.js`],
    outfile: `dist/${pluginName}.esm.js`,
    bundle: true,
    platform: 'neutral',
    mainFields: ['main', 'module'],
    target: "es2019",
});

// Module (CJS)
build({
    entryPoints: [`src/module.js`],
    outfile: `dist/${pluginName}.cjs.js`,
    bundle: true,
    platform: 'node',
    target: "es2019",
});
