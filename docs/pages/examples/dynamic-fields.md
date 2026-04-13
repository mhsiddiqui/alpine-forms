# Dynamic Fields

Add or remove fields conditionally at runtime. Use `unregister()` to clean up a field's data and state when it is removed from the form.

**What this example covers:**

- Conditionally showing/hiding fields with `x-show`
- Unregistering fields with `form.unregister()`
- Reading live form data with `form.getValue()`

## Live Demo

[Dynamic Fields Demo](../../examples/example.html?name=dynamic-fields ':include :type=iframe width=100% height=320px')

## JavaScript

The phone field starts registered but gets unregistered when the checkbox is toggled off. Unregistering removes the field from the form data and state entirely.

[dynamic-fields.js](../../js/dynamic-fields.js ':include :type=code js')

## HTML

The phone input uses both `x-show` (to hide visually) and `x-register` (to bind to the form). When `showPhone` is false, `unregister('phone')` is called to remove it from the form.

[dynamic-fields.tpl.html](../../examples/dynamic-fields.tpl.html ':include :type=code html')

## Dynamic Schema with `updateSchema()`

If using a schema validator like Joi, you can add or remove schema rules dynamically:

```js
form.updateSchema({ phone: joi.string().required() }); // add
form.updateSchema({}, ['phone']); // remove
```
