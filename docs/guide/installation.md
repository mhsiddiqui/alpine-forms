# Installation

## NPM / Module

```bash
npm install alpine-forms
```

Then register the plugin with Alpine. After registration, `Alpine.Form` is available in your components:

```js
import Alpine from 'alpinejs';
import { directives } from 'alpine-forms';

Alpine.plugin(directives);
Alpine.start();
```

If you need the Joi validator in module mode:

```js
import { directives, joiValidator } from 'alpine-forms';
```

## CDN

Include both scripts with `defer`. Alpine-Forms auto-registers on `alpine:init`, so load order does not matter:

```html
<script defer src="https://unpkg.com/alpine-forms/dist/alpine.forms.min.js"></script>
<script defer src="https://unpkg.com/alpinejs"></script>
```

The CDN build auto-registers the plugin and makes `Alpine.Form` available globally. No setup code needed.

## Using Joi (Optional)

Joi is **not** bundled with Alpine-Forms. If you want to use the built-in `joiValidator`, you must install Joi separately.

### CDN

Load the Joi browser bundle **before** Alpine-Forms:

```html
<script defer src="https://cdn.jsdelivr.net/npm/joi@17/dist/joi-browser.min.js"></script>
<script defer src="https://unpkg.com/alpine-forms/dist/alpine.forms.min.js"></script>
<script defer src="https://unpkg.com/alpinejs"></script>
```

### NPM

```bash
npm install joi
```

Then make Joi available globally:

```js
import Joi from 'joi';
globalThis.joi = Joi;
```

If Joi is not found at runtime, `joiValidator` will throw a clear error with installation instructions.

> **Tip:** You don't need Joi at all. You can write your own validator function or use per-field custom validations without any external dependency. See [Validation](/guide/validation).
