[![CI](https://github.com/mhsiddiqui/alpine-forms/actions/workflows/ci.yml/badge.svg)](https://github.com/mhsiddiqui/alpine-forms/actions/workflows/ci.yml)
# Alpine-Forms

A lightweight form management library for [Alpine.js](https://alpinejs.dev/) — form state, validation, dirty tracking, and submission.

## Features

- Form & field state tracking (`isDirty`, `isTouched`, `isValid`, `isSubmitting`, `isSubmitted`)
- Validation modes: `onChange`, `onBlur`, `onTouched`, `onSubmit`, `all`
- Schema validation (Joi, Zod, or any custom validator)
- Async validators with automatic race condition handling
- Per-field custom validations with cross-field access
- Manual error control (`setError`, `clearErrors`) for server-side validation
- Reset with default value tracking
- Bulk operations (`setValues`, `getDirtyFields`)
- Auto-focus first invalid field on submit
- `x-register` directive for auto-binding all input types

## Installation

```bash
npm install alpine-forms
```

```js
import Alpine from 'alpinejs';
import { directives } from 'alpine-forms';

Alpine.plugin(directives);
Alpine.start();
```

Or via CDN:

```html
<script defer src="https://unpkg.com/alpinejs"></script>
<script defer src="https://unpkg.com/alpine-forms/dist/alpine.forms.min.js"></script>
```

## Quick Example

```html
<div
    x-data="{
    form: Alpine.Form({ email: '', password: '' }, {
        config: {
            validationMode: 'onTouched',
            validations: {
                email: (v) => !v ? { message: 'Required' } : undefined,
                password: (v) => v.length < 6 ? { message: 'Min 6 chars' } : undefined,
            }
        }
    })
}"
>
    <form @submit.prevent="form.submit(data => alert(JSON.stringify(data)))">
        <input x-register:form="form.field('email')" type="email" placeholder="Email" />
        <span
            x-show="!form.getFieldState('email').isValid"
            x-text="form.getFieldState('email').error"
        ></span>

        <input x-register:form="form.field('password')" type="password" placeholder="Password" />
        <span
            x-show="!form.getFieldState('password').isValid"
            x-text="form.getFieldState('password').error"
        ></span>

        <button type="submit">Submit</button>
        <button type="button" @click="form.reset()">Reset</button>
    </form>
</div>
```

## Documentation

Full documentation is available at [https://mhsiddiqui.github.io/alpine-forms/](https://mhsiddiqui.github.io/alpine-forms/)

## License

MIT
