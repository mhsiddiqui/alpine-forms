# Configuration

Pass config options when creating a form:

```js
form: Alpine.Form(
    { name: '' },
    {
        config: {
            validationMode: 'onTouched',
            focusOnError: true,
            // ...
        },
    },
);
```

## Config Options

| Property                  | Type     | Default          | Description                                                       |
| ------------------------- | -------- | ---------------- | ----------------------------------------------------------------- |
| `validationMode`          | String   | `'onChange'`     | When to validate. See [Validation Modes](#validation-modes).      |
| `validationOnSubmit`      | Boolean  | `false`          | **Deprecated.** Use `validationMode: 'onSubmit'` instead.         |
| `validator`               | Function | `null`           | Schema validator function. See [Validation](pages/validation.md). |
| `validations`             | Object   | `{}`             | Per-field custom validation functions.                            |
| `fieldChangeEventEnabled` | Boolean  | `false`          | Dispatch a custom event when a field value changes.               |
| `fieldChangeEventName`    | String   | `'field-change'` | Name of the dispatched change event.                              |
| `fieldChangeHasAllData`   | Boolean  | `false`          | Include all form data in the change event payload.                |
| `focusOnError`            | Boolean  | `false`          | Auto-focus the first invalid field when submit fails validation.  |

## Validation Modes

The `validationMode` option controls when validation runs. If not set, the library falls back to the `validationOnSubmit` boolean for backward compatibility.

| Mode          | Validates on change | Validates on blur | Description                                                                                        |
| ------------- | :-----------------: | :---------------: | -------------------------------------------------------------------------------------------------- |
| `'onChange'`  |         Yes         |         -         | Validate every time a field value changes. This is the default.                                    |
| `'onBlur'`    |          -          |        Yes        | Validate when a field loses focus.                                                                 |
| `'onTouched'` |  After first blur   |        Yes        | Validate on blur. After a field has been touched, also validate on change. Best UX for most forms. |
| `'onSubmit'`  |          -          |         -         | Only validate when `submit()` is called.                                                           |
| `'all'`       |         Yes         |        Yes        | Validate on both change and blur.                                                                  |

### Example

```js
form: Alpine.Form(
    { email: '' },
    {
        config: {
            validationMode: 'onTouched',
            validations: {
                email: (value) => (!value ? { message: 'Required' } : undefined),
            },
        },
    },
);
```

With `'onTouched'`: the user can type freely without seeing errors. When they leave the field (blur), validation runs. After that, it also validates on every keystroke so the error clears as soon as the input is valid.

## Field Change Events

When `fieldChangeEventEnabled` is `true`, each field change dispatches a custom Alpine event:

```html
<div
    x-data="{ form: Alpine.Form({}, { config: { fieldChangeEventEnabled: true } }) }"
    @field-change.window="console.log($event.detail)"
>
    <input x-register:form="form.field('name')" type="text" />
</div>
```

The event `detail` contains:

```js
{
    field: 'name',
    type: 'change',
    value: 'current value',
    // ...extras from field() and form-level extras
}
```

Set `fieldChangeHasAllData: true` to also include `formData` (the full data object) in the payload.

## Focus on Error

When `focusOnError: true`, a failed `submit()` will automatically focus the first invalid field:

```js
form: Alpine.Form(
    { email: '', password: '' },
    {
        config: {
            focusOnError: true,
            validations: {
                email: (value) => (!value ? { message: 'Required' } : undefined),
                password: (value) => (!value ? { message: 'Required' } : undefined),
            },
        },
    },
);
```

Focus order follows the DOM order in which fields were registered with `x-register`.
