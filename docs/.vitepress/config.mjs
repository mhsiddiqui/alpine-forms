import { defineConfig } from 'vitepress';

export default defineConfig({
    title: 'Alpine-Forms',
    description: 'Lightweight form state management, validation, and submission for Alpine.js',
    base: '/alpine-forms/',
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: 'localhostLinks',

    head: [
        ['link', { rel: 'icon', href: '/alpine-forms/favicon.ico' }],
        ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ],

    themeConfig: {
        logo: '/images/hero.png',
        siteTitle: 'Alpine-Forms',

        nav: [
            { text: 'Guide', link: '/guide/installation', activeMatch: '/guide/' },
            { text: 'API', link: '/api/alpine-form', activeMatch: '/api/' },
            { text: 'Examples', link: '/examples/basic', activeMatch: '/examples/' },
            {
                text: 'v1.0.1',
                items: [
                    {
                        text: 'Changelog',
                        link: 'https://github.com/mhsiddiqui/alpine-forms/blob/main/CHANGELOG.md',
                    },
                    {
                        text: 'npm',
                        link: 'https://www.npmjs.com/package/alpine-forms',
                    },
                ],
            },
        ],

        sidebar: {
            '/guide/': [
                {
                    text: 'Guide',
                    items: [
                        { text: 'Installation', link: '/guide/installation' },
                        { text: 'Usage', link: '/guide/usage' },
                        { text: 'Configuration', link: '/guide/configuration' },
                        { text: 'Validation', link: '/guide/validation' },
                    ],
                },
            ],
            '/api/': [
                {
                    text: 'API Reference',
                    items: [
                        { text: 'Alpine.Form()', link: '/api/alpine-form' },
                        { text: 'Data Methods', link: '/api/data-methods' },
                        { text: 'State Methods', link: '/api/state-methods' },
                        { text: 'Validation Methods', link: '/api/validation-methods' },
                        { text: 'Error Methods', link: '/api/error-methods' },
                        { text: 'Registration & Schema', link: '/api/registration' },
                        { text: 'Events', link: '/api/events' },
                        { text: 'x-register Directive', link: '/api/x-register' },
                    ],
                },
            ],
            '/examples/': [
                {
                    text: 'Examples',
                    items: [
                        { text: 'Basic Form (Joi)', link: '/examples/basic' },
                        { text: 'Custom Validation', link: '/examples/custom-validation' },
                        { text: 'Validation Modes', link: '/examples/validation-modes' },
                        { text: 'Server-Side Errors', link: '/examples/server-errors' },
                        { text: 'Dynamic Fields', link: '/examples/dynamic-fields' },
                        { text: 'Reset Form', link: '/examples/reset' },
                        { text: 'Dirty Fields & PATCH', link: '/examples/dirty-fields' },
                    ],
                },
            ],
        },

        socialLinks: [{ icon: 'github', link: 'https://github.com/mhsiddiqui/alpine-forms' }],

        search: {
            provider: 'local',
        },

        editLink: {
            pattern: 'https://github.com/mhsiddiqui/alpine-forms/edit/main/docs/:path',
            text: 'Edit this page on GitHub',
        },

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © Muhammad Hassan Siddiqi',
        },
    },
});
