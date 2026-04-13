# Introduction

Alpine-Forms is a lightweight form management library for [Alpine.js](https://alpinejs.dev/). It handles form state, field tracking, validation, and submission — giving you the features of libraries like React Hook Form, but designed for Alpine.js.

## Features

- **Form & field state** — track `isDirty`, `isTouched`, `isValid`, `isSubmitting`, `isSubmitted` at both form and field level
- **Validation modes** — validate `onChange`, `onBlur`, `onTouched`, `onSubmit`, or `all`
- **Schema validation** — use Joi or any custom validator function
- **Async validation** — validators can return Promises (e.g., check username availability via API)
- **Custom validation** — per-field functions with access to the full form data for cross-field checks
- **Manual error control** — `setError()` and `clearErrors()` for server-side validation
- **Reset & defaults** — `reset()` restores initial values; `isDirty` compares against defaults
- **Bulk operations** — `setValues()` for populating from API responses, `getDirtyFields()` for PATCH requests
- **Error focus** — auto-focus the first invalid field on failed submit
- **Field events** — dispatch custom events on field changes
- **`x-register` directive** — auto-binds inputs, textareas, selects, checkboxes, radios, and file inputs

## Quick Start

```html
<script defer src="https://unpkg.com/alpine-forms/dist/alpine.forms.min.js"></script>
<script defer src="https://unpkg.com/alpinejs"></script>
```

```html
<div
    x-data="{
    form: Alpine.Form(
        { email: '', password: '' },
        {
            config: {
                validations: {
                    email: (value) => !value ? { message: 'Email is required' } : undefined,
                    password: (value) => value.length < 6 ? { message: 'Min 6 characters' } : undefined,
                }
            }
        }
    )
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
    </form>
</div>
```

## Next Steps

- [Installation](pages/installation.md) — CDN and NPM setup
- [Usage](pages/usage.md) — Forms, fields, state, submission, reset, dirty tracking
- [Configuration](pages/configuration.md) — Validation modes, field events, focus on error
- [Validation](pages/validation.md) — Custom validators, Joi, async validation, manual errors
- [API Reference](pages/api/alpine-form.md) — Complete method and property reference
- [Examples](pages/examples/basic.md) — Live demos with source code
