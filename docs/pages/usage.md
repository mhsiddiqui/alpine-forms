# Usage

AlpineForm is initialized by creating a form object using the `Alpine.Form` method. This method takes two arguments: the
initial form data and configuration options.

## Creating a Form Object

```js
form_name: Alpine.Form(data, options)
```

Form name should be in snake case.

### Arguments

* data (Object): This can be an empty object {} or an object containing the initial form data.
* options (Object): Configuration options for form validation and behavior.

### Configuration Options

The options object supports the following properties:

1. schema (Joi Schema)
   Defines validation rules using Joi. If provided, AlpineForm will use this schema to validate form fields.

2. config (Object)
   Configures various behaviors of the form, including validation settings and event handling.

| Property                  | Type    | Default          | Description                                                          |
|---------------------------|---------|------------------|----------------------------------------------------------------------|
| `validationOnSubmit`      | Boolean | `false`          | If `true`, fields will only be validated when the form is submitted. |
| `validations`             | Object  | `{}`             | Custom validation rules for form fields.                             |
| `fieldChangeEventEnabled` | Boolean | `true`           | If `false`, field change events will not be emitted.                 |
| `fieldChangeEventName`    | String  | `'field-change'` | Custom event name for field change events.                           |
| `fieldChangeHasAllData`   | Boolean | `false`          | If `true`, the field change event will include all form data.        |

3. extras (Object)
   Any additional data that may be used when emitting events.

## Registering Fields

After you have created form, you need to register fields in that form

```html
<form @submit.prevent="form.submit(submitFunctionHandler)">
    <input x-register:form_name="form_name.field('field_1')" type="text" placeholder="Placeholder">
    <input x-register:form_name="form_name.field('field_2')" type="text" placeholder="Placeholder">
    <button>Save</button>
</form>
```