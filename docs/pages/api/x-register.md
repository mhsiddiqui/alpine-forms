# x-register Directive

Binds a form field to a DOM element.

```html
<input x-register:formVar="formVar.field('fieldName')" type="text" />
```

- **Modifier** (`:formVar`): the variable name of the form object in `x-data`
- **Expression**: must evaluate to `{ name, extras }` (returned by `form.field()`)

The directive automatically:

- Binds the appropriate value/checked attribute
- Handles `@change` to call `setValue()`
- Handles `@blur` to call `touchField()`
- Calls `registerElement()` for focus-on-error support
- Dispatches field change events if enabled

## Supported Field Types

| Element                   | Types                                                                           | Value behavior                                                           |
| ------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `<input>`                 | text, email, password, number, date, tel, url, search, color, range, time, etc. | Binds `:value` and `@change`                                             |
| `<input type="checkbox">` | checkbox                                                                        | Binds `:checked` and `@change` (boolean value)                           |
| `<input type="radio">`    | radio                                                                           | Binds `:checked` and `@change` (sets value to radio's `value` attribute) |
| `<input type="file">`     | file                                                                            | Binds `@change` (stores `File` object, or `FileList` for `multiple`)     |
| `<textarea>`              | —                                                                               | Same as text input                                                       |
| `<select>`                | single                                                                          | Binds `:value` and `@change`                                             |
| `<select multiple>`       | multiple                                                                        | Binds `@change` (stores array of selected values)                        |

## Live Demo

Edit any field and see the live JSON output below.

[Field Types Demo](../../examples/example.html?name=field-types ':include :type=iframe width=100% height=580px')

## JavaScript

[field-types.js](../../js/field-types.js ':include :type=code js')

## HTML

[field-types.tpl.html](../../examples/field-types.tpl.html ':include :type=code html')

## Field Extras

Pass extra data with a field that gets included in change events:

```html
<input x-register:form="form.field('email', { section: 'contact' })" type="email" />
```
