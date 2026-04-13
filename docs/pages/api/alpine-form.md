# Alpine.Form()

Creates a form instance. Returns a plain object designed to be used inside `x-data`.

```js
form: Alpine.Form(data, options);
```

**Arguments:**

| Name             | Type   | Default | Description                                                    |
| ---------------- | ------ | ------- | -------------------------------------------------------------- |
| `data`           | Object | —       | Initial field values                                           |
| `options.schema` | Object | `{}`    | Schema for validator function                                  |
| `options.config` | Object | `{}`    | Config overrides (see [Configuration](pages/configuration.md)) |
| `options.extras` | Object | `{}`    | Extra data included in field change events                     |

**Example:**

```js
Alpine.data('myComponent', () => ({
    form: Alpine.Form(
        { name: '', email: '' },
        {
            schema: {
                /* Joi schema rules */
            },
            config: {
                validationMode: 'onTouched',
                validations: {
                    /* per-field functions */
                },
            },
            extras: { formId: 'signup' },
        },
    ),
}));
```
