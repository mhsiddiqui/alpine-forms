# State Methods

## `getFormState()`

Returns the current form-level state.

```js
form.getFormState();
// { isValid, isValidating, isSubmitting, isSubmitted, isDirty, error }
```

| Property       | Type    | Description                                         |
| -------------- | ------- | --------------------------------------------------- |
| `isValid`      | Boolean | `false` if any field has a validation error         |
| `isValidating` | Boolean | `true` while async validators are running           |
| `isSubmitting` | Boolean | `true` between submit start and callback completion |
| `isSubmitted`  | Boolean | `true` after a successful submit                    |
| `isDirty`      | Boolean | `true` if any field value differs from its default  |
| `error`        | String  | Form-level error message (from failed submit)       |

## `getFieldState(field)`

Returns state for a specific field.

```js
form.getFieldState('email');
// { isValid, isDirty, isTouched, error }
```

| Property    | Type    | Description                                  |
| ----------- | ------- | -------------------------------------------- |
| `isValid`   | Boolean | `false` if field has a validation error      |
| `isDirty`   | Boolean | `true` if current value differs from default |
| `isTouched` | Boolean | `true` after the field has been blurred      |
| `error`     | String  | Validation error message for this field      |

## `setFormState(state)`

Merge state into form-level state. Mainly for internal use.

```js
form.setFormState({ error: 'Something went wrong' });
```

## `setFieldState(field, state)`

Merge state into a field's state. Mainly for internal use.

```js
form.setFieldState('email', { isTouched: true });
```

## `touchField(field)`

Mark a field as touched. Triggers validation if the validation mode includes blur. Called automatically by the `x-register` directive on blur.

```js
form.touchField('email');
```
