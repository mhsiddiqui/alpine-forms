# Validation Modes

Control when validation runs using the `validationMode` config option. Alpine Forms supports five modes that determine when error messages appear — on every keystroke, on blur, after first touch, only on submit, or all at once.

**What this example covers:**

- Setting `validationMode` in config
- Switching modes at runtime via `config.validationMode`
- Reading form and field state (`isValid`, `isDirty`, `isTouched`)
- Resetting the form after mode change

## Live Demo

<iframe src="example.html?name=validation-modes" width="100%" height="380" frameborder="0"></iframe>

## How Each Mode Works

| Mode        | Validates on change | Validates on blur | Description                                               |
| ----------- | :-----------------: | :---------------: | --------------------------------------------------------- |
| `onChange`  |         Yes         |         -         | Errors appear immediately as you type.                    |
| `onBlur`    |          -          |        Yes        | Errors appear only when you tab out of a field.           |
| `onTouched` |  After first blur   |        Yes        | Best UX: errors appear on blur, then update in real-time. |
| `onSubmit`  |          -          |         -         | No errors until you click submit.                         |
| `all`       |         Yes         |        Yes        | Validates on both events.                                 |

## JavaScript

The mode is set via `config.validationMode`. You can change it at runtime by updating `form.config.validationMode` and calling `form.reset()`.

<<< @/public/js/validation-modes.js

## HTML

The state bar at the bottom shows live form and field state values so you can observe how each mode behaves.

<<< @/public/examples/validation-modes.tpl.html{html}
