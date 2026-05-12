# Error Methods

## `setError(field, message)`

Manually set an error on a field. Marks the field and form as invalid.

```js
form.setError('email', 'This email is already registered');
```

## `clearErrors(field?)`

Clear errors. Pass a field name to clear one field, or call with no arguments to clear all.

```js
form.clearErrors('email'); // clear one
form.clearErrors(); // clear all
```

## `getErrors()`

Returns a flat object of all current field errors.

```js
form.getErrors(); // { email: 'Required', password: 'Too short' }
```
