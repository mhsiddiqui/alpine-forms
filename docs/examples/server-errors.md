# Server-Side Errors

Handle validation errors returned from an API. Use `setError()` to display server errors on specific fields, `clearErrors()` to dismiss them, and `getErrors()` to read the current error state.

**What this example covers:**

- Setting server-side errors with `form.setError(field, message)`
- Clearing errors with `form.clearErrors()`
- Reading all errors with `form.getErrors()`
- Showing a loading state with `getFormState().isSubmitting`

## Live Demo

<iframe src="example.html?name=server-errors" width="100%" height="360" frameborder="0"></iframe>

## JavaScript

The `handleSubmit` callback simulates an API call. If the server returns an error, `setError()` attaches it to the relevant field. The form's `isSubmitting` state is managed automatically during async submissions.

<<< @/public/js/server-errors.js

## HTML

The submit button is disabled while the form is submitting, and its label changes to show a loading state. The state bar shows live error and submission state.

<<< @/public/examples/server-errors.tpl.html{html}

## API Reference

```js
form.setError('email', 'Already taken'); // Set error on a field
form.clearErrors('email'); // Clear one field
form.clearErrors(); // Clear all
form.getErrors(); // { email: 'Already taken' }
```
