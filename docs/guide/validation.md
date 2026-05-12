# Validation

Alpine-Forms supports three validation approaches that can be used together:

1. **Schema validation** — via a validator function (e.g., `joiValidator`)
2. **Custom validation** — per-field functions defined in config
3. **Manual errors** — set errors programmatically (e.g., from server responses)

## Custom Validation (No Dependencies)

The simplest approach. Define validation functions in `config.validations`. Each function receives the field value and the full form data, and returns `undefined` for valid or `{ message: '...' }` for invalid:

```js
form: Alpine.Form(
    { email: '', password: '', confirmPassword: '' },
    {
        config: {
            validations: {
                email(value) {
                    if (!value) return { message: 'Email is required' };
                    if (!value.includes('@')) return { message: 'Invalid email' };
                },
                password(value) {
                    if (!value) return { message: 'Password is required' };
                    if (value.length < 8) return { message: 'Must be at least 8 characters' };
                },
                // Cross-field validation: second argument is the full form data
                confirmPassword(value, data) {
                    if (value !== data.password) return { message: 'Passwords do not match' };
                },
            },
        },
    },
);
```

### Return Values

| Return                      | Meaning                             |
| --------------------------- | ----------------------------------- |
| `undefined`                 | Field is valid                      |
| `{ message: 'Error text' }` | Field is invalid, show this message |

## Async Validation

Custom validators can return a `Promise` for async checks like API calls:

```js
validations: {
    username(value) {
        if (!value) return { message: 'Required' };
        // Return a Promise for async validation
        return fetch(`/api/check-username?q=${value}`)
            .then(res => res.json())
            .then(result => {
                if (result.taken) return { message: 'Username already taken' };
            });
    }
}
```

While async validators are running, `form.getFormState().isValidating` is `true`:

```html
<span x-show="form.getFormState().isValidating">Checking...</span>
```

Async validation handles race conditions automatically. If a newer validation starts before a previous one finishes, the stale result is discarded.

## Schema Validation with Joi

If you prefer declarative schema validation, you can use Joi with the built-in `joiValidator` helper.

> **Important:** Joi is not bundled with Alpine-Forms. You must install it separately. See [Installation](/guide/installation#using-joi-optional).

```js
form: Alpine.Form(
    {},
    {
        schema: {
            email: joi.string().email().required().messages({
                'string.email': 'Please enter a valid email',
                'any.required': 'Email is required',
            }),
            age: joi.number().min(18).max(120).required(),
        },
        config: {
            validator: joiValidator,
        },
    },
);
```

The `validator` function receives `(schema, data)` and must return:

```js
{
    errors: [
        { field: 'email', message: 'Please enter a valid email' },
    ],
    value: { /* validated/coerced data */ }
}
```

### Writing a Custom Validator

You can write your own validator function that follows the same interface. For example, using [Zod](https://zod.dev/):

```js
function zodValidator(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return { errors: [], value: result.data };
    }
    const errors = result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
    }));
    return { errors, value: data };
}
```

Then use it:

```js
import { z } from 'zod';

const schema = z.object({
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be 18+'),
});

form: Alpine.Form(
    {},
    {
        schema: schema,
        config: { validator: zodValidator },
    },
);
```

## Combining Schema and Custom Validation

Schema validation runs first. Custom validations only run on fields that passed schema validation:

```js
form: Alpine.Form(
    {},
    {
        schema: {
            email: joi.string().email().required(),
        },
        config: {
            validator: joiValidator,
            validations: {
                // Only runs if Joi's email validation passed
                email(value) {
                    if (value.endsWith('@blocked.com')) {
                        return { message: 'This email domain is not allowed' };
                    }
                },
            },
        },
    },
);
```

## Manual Errors

Set errors programmatically, e.g., from a server response:

```js
async handleSubmit(data) {
    const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const body = await res.json();
        // Set server-side validation errors
        for (const [field, message] of Object.entries(body.errors)) {
            this.form.setError(field, message);
        }
    }
}
```

Clear errors manually:

```js
// Clear a single field's error
form.clearErrors('email');

// Clear all errors
form.clearErrors();
```

Get all current errors as a flat object:

```js
form.getErrors();
// { email: 'Already taken', password: 'Too short' }
```

## Validate a Single Field

Run validation for just one field without validating the entire form:

```js
await form.validateField('email');
// Returns true if the field is valid, false otherwise
```

This runs both schema and custom validation for the specified field, and updates the form-level `isValid` state accordingly.
