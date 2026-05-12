---
layout: home

hero:
    name: Alpine-Forms
    text: Form management for Alpine.js
    tagline: Lightweight form state, validation, and submission for Alpine.js
    image:
        src: /images/hero.png
        alt: Alpine-Forms
    actions:
        - theme: brand
          text: Get Started
          link: /guide/installation
        - theme: alt
          text: View on GitHub
          link: https://github.com/mhsiddiqui/alpine-forms

features:
    - title: Form & field state
      details: Track isDirty, isTouched, isValid, isSubmitting, and isSubmitted at both form and field level.
    - title: Validation modes
      details: Validate onChange, onBlur, onTouched, onSubmit, or all — pick the mode that fits your form's UX.
    - title: Schema or custom validators
      details: Use Joi, write your own validator function, or define per-field custom validations. No dependencies required.
    - title: Async validation
      details: Validators can return Promises (e.g. check username availability via API). Stale results are discarded.
    - title: Manual error control
      details: setError() and clearErrors() for server-side validation responses.
    - title: x-register directive
      details: Auto-binds inputs, textareas, selects, checkboxes, radios, and file inputs with a single directive.
---

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

- [Installation](/guide/installation) — CDN and NPM setup
- [Usage](/guide/usage) — Forms, fields, state, submission, reset, dirty tracking
- [Configuration](/guide/configuration) — Validation modes, field events, focus on error
- [Validation](/guide/validation) — Custom validators, Joi, async validation, manual errors
- [API Reference](/api/alpine-form) — Complete method and property reference
- [Examples](/examples/basic) — Live demos with source code
