# Validation Methods

## `runValidations()`

Run all validations (schema + custom). Returns a `Promise<boolean>` (`true` if valid).

```js
const isValid = await form.runValidations();
```

Validation order:

1. Resets all field errors
2. Runs schema validation (if `config.validator` is set)
3. Runs custom validations on fields that passed schema validation
4. Resolves async validators and discards stale results

## `validateField(field)`

Validate a single field. Returns a `Promise<boolean>` (`true` if the field is valid). Updates form-level `isValid` state.

```js
const emailValid = await form.validateField('email');
```

This runs both schema and custom validation for the specified field.

## `submit(callback)`

Validate and submit the form. `callback` receives the form data.

```js
await form.submit(async (data) => {
    await fetch('/api', { method: 'POST', body: JSON.stringify(data) });
});
```

**Flow:**

1. Sets `isSubmitting: true`, clears `isSubmitted` and `error`
2. Awaits `runValidations()`
3. If invalid: sets `isSubmitting: false`, calls `focusFirstError()` if `focusOnError` is enabled, returns
4. If valid: awaits `callback(data)`
5. On success: sets `isSubmitted: true`
6. On error: captures `error.message` into form state
