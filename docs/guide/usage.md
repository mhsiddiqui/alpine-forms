# Usage

## Creating a Form

Use `Alpine.Form(data, options)` inside `x-data` to create a form instance:

```js
Alpine.data('myComponent', () => ({
    form: Alpine.Form(
        { name: '', email: '' }, // initial field values
        {
            schema: {
                /* Joi schema rules */
            },
            config: {
                /* configuration */
            },
            extras: {
                /* extra data for events */
            },
        },
    ),
}));
```

**Arguments:**

| Argument         | Type   | Description                                                         |
| ---------------- | ------ | ------------------------------------------------------------------- |
| `data`           | Object | Initial field values. Can be empty `{}` or pre-populated.           |
| `options.schema` | Object | Joi schema fields (used with `joiValidator`). Optional.             |
| `options.config` | Object | Configuration overrides. See [Configuration](/guide/configuration). |
| `options.extras` | Object | Extra data included in field change events.                         |

## Registering Fields

The `x-register` directive binds an input to the form. The directive modifier (`:form`) is the form variable name, and the expression returns the field descriptor.

```html
<div x-data="{ form: Alpine.Form({ email: '', age: 0 }) }">
    <input x-register:form="form.field('email')" type="email" />
    <input x-register:form="form.field('age')" type="number" />
</div>
```

### Supported Elements

| Element                   | Types                                                                           | Behavior                                                                 |
| ------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `<input>`                 | text, email, password, number, date, tel, url, search, color, range, time, etc. | Binds `:value` and `@change`                                             |
| `<input type="checkbox">` | checkbox                                                                        | Binds `:checked` and `@change` (boolean value)                           |
| `<input type="radio">`    | radio                                                                           | Binds `:checked` and `@change` (sets value to radio's `value` attribute) |
| `<input type="file">`     | file                                                                            | Binds `@change` (stores `File` object, or `FileList` for `multiple`)     |
| `<textarea>`              | -                                                                               | Same as text input                                                       |
| `<select>`                | single                                                                          | Binds `:value` and `@change`                                             |
| `<select multiple>`       | multiple                                                                        | Binds `@change` (stores array of selected values)                        |

All registered fields automatically get `@blur` tracking for `isTouched` state.

### Field Extras

Pass extra data with a field that gets included in change events:

```html
<input x-register:form="form.field('email', { section: 'contact' })" type="email" />
```

## Reading Values

```js
// Single field
form.getValue('email'); // "user@example.com"

// All fields
form.getValue(); // { email: "user@example.com", age: 25 }
```

## Setting Values

```js
// Single field (triggers validation based on validation mode)
form.setValue('email', 'new@example.com');

// Multiple fields at once (single validation pass)
form.setValues({ email: 'new@example.com', name: 'John' });
```

## Displaying Errors

```html
<input x-register:form="form.field('email')" type="email" />
<span
    x-show="!form.getFieldState('email').isValid"
    x-text="form.getFieldState('email').error"
    style="color: red;"
></span>
```

## Form Submission

```html
<form @submit.prevent="form.submit(handleSubmit)">
    <!-- fields -->
    <button type="submit" :disabled="form.getFormState().isSubmitting">
        <span x-show="form.getFormState().isSubmitting">Saving...</span>
        <span x-show="!form.getFormState().isSubmitting">Save</span>
    </button>
</form>
```

The `submit(callback)` method:

1. Sets `isSubmitting: true`, clears previous submission state
2. Runs all validations (waits for async validators)
3. If invalid: sets `isSubmitting: false`, optionally focuses first error field
4. If valid: calls `await callback(data)`
5. On success: sets `isSubmitted: true`
6. On error: captures `error.message` into form state

```js
async handleSubmit(data) {
    const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save');
}
```

## Form State

```js
form.getFormState();
// {
//     isValid: true,
//     isValidating: false,
//     isSubmitting: false,
//     isSubmitted: false,
//     isDirty: false,
//     error: ''
// }
```

| Property       | Description                                         |
| -------------- | --------------------------------------------------- |
| `isValid`      | `false` if any field has a validation error         |
| `isValidating` | `true` while async validators are running           |
| `isSubmitting` | `true` between submit start and callback completion |
| `isSubmitted`  | `true` after a successful submit                    |
| `isDirty`      | `true` if any field value differs from its default  |
| `error`        | Form-level error message (from failed submit)       |

## Field State

```js
form.getFieldState('email');
// {
//     isValid: true,
//     isDirty: false,
//     isTouched: false,
//     error: ''
// }
```

| Property    | Description                                  |
| ----------- | -------------------------------------------- |
| `isValid`   | `false` if field has a validation error      |
| `isDirty`   | `true` if current value differs from default |
| `isTouched` | `true` after the field has been blurred      |
| `error`     | Validation error message for this field      |

## Reset

```js
// Reset to original defaults
form.reset();

// Reset with new default values
form.reset({ email: 'default@example.com', name: '' });
```

Resetting clears all state (`isDirty`, `isTouched`, `isValid`, errors, submission state) and restores data to defaults.

```html
<button @click="form.reset()" type="button">Reset Form</button>
```

## Dirty Tracking

Since `isDirty` compares against defaults, changing a value back to its original will set `isDirty` back to `false`:

```js
// form starts with { name: 'John' }
form.setValue('name', 'Jane');
form.getFieldState('name').isDirty; // true
form.getFormState().isDirty; // true

form.setValue('name', 'John');
form.getFieldState('name').isDirty; // false
form.getFormState().isDirty; // false
```

Get only the fields that changed (useful for PATCH requests):

```js
form.getDirtyFields(); // { name: 'Jane' }  — only fields that differ from defaults
```

Get the current default values:

```js
form.getDefaults(); // { name: 'John', email: '' }
```
