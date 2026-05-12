# Registration

## `registerElement(field, el)`

Store a DOM element reference for a field. Called automatically by the `x-register` directive. Used by `focusFirstError()`.

## `unregister(field)`

Remove a field entirely — clears its data, state, schema entry, default value, and DOM reference.

```js
form.unregister('conditionalField');
```

## `focusFirstError()`

Focus the first invalid field's DOM element (in DOM registration order).

```js
form.focusFirstError();
```

## `updateSchema(addition?, removal?)`

Dynamically modify the validation schema.

```js
// Add fields to schema
form.updateSchema({ phone: joi.string().required() });

// Remove fields from schema (also removes data and state)
form.updateSchema({}, ['phone']);

// Both at once
form.updateSchema({ newField: joi.string() }, ['oldField']);
```
