# Reset Form

Reset form data back to defaults and clear all validation state. Optionally pass new defaults to `reset()` to update what the form resets to — useful after a successful save.

**What this example covers:**

- Resetting to defaults with `form.reset()`
- Updating defaults with `form.reset(newDefaults)`
- Reading defaults with `form.getDefaults()`
- Showing dirty badges per field with `getFieldState().isDirty`

## Live Demo

<iframe src="example.html?name=reset" width="100%" height="300" frameborder="0"></iframe>

## JavaScript

After a successful save, `reset()` is called with the submitted data as new defaults. This makes the saved values the new baseline for dirty tracking.

<<< @/public/js/reset.js

## HTML

Each field label shows a "modified" badge when the field is dirty. The state bar displays the current dirty state, submission state, and default values.

<<< @/public/examples/reset.tpl.html{html}

## API Reference

```js
form.reset(); // restore original defaults
form.reset({ email: '', name: '' }); // set and apply new defaults
form.getDefaults(); // read current defaults
```

Resetting clears all state (`isDirty`, `isTouched`, `isValid`, errors, submission state) and restores data to defaults.
