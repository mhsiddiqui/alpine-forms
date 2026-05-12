# Dynamic Fields

Add or remove fields conditionally at runtime. Use `unregister()` to clean up a field's data and state when it is removed from the form.

**What this example covers:**

- Conditionally showing/hiding fields with `x-show`
- Unregistering fields with `form.unregister()`
- Reading live form data with `form.getValue()`

## Live Demo

<iframe src="example.html?name=dynamic-fields" width="100%" height="320" frameborder="0"></iframe>

## JavaScript

The phone field starts registered but gets unregistered when the checkbox is toggled off. Unregistering removes the field from the form data and state entirely.

<<< @/public/js/dynamic-fields.js

## HTML

The phone input uses both `x-show` (to hide visually) and `x-register` (to bind to the form). When `showPhone` is false, `unregister('phone')` is called to remove it from the form.

<<< @/public/examples/dynamic-fields.tpl.html{html}

## Dynamic Schema with `updateSchema()`

If using a schema validator like Joi, you can add or remove schema rules dynamically:

```js
form.updateSchema({ phone: joi.string().required() }); // add
form.updateSchema({}, ['phone']); // remove
```
