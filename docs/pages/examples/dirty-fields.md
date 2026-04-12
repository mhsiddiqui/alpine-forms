# Dirty Fields & PATCH Requests

Track which fields have changed since the last save and send only the modified data to the server. The save button is disabled when no changes have been made.

**What this example covers:**

- Getting only changed fields with `form.getDirtyFields()`
- Per-field dirty tracking with `getFieldState().isDirty`
- Form-level dirty state with `getFormState().isDirty`
- Disabling submit when nothing changed
- Resetting defaults after save

## Live Demo

[Dirty Fields Demo](../../examples/example.html?name=dirty-fields ':include :type=iframe width=100% height=440px')

## JavaScript

`getDirtyFields()` returns an object with only the fields that differ from their defaults. After a successful save, call `reset()` with the current values to make them the new baseline.

[dirty-fields.js](../../js/dirty-fields.js ':include :type=code js')

## HTML

Each field label shows a "modified" badge when dirty. The submit button is disabled via `:disabled="!form.getFormState().isDirty"`. A live preview of dirty fields is shown below the form.

[dirty-fields.tpl.html](../../examples/dirty-fields.tpl.html ':include :type=code html')

## How Dirty Tracking Works

`isDirty` compares against defaults — changing a value back to its original clears the flag:

```js
// form starts with { name: 'John' }
form.setValue('name', 'Jane');
form.getFieldState('name').isDirty; // true

form.setValue('name', 'John');
form.getFieldState('name').isDirty; // false  (back to default)
```
