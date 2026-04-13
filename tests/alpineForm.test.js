import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlpineForm } from '../src/alpineForm.js';

describe('AlpineForm', () => {
    let form;

    beforeEach(() => {
        form = AlpineForm({ name: '', email: '' });
    });

    // ─── Constructor ─────────────────────────────────────────

    describe('constructor', () => {
        it('initializes with provided data', () => {
            const f = AlpineForm({ name: 'John', age: 30 });
            expect(f.data).toEqual({ name: 'John', age: 30 });
        });

        it('stores a deep clone of data as defaults', () => {
            const f = AlpineForm({ name: 'John' });
            f.data.name = 'Jane';
            expect(f._defaults).toEqual({ name: 'John' });
        });

        it('uses default config when none provided', () => {
            expect(form.config.validationMode).toBeNull();
            expect(form.config.validator).toBeNull();
            expect(form.config.validations).toEqual({});
            expect(form.config.fieldChangeEventEnabled).toBe(false);
            expect(form.config.focusOnError).toBe(false);
        });

        it('merges user config with defaults', () => {
            const f = AlpineForm(
                {},
                {
                    config: { validationMode: 'onBlur', focusOnError: true },
                },
            );
            expect(f.config.validationMode).toBe('onBlur');
            expect(f.config.focusOnError).toBe(true);
            expect(f.config.fieldChangeEventEnabled).toBe(false);
        });

        it('initializes with empty schema when not provided', () => {
            expect(form.schema).toEqual({});
        });

        it('stores provided schema', () => {
            const schema = { name: 'rule' };
            const f = AlpineForm({}, { schema });
            expect(f.schema).toEqual(schema);
        });

        it('stores provided extras', () => {
            const f = AlpineForm({}, { extras: { formId: 'signup' } });
            expect(f.extras).toEqual({ formId: 'signup' });
        });

        it('initializes form state with defaults', () => {
            expect(form.getFormState()).toEqual({
                isValid: true,
                isValidating: false,
                isSubmitting: false,
                isSubmitted: false,
                isDirty: false,
                error: '',
            });
        });

        it('initializes with empty fields state', () => {
            expect(form.state.fields).toEqual({});
        });
    });

    // ─── setValue / getValue ──────────────────────────────────

    describe('setValue', () => {
        it('sets a field value', () => {
            form.setValue('name', 'John');
            expect(form.data.name).toBe('John');
        });

        it('marks field as dirty when value differs from default', () => {
            form.setValue('name', 'John');
            expect(form.getFieldState('name').isDirty).toBe(true);
        });

        it('marks field as not dirty when value matches default', () => {
            form.setValue('name', 'John');
            form.setValue('name', '');
            expect(form.getFieldState('name').isDirty).toBe(false);
        });

        it('updates form-level dirty state', () => {
            form.setValue('name', 'John');
            expect(form.getFormState().isDirty).toBe(true);
        });

        it('clears form-level dirty when all fields match defaults', () => {
            form.setValue('name', 'John');
            form.setValue('name', '');
            expect(form.getFormState().isDirty).toBe(false);
        });
    });

    describe('getValue', () => {
        it('returns a single field value', () => {
            form.data.name = 'John';
            expect(form.getValue('name')).toBe('John');
        });

        it('returns empty string for undefined field', () => {
            expect(form.getValue('nonexistent')).toBe('');
        });

        it('returns a copy of all data when no argument', () => {
            form.data.name = 'John';
            form.data.email = 'john@example.com';
            const value = form.getValue();
            expect(value).toEqual({ name: 'John', email: 'john@example.com' });
            value.name = 'changed';
            expect(form.data.name).toBe('John');
        });
    });

    // ─── setValues ───────────────────────────────────────────

    describe('setValues', () => {
        it('sets multiple field values', () => {
            form.setValues({ name: 'John', email: 'john@test.com' });
            expect(form.data.name).toBe('John');
            expect(form.data.email).toBe('john@test.com');
        });

        it('updates dirty state for each field', () => {
            form.setValues({ name: 'John', email: '' });
            expect(form.getFieldState('name').isDirty).toBe(true);
            expect(form.getFieldState('email').isDirty).toBe(false);
        });

        it('updates form-level dirty state', () => {
            form.setValues({ name: 'John' });
            expect(form.getFormState().isDirty).toBe(true);
        });
    });

    // ─── field ───────────────────────────────────────────────

    describe('field', () => {
        it('returns a field descriptor with name', () => {
            const desc = form.field('email');
            expect(desc).toEqual({ name: 'email', extras: {} });
        });

        it('includes extras when provided', () => {
            const desc = form.field('email', { section: 'contact' });
            expect(desc).toEqual({ name: 'email', extras: { section: 'contact' } });
        });
    });

    // ─── reset ───────────────────────────────────────────────

    describe('reset', () => {
        it('restores data to original defaults', () => {
            form.setValue('name', 'John');
            form.reset();
            expect(form.data.name).toBe('');
            expect(form.data.email).toBe('');
        });

        it('clears all form state', () => {
            form.setFormState({ isSubmitting: true, isDirty: true, error: 'fail' });
            form.reset();
            expect(form.getFormState()).toEqual({
                isValid: true,
                isValidating: false,
                isSubmitting: false,
                isSubmitted: false,
                isDirty: false,
                error: '',
            });
        });

        it('clears all field state', () => {
            form.setFieldState('name', { isDirty: true, isTouched: true });
            form.reset();
            expect(form.state.fields).toEqual({});
        });

        it('accepts new defaults', () => {
            form.reset({ name: 'Jane', email: 'jane@test.com' });
            expect(form.data.name).toBe('Jane');
            expect(form.data.email).toBe('jane@test.com');
            expect(form.getDefaults()).toEqual({ name: 'Jane', email: 'jane@test.com' });
        });

        it('new defaults are deep cloned', () => {
            const newDefaults = { name: 'Jane', email: 'jane@test.com' };
            form.reset(newDefaults);
            newDefaults.name = 'mutated';
            expect(form.getDefaults().name).toBe('Jane');
        });
    });

    // ─── getDefaults / getDirtyFields ────────────────────────

    describe('getDefaults', () => {
        it('returns a copy of defaults', () => {
            const defaults = form.getDefaults();
            defaults.name = 'mutated';
            expect(form._defaults.name).toBe('');
        });
    });

    describe('getDirtyFields', () => {
        it('returns empty object when nothing changed', () => {
            expect(form.getDirtyFields()).toEqual({});
        });

        it('returns only changed fields', () => {
            form.setValue('name', 'John');
            expect(form.getDirtyFields()).toEqual({ name: 'John' });
        });

        it('excludes fields reset to default', () => {
            form.setValue('name', 'John');
            form.setValue('name', '');
            expect(form.getDirtyFields()).toEqual({});
        });
    });

    // ─── State Methods ───────────────────────────────────────

    describe('setFormState / getFormState', () => {
        it('merges partial state', () => {
            form.setFormState({ isSubmitting: true });
            expect(form.getFormState().isSubmitting).toBe(true);
            expect(form.getFormState().isValid).toBe(true);
        });
    });

    describe('setFieldState / getFieldState', () => {
        it('returns default state for unknown field', () => {
            expect(form.getFieldState('unknown')).toEqual({
                isValid: true,
                isDirty: false,
                isTouched: false,
                error: '',
            });
        });

        it('merges partial field state', () => {
            form.setFieldState('name', { isTouched: true });
            expect(form.getFieldState('name').isTouched).toBe(true);
            expect(form.getFieldState('name').isValid).toBe(true);
        });
    });

    describe('touchField', () => {
        it('marks a field as touched', () => {
            form.touchField('name');
            expect(form.getFieldState('name').isTouched).toBe(true);
        });

        it('triggers validation when mode is onBlur', () => {
            const validation = vi.fn();
            const f = AlpineForm(
                { name: '' },
                {
                    config: {
                        validationMode: 'onBlur',
                        validations: { name: validation },
                    },
                },
            );
            f.touchField('name');
            expect(validation).toHaveBeenCalled();
        });

        it('triggers validation when mode is onTouched', () => {
            const validation = vi.fn();
            const f = AlpineForm(
                { name: '' },
                {
                    config: {
                        validationMode: 'onTouched',
                        validations: { name: validation },
                    },
                },
            );
            f.touchField('name');
            expect(validation).toHaveBeenCalled();
        });

        it('does not trigger validation when mode is onChange', () => {
            const validation = vi.fn();
            const f = AlpineForm(
                { name: '' },
                {
                    config: {
                        validationMode: 'onChange',
                        validations: { name: validation },
                    },
                },
            );
            f.touchField('name');
            expect(validation).not.toHaveBeenCalled();
        });

        it('does not trigger validation when mode is onSubmit', () => {
            const validation = vi.fn();
            const f = AlpineForm(
                { name: '' },
                {
                    config: {
                        validationMode: 'onSubmit',
                        validations: { name: validation },
                    },
                },
            );
            f.touchField('name');
            expect(validation).not.toHaveBeenCalled();
        });
    });

    // ─── Error Methods ───────────────────────────────────────

    describe('setError', () => {
        it('sets an error on a field', () => {
            form.setError('email', 'Already taken');
            expect(form.getFieldState('email').isValid).toBe(false);
            expect(form.getFieldState('email').error).toBe('Already taken');
        });

        it('marks form as invalid', () => {
            form.setError('email', 'Already taken');
            expect(form.getFormState().isValid).toBe(false);
        });
    });

    describe('clearErrors', () => {
        it('clears a single field error', () => {
            form.setError('email', 'Error');
            form.setError('name', 'Error');
            form.clearErrors('email');
            expect(form.getFieldState('email').isValid).toBe(true);
            expect(form.getFieldState('email').error).toBe('');
            expect(form.getFieldState('name').isValid).toBe(false);
        });

        it('clears all errors when no argument', () => {
            form.setError('email', 'Error');
            form.setError('name', 'Error');
            form.clearErrors();
            expect(form.getFieldState('email').isValid).toBe(true);
            expect(form.getFieldState('name').isValid).toBe(true);
            expect(form.getFormState().isValid).toBe(true);
        });
    });

    describe('getErrors', () => {
        it('returns empty object when no errors', () => {
            expect(form.getErrors()).toEqual({});
        });

        it('returns all field errors', () => {
            form.setError('email', 'Required');
            form.setError('name', 'Too short');
            expect(form.getErrors()).toEqual({ email: 'Required', name: 'Too short' });
        });

        it('excludes valid fields', () => {
            form.setError('email', 'Required');
            form.setFieldState('name', { isValid: true });
            expect(form.getErrors()).toEqual({ email: 'Required' });
        });
    });

    // ─── Validation ──────────────────────────────────────────

    describe('runValidations', () => {
        it('returns true when no validations configured', async () => {
            const result = await form.runValidations();
            expect(result).toBe(true);
        });

        it('runs custom validations and marks invalid fields', async () => {
            const f = AlpineForm(
                { email: '' },
                {
                    config: {
                        validations: {
                            email(value) {
                                if (!value) return { message: 'Required' };
                            },
                        },
                    },
                },
            );
            const result = await f.runValidations();
            expect(result).toBe(false);
            expect(f.getFieldState('email').isValid).toBe(false);
            expect(f.getFieldState('email').error).toBe('Required');
        });

        it('passes when custom validation returns undefined', async () => {
            const f = AlpineForm(
                { email: 'test@test.com' },
                {
                    config: {
                        validations: {
                            email(value) {
                                if (!value) return { message: 'Required' };
                            },
                        },
                    },
                },
            );
            const result = await f.runValidations();
            expect(result).toBe(true);
        });

        it('passes form data as second argument to custom validators', async () => {
            const validation = vi.fn();
            const f = AlpineForm(
                { email: 'test', password: '123' },
                {
                    config: { validations: { email: validation } },
                },
            );
            await f.runValidations();
            expect(validation).toHaveBeenCalledWith('test', { email: 'test', password: '123' });
        });

        it('resets all errors before running', async () => {
            const f = AlpineForm(
                { email: '' },
                {
                    config: {
                        validations: {
                            email() {
                                return { message: 'Error' };
                            },
                        },
                    },
                },
            );
            f.setError('email', 'Old error');
            await f.runValidations();
            expect(f.getFieldState('email').error).toBe('Error');
        });

        it('runs schema validation via validator function', async () => {
            const mockValidator = vi.fn(() => ({
                errors: [{ field: 'email', message: 'Invalid email' }],
                value: { email: '' },
            }));
            const f = AlpineForm(
                { email: '' },
                {
                    schema: { email: 'some-rule' },
                    config: { validator: mockValidator },
                },
            );
            const result = await f.runValidations();
            expect(result).toBe(false);
            expect(mockValidator).toHaveBeenCalledWith({ email: 'some-rule' }, { email: '' });
            expect(f.getFieldState('email').error).toBe('Invalid email');
        });

        it('skips custom validation for fields that failed schema validation', async () => {
            const customValidation = vi.fn();
            const f = AlpineForm(
                { email: '' },
                {
                    schema: { email: 'rule' },
                    config: {
                        validator: () => ({
                            errors: [{ field: 'email', message: 'Schema error' }],
                            value: { email: '' },
                        }),
                        validations: { email: customValidation },
                    },
                },
            );
            await f.runValidations();
            expect(customValidation).not.toHaveBeenCalled();
        });

        it('handles async custom validations', async () => {
            const f = AlpineForm(
                { username: 'admin' },
                {
                    config: {
                        validations: {
                            username(value) {
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        if (value === 'admin') resolve({ message: 'Taken' });
                                        else resolve(undefined);
                                    }, 10);
                                });
                            },
                        },
                    },
                },
            );
            const result = await f.runValidations();
            expect(result).toBe(false);
            expect(f.getFieldState('username').error).toBe('Taken');
        });

        it('sets isValidating during async validation', async () => {
            let resolveValidation;
            const f = AlpineForm(
                { name: '' },
                {
                    config: {
                        validations: {
                            name() {
                                return new Promise((r) => {
                                    resolveValidation = r;
                                });
                            },
                        },
                    },
                },
            );
            const promise = f.runValidations();
            expect(f.getFormState().isValidating).toBe(true);
            resolveValidation(undefined);
            await promise;
            expect(f.getFormState().isValidating).toBe(false);
        });

        it('discards stale async validation results', async () => {
            let resolveFirst;
            let callCount = 0;
            const f = AlpineForm(
                { name: '' },
                {
                    config: {
                        validations: {
                            name() {
                                callCount++;
                                if (callCount === 1) {
                                    return new Promise((r) => {
                                        resolveFirst = r;
                                    });
                                }
                                return undefined;
                            },
                        },
                    },
                },
            );
            const first = f.runValidations();
            const second = f.runValidations();
            resolveFirst({ message: 'Stale error' });
            await first;
            await second;
            expect(f.getFieldState('name').isValid).toBe(true);
        });

        it('applies coerced values from schema validator', async () => {
            const f = AlpineForm(
                { age: '25' },
                {
                    schema: { age: 'number-rule' },
                    config: {
                        validator: () => ({
                            errors: [],
                            value: { age: 25 },
                        }),
                    },
                },
            );
            await f.runValidations();
            expect(f.data.age).toBe(25);
        });
    });

    describe('validateField', () => {
        it('validates a single field', async () => {
            const f = AlpineForm(
                { email: '', name: '' },
                {
                    config: {
                        validations: {
                            email(value) {
                                if (!value) return { message: 'Required' };
                            },
                            name(value) {
                                if (!value) return { message: 'Required' };
                            },
                        },
                    },
                },
            );
            const result = await f.validateField('email');
            expect(result).toBe(false);
            expect(f.getFieldState('email').error).toBe('Required');
        });

        it('updates form-level isValid based on all fields', async () => {
            const f = AlpineForm(
                { email: '', name: 'John' },
                {
                    config: {
                        validations: {
                            email(value) {
                                if (!value) return { message: 'Required' };
                            },
                        },
                    },
                },
            );
            await f.validateField('email');
            expect(f.getFormState().isValid).toBe(false);
        });

        it('returns true for valid field', async () => {
            const f = AlpineForm(
                { email: 'test@test.com' },
                {
                    config: {
                        validations: {
                            email(value) {
                                if (!value) return { message: 'Required' };
                            },
                        },
                    },
                },
            );
            const result = await f.validateField('email');
            expect(result).toBe(true);
        });

        it('handles async field validation', async () => {
            const f = AlpineForm(
                { username: 'admin' },
                {
                    config: {
                        validations: {
                            username(value) {
                                return Promise.resolve(
                                    value === 'admin' ? { message: 'Taken' } : undefined,
                                );
                            },
                        },
                    },
                },
            );
            const result = await f.validateField('username');
            expect(result).toBe(false);
            expect(f.getFieldState('username').error).toBe('Taken');
        });

        it('runs schema validation for the field', async () => {
            const f = AlpineForm(
                { email: '' },
                {
                    schema: { email: 'rule' },
                    config: {
                        validator: () => ({
                            errors: [{ field: 'email', message: 'Schema error' }],
                            value: { email: '' },
                        }),
                    },
                },
            );
            const result = await f.validateField('email');
            expect(result).toBe(false);
            expect(f.getFieldState('email').error).toBe('Schema error');
        });
    });

    // ─── Validation Modes on setValue ─────────────────────────

    describe('validation modes on setValue', () => {
        function formWithMode(mode) {
            return AlpineForm(
                { name: '' },
                {
                    config: {
                        validationMode: mode,
                        validations: {
                            name(value) {
                                if (!value) return { message: 'Required' };
                            },
                        },
                    },
                },
            );
        }

        it('onChange: validates on setValue', () => {
            const f = formWithMode('onChange');
            f.setValue('name', '');
            expect(f.getFieldState('name').isValid).toBe(false);
        });

        it('onSubmit: does not validate on setValue', () => {
            const f = formWithMode('onSubmit');
            f.setValue('name', '');
            expect(f.getFieldState('name').isValid).toBe(true);
        });

        it('onBlur: does not validate on setValue', () => {
            const f = formWithMode('onBlur');
            f.setValue('name', '');
            expect(f.getFieldState('name').isValid).toBe(true);
        });

        it('onTouched: does not validate on setValue before touch', () => {
            const f = formWithMode('onTouched');
            f.setValue('name', '');
            expect(f.getFieldState('name').isValid).toBe(true);
        });

        it('onTouched: validates on setValue after touch', () => {
            const f = formWithMode('onTouched');
            f.touchField('name');
            f.setValue('name', 'x');
            f.setValue('name', '');
            expect(f.getFieldState('name').isValid).toBe(false);
        });

        it('all: validates on setValue', () => {
            const f = formWithMode('all');
            f.setValue('name', '');
            expect(f.getFieldState('name').isValid).toBe(false);
        });

        it('defaults to onChange when validationMode is null', () => {
            const f = AlpineForm(
                { name: '' },
                {
                    config: {
                        validations: {
                            name(value) {
                                if (!value) return { message: 'Required' };
                            },
                        },
                    },
                },
            );
            f.setValue('name', '');
            expect(f.getFieldState('name').isValid).toBe(false);
        });

        it('falls back to onSubmit when validationOnSubmit is true', () => {
            const f = AlpineForm(
                { name: '' },
                {
                    config: {
                        validationOnSubmit: true,
                        validations: {
                            name(value) {
                                if (!value) return { message: 'Required' };
                            },
                        },
                    },
                },
            );
            f.setValue('name', '');
            expect(f.getFieldState('name').isValid).toBe(true);
        });
    });

    // ─── Submit ──────────────────────────────────────────────

    describe('submit', () => {
        it('calls callback with data when form is valid', async () => {
            const callback = vi.fn();
            form.data.name = 'John';
            await form.submit(callback);
            expect(callback).toHaveBeenCalledWith(form.data);
        });

        it('does not call callback when form is invalid', async () => {
            const callback = vi.fn();
            const f = AlpineForm(
                { email: '' },
                {
                    config: {
                        validations: {
                            email(value) {
                                if (!value) return { message: 'Required' };
                            },
                        },
                    },
                },
            );
            await f.submit(callback);
            expect(callback).not.toHaveBeenCalled();
        });

        it('sets isSubmitting during submission', async () => {
            let submittingState;
            const callback = vi.fn(() => {
                submittingState = form.getFormState().isSubmitting;
            });
            await form.submit(callback);
            expect(submittingState).toBe(true);
            expect(form.getFormState().isSubmitting).toBe(false);
        });

        it('sets isSubmitted on success', async () => {
            await form.submit(vi.fn());
            expect(form.getFormState().isSubmitted).toBe(true);
        });

        it('captures error message on callback failure', async () => {
            await form.submit(() => {
                throw new Error('Network error');
            });
            expect(form.getFormState().error).toBe('Network error');
            expect(form.getFormState().isValid).toBe(false);
            expect(form.getFormState().isSubmitted).toBe(false);
        });

        it('uses fallback error message when error has no message', async () => {
            await form.submit(() => {
                throw {};
            });
            expect(form.getFormState().error).toBe('There was an error while submitting your form');
        });

        it('clears previous submission state', async () => {
            await form.submit(vi.fn());
            expect(form.getFormState().isSubmitted).toBe(true);
            const f2 = AlpineForm(
                { email: '' },
                {
                    config: {
                        validations: {
                            email() {
                                return { message: 'Error' };
                            },
                        },
                    },
                },
            );
            f2.setFormState({ isSubmitted: true });
            await f2.submit(vi.fn());
            expect(f2.getFormState().isSubmitted).toBe(false);
        });

        it('calls callback with _component context when available', async () => {
            const component = { name: 'myComponent' };
            form._component = component;
            let callContext;
            await form.submit(function () {
                callContext = this;
            });
            expect(callContext).toBe(component);
        });

        it('handles async callbacks', async () => {
            let resolved = false;
            await form.submit(async () => {
                await new Promise((r) => setTimeout(r, 10));
                resolved = true;
            });
            expect(resolved).toBe(true);
            expect(form.getFormState().isSubmitted).toBe(true);
        });

        it('calls focusFirstError when focusOnError is enabled and form is invalid', async () => {
            const el = { focus: vi.fn() };
            const f = AlpineForm(
                { email: '' },
                {
                    config: {
                        focusOnError: true,
                        validations: {
                            email() {
                                return { message: 'Required' };
                            },
                        },
                    },
                },
            );
            f.registerElement('email', el);
            await f.submit(vi.fn());
            expect(el.focus).toHaveBeenCalled();
        });
    });

    // ─── Registration ────────────────────────────────────────

    describe('registerElement', () => {
        it('stores element reference', () => {
            const el = document.createElement('input');
            form.registerElement('name', el);
            expect(form._fieldElements.name).toBe(el);
        });
    });

    describe('unregister', () => {
        it('removes data, state, schema, defaults, and element', () => {
            form.data.name = 'John';
            form.setFieldState('name', { isTouched: true });
            form.schema.name = 'rule';
            form._defaults.name = '';
            form.registerElement('name', document.createElement('input'));

            form.unregister('name');

            expect(form.data.name).toBeUndefined();
            expect(form.state.fields.name).toBeUndefined();
            expect(form.schema.name).toBeUndefined();
            expect(form._defaults.name).toBeUndefined();
            expect(form._fieldElements.name).toBeUndefined();
        });
    });

    describe('focusFirstError', () => {
        it('focuses the first invalid field', () => {
            const el1 = { focus: vi.fn() };
            const el2 = { focus: vi.fn() };
            form.registerElement('name', el1);
            form.registerElement('email', el2);
            form.setFieldState('name', { isValid: true });
            form.setFieldState('email', { isValid: false, error: 'Error' });
            form.focusFirstError();
            expect(el1.focus).not.toHaveBeenCalled();
            expect(el2.focus).toHaveBeenCalled();
        });

        it('does nothing when all fields are valid', () => {
            const el = { focus: vi.fn() };
            form.registerElement('name', el);
            form.focusFirstError();
            expect(el.focus).not.toHaveBeenCalled();
        });
    });

    // ─── Schema ──────────────────────────────────────────────

    describe('updateSchema', () => {
        it('adds schema fields', () => {
            form.updateSchema({ phone: 'required' });
            expect(form.schema.phone).toBe('required');
        });

        it('removes schema fields and their data/state', () => {
            form.data.name = 'John';
            form.setFieldState('name', { isDirty: true });
            form.schema.name = 'rule';
            form.updateSchema({}, ['name']);
            expect(form.schema.name).toBeUndefined();
            expect(form.data.name).toBeUndefined();
            expect(form.state.fields.name).toBeUndefined();
        });

        it('adds and removes in single call', () => {
            form.schema.name = 'old-rule';
            form.updateSchema({ phone: 'new-rule' }, ['name']);
            expect(form.schema.phone).toBe('new-rule');
            expect(form.schema.name).toBeUndefined();
        });
    });

    // ─── Events ──────────────────────────────────────────────

    describe('eventData', () => {
        it('builds event payload', () => {
            form.data.email = 'test@test.com';
            const data = form.eventData('email');
            expect(data).toEqual({
                field: 'email',
                type: 'change',
                value: 'test@test.com',
            });
        });

        it('includes field extras', () => {
            form.data.email = '';
            const data = form.eventData('email', 'change', { section: 'contact' });
            expect(data.section).toBe('contact');
        });

        it('includes form-level extras', () => {
            const f = AlpineForm({ email: '' }, { extras: { formId: 'signup' } });
            const data = f.eventData('email');
            expect(data.formId).toBe('signup');
        });

        it('includes formData when fieldChangeHasAllData is true', () => {
            const f = AlpineForm(
                { email: 'a', name: 'b' },
                {
                    config: { fieldChangeHasAllData: true },
                },
            );
            const data = f.eventData('email');
            expect(data.formData).toEqual({ email: 'a', name: 'b' });
        });
    });

    describe('getEventName', () => {
        it('returns config event name for change type', () => {
            const name = form.getEventName({ type: 'change' });
            expect(name).toBe('field-change');
        });

        it('returns custom event name when configured', () => {
            const f = AlpineForm({}, { config: { fieldChangeEventName: 'my-event' } });
            expect(f.getEventName({ type: 'change' })).toBe('my-event');
        });

        it('returns type string for non-change types', () => {
            expect(form.getEventName({ type: 'blur' })).toBe('blur');
        });
    });

    describe('trigger', () => {
        it('calls $dispatch on element with event name and data', () => {
            const el = { $dispatch: vi.fn() };
            const eventData = { field: 'email', type: 'change', value: 'test' };
            form.trigger(el, eventData);
            expect(el.$dispatch).toHaveBeenCalledWith('field-change', eventData);
        });
    });
});
