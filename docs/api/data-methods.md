# Data Methods

## `setValue(field, value)`

Set a single field's value. Updates dirty state and triggers validation based on the current validation mode.

```js
form.setValue('email', 'user@example.com');
```

## `getValue(field?)`

Get a field value, or a copy of all form data.

```js
form.getValue('email'); // 'user@example.com'
form.getValue(); // { email: 'user@example.com', name: '' }
```

## `setValues(values)`

Set multiple field values at once. Runs a single validation pass instead of one per field.

```js
form.setValues({ email: 'a@b.com', name: 'John' });
```

## `field(name, extras?)`

Create a field descriptor for `x-register`. Optionally pass extras that are included in change events.

```js
form.field('email');
form.field('email', { section: 'contact' });
```

## `reset(newDefaults?)`

Reset form data to defaults and clear all state. Optionally set new defaults.

```js
form.reset(); // restore original defaults
form.reset({ email: '', name: '' }); // set and apply new defaults
```

Resetting clears all state (`isDirty`, `isTouched`, `isValid`, errors, submission state) and restores data to defaults.

## `getDefaults()`

Returns a copy of the current default values.

```js
form.getDefaults(); // { email: '', name: '' }
```

## `getDirtyFields()`

Returns an object containing only the fields whose current values differ from their defaults.

```js
form.getDirtyFields(); // { name: 'Jane' }
```
