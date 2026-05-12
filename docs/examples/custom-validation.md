# Custom Validation (No Joi)

A login form using only custom validation functions — no external schema library required. Each field has its own validator function that returns an error object when validation fails.

**What this example covers:**

- Creating a form with `Alpine.Form()` using inline validation functions
- Writing custom validators with `config.validations`
- No external dependencies (no Joi, no Yup, etc.)
- Displaying field errors with `getFieldState()`

## Live Demo

<iframe src="example.html?name=custom-validation" width="100%" height="340" frameborder="0"></iframe>

## JavaScript

Define validation functions directly in `config.validations`. Each function receives the field value and returns `{ message }` on failure, or `undefined` on success.

<<< @/public/js/custom-validation.js

## HTML

The template is identical to the Joi example — the HTML doesn't care which validation approach is used.

<<< @/public/examples/custom-validation.tpl.html{html}

## Cross-Field Validation

Custom validators receive the full form data as the second argument, enabling cross-field checks:

```js
validations: {
    confirmPassword(value, data) {
        if (value !== data.password) return { message: 'Passwords do not match' };
    }
}
```
