# Basic Form (Joi Validation)

A login form with email and password fields validated using a Joi schema. Errors are displayed inline beneath each field. On successful submission, the form data is shown as JSON.

**What this example covers:**

- Creating a form with `Alpine.Form()` and a Joi schema
- Registering fields with `x-register`
- Displaying field errors with `getFieldState()`
- Handling submission with `form.submit()`
- Resetting the form with `form.reset()`

## Live Demo

[Basic Form Demo](../../examples/example.html?name=basic&libs=joi ':include :type=iframe width=100% height=340px')

## JavaScript

Create the form with a Joi schema and pass `joiValidator` as the validator. The `submitFunction` receives the validated data on successful submission.

[basic.js](../../js/basic.js ':include :type=code js')

## HTML

Each input is registered to the form using `x-register:form`. The directive value (`:form`) references the form object, and the expression (`form.field('email')`) identifies the field name. Error messages are shown conditionally using `x-show` and `x-text` bound to `getFieldState()`.

[basic.tpl.html](../../examples/basic.tpl.html ':include :type=code html')
