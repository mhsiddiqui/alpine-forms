import { resolve } from 'path';
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'fs';
import { createHash } from 'crypto';
import { build } from 'vite';

const root = import.meta.dirname;
const docsJsDir = resolve(root, 'docs/public/js');

const builds = [
    // CDN (minified)
    {
        lib: {
            entry: resolve(root, 'src/cdn.js'),
            fileName: () => 'alpine.forms.min.js',
            formats: ['iife'],
            name: 'AlpineForms',
        },
        outDir: 'dist',
        minify: 'oxc',
    },
    // Docs (minified, will be renamed with hash)
    {
        lib: {
            entry: resolve(root, 'src/cdn.js'),
            fileName: () => 'alpine.forms.tmp.js',
            formats: ['iife'],
            name: 'AlpineForms',
        },
        outDir: 'docs/public/js',
        minify: 'oxc',
    },
    // ESM + CJS
    {
        lib: {
            entry: resolve(root, 'src/module.js'),
            fileName: (format) => `alpine.forms.${format === 'es' ? 'esm' : 'cjs'}.js`,
            formats: ['es', 'cjs'],
        },
        outDir: 'dist',
        minify: false,
    },
];

for (const b of builds) {
    await build({
        configFile: false,
        build: {
            lib: b.lib,
            outDir: b.outDir,
            emptyOutDir: false,
            minify: b.minify,
            target: 'es2019',
            sourcemap: false,
        },
    });
}

// Add content hash to docs build and write manifest
const tmpFile = resolve(docsJsDir, 'alpine.forms.tmp.js');
const content = readFileSync(tmpFile);
const hash = createHash('md5').update(content).digest('hex').slice(0, 8);
const hashedName = `alpine.forms.${hash}.min.js`;

// Remove old hashed builds
for (const file of readdirSync(docsJsDir)) {
    if (/^alpine\.forms\.[a-f0-9]+\.min\.js$/.test(file)) {
        unlinkSync(resolve(docsJsDir, file));
    }
}

writeFileSync(resolve(docsJsDir, hashedName), content);
unlinkSync(tmpFile);
writeFileSync(resolve(docsJsDir, 'manifest.json'), JSON.stringify({ 'alpine.forms': hashedName }));

console.log(`\ndocs → ${hashedName}`);
