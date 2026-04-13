const defaultFormState = () => ({
    isValid: true,
    isValidating: false,
    isSubmitting: false,
    isSubmitted: false,
    isDirty: false,
    error: '',
});

const defaultFieldState = () => ({
    isValid: true,
    isDirty: false,
    isTouched: false,
    error: '',
});

const defaultConfig = {
    validationMode: null,
    validationOnSubmit: false,
    validator: null,
    validations: {},
    fieldChangeEventEnabled: false,
    fieldChangeEventName: 'field-change',
    fieldChangeHasAllData: false,
    focusOnError: false,
};

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function isEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== 'object') return false;
    return JSON.stringify(a) === JSON.stringify(b);
}

function resolveValidationMode(config) {
    if (config.validationMode) return config.validationMode;
    return config.validationOnSubmit ? 'onSubmit' : 'onChange';
}

function shouldValidateOnChange(config, fieldState) {
    const mode = resolveValidationMode(config);
    if (mode === 'onChange' || mode === 'all') return true;
    if (mode === 'onTouched' && fieldState.isTouched) return true;
    return false;
}

function shouldValidateOnBlur(config) {
    const mode = resolveValidationMode(config);
    return mode === 'onBlur' || mode === 'onTouched' || mode === 'all';
}

function markFieldInvalid(form, field, message) {
    form.setFormState({ isValid: false });
    form.setFieldState(field, { isValid: false, error: message });
}

function runSchemaValidation(form) {
    if (!form.schema || !form.config.validator) return;

    const result = form.config.validator(form.schema, form.data);
    if (!result) return;

    if (result.errors && result.errors.length > 0) {
        for (const error of result.errors) {
            markFieldInvalid(form, error.field, error.message);
        }
    }

    if (result.value) {
        for (const key in result.value) {
            form.data[key] = result.value[key];
        }
    }
}

function runCustomValidations(form) {
    if (!form.config.validations) return null;

    const asyncValidations = [];

    for (const field in form.config.validations) {
        if (!form.getFieldState(field).isValid) continue;

        const result = form.config.validations[field](form.data[field], form.data);

        if (result && typeof result.then === 'function') {
            asyncValidations.push({ field, promise: result });
        } else if (result !== undefined) {
            markFieldInvalid(form, field, result.message);
        }
    }

    return asyncValidations.length > 0 ? asyncValidations : null;
}

export const AlpineForm = (data, options = {}) => ({
    // --- Properties ---
    data,
    _defaults: cloneData(data),
    _validationRun: 0,
    _fieldElements: {},
    _component: null,
    schema: options.schema || {},
    config: { ...defaultConfig, ...options.config },
    state: { form: defaultFormState(), fields: {} },
    extras: options.extras || {},

    // --- Registration ---
    registerElement(field, el) {
        this._fieldElements[field] = el;
    },
    unregister(field) {
        delete this.data[field];
        delete this.state.fields[field];
        delete this.schema[field];
        delete this._defaults[field];
        delete this._fieldElements[field];
    },
    focusFirstError() {
        for (const field in this._fieldElements) {
            if (!this.getFieldState(field).isValid) {
                this._fieldElements[field].focus();
                return;
            }
        }
    },

    // --- Schema ---
    updateSchema(addition = {}, removal = []) {
        const updatedSchema = { ...this.schema, ...addition };
        for (const key of removal) {
            delete updatedSchema[key];
            delete this.data[key];
            delete this.state.fields[key];
        }
        this.schema = updatedSchema;
    },

    // --- State ---
    setFormState(state = {}) {
        this.state.form = { ...this.state.form, ...state };
    },
    setFieldState(field, state = {}) {
        this.state.fields[field] = { ...this.state.fields[field], ...state };
    },
    getFormState() {
        return { ...defaultFormState(), ...this.state.form };
    },
    getFieldState(field) {
        if (this.state.fields[field] !== undefined) {
            return { ...defaultFieldState(), ...this.state.fields[field] };
        }
        return defaultFieldState();
    },

    // --- Data ---
    setValue(field, value) {
        this.data[field] = value;
        this.setFieldState(field, { isDirty: !isEqual(value, this._defaults[field]) });
        this.setFormState({ isDirty: !isEqual(this.data, this._defaults) });
        if (shouldValidateOnChange(this.config, this.getFieldState(field))) {
            this.runValidations();
        }
    },
    getValue(field = null) {
        if (field !== null && field !== undefined) {
            return this.data[field] === undefined ? '' : this.data[field];
        }
        return { ...this.data };
    },
    field(field, extras = {}) {
        return { name: field, extras };
    },
    reset(newDefaults) {
        if (newDefaults !== undefined) {
            this._defaults = cloneData(newDefaults);
        }
        const defaults = cloneData(this._defaults);
        for (const key in this.data) {
            delete this.data[key];
        }
        for (const key in defaults) {
            this.data[key] = defaults[key];
        }
        this.state.form = defaultFormState();
        this.state.fields = {};
    },
    getDefaults() {
        return cloneData(this._defaults);
    },
    setValues(values) {
        for (const key in values) {
            this.data[key] = values[key];
            this.setFieldState(key, { isDirty: !isEqual(values[key], this._defaults[key]) });
        }
        this.setFormState({ isDirty: !isEqual(this.data, this._defaults) });
        const mode = resolveValidationMode(this.config);
        if (mode !== 'onSubmit') {
            this.runValidations();
        }
    },
    getDirtyFields() {
        const dirty = {};
        for (const field in this.data) {
            if (!isEqual(this.data[field], this._defaults[field])) {
                dirty[field] = this.data[field];
            }
        }
        return dirty;
    },
    touchField(field) {
        this.setFieldState(field, { isTouched: true });
        if (shouldValidateOnBlur(this.config)) {
            this.runValidations();
        }
    },

    // --- Errors ---
    setError(field, message) {
        markFieldInvalid(this, field, message);
    },
    clearErrors(field) {
        if (field !== undefined) {
            this.setFieldState(field, { isValid: true, error: '' });
        } else {
            for (const f in this.state.fields) {
                this.setFieldState(f, { isValid: true, error: '' });
            }
            this.setFormState({ isValid: true, error: '' });
        }
    },
    getErrors() {
        const errors = {};
        for (const field in this.state.fields) {
            const state = this.state.fields[field];
            if (state && !state.isValid && state.error) {
                errors[field] = state.error;
            }
        }
        return errors;
    },

    // --- Validation ---
    async runValidations() {
        this._validationRun++;
        const currentRun = this._validationRun;

        for (const field in this.state.fields) {
            this.setFieldState(field, { isValid: true, error: '' });
        }
        this.setFormState({ isValid: true, error: '' });

        runSchemaValidation(this);
        const asyncValidations = runCustomValidations(this);

        if (asyncValidations) {
            this.setFormState({ isValidating: true });
            const results = await Promise.all(
                asyncValidations.map(({ field, promise }) =>
                    promise.then((result) => ({ field, result })),
                ),
            );

            if (currentRun === this._validationRun) {
                for (const { field, result } of results) {
                    if (result !== undefined) {
                        markFieldInvalid(this, field, result.message);
                    }
                }
                this.setFormState({ isValidating: false });
            }
        }

        return this.state.form.isValid;
    },

    async validateField(field) {
        this.setFieldState(field, { isValid: true, error: '' });

        if (this.schema && this.config.validator) {
            const result = this.config.validator(this.schema, this.data);
            if (result && result.errors) {
                const fieldError = result.errors.find((e) => e.field === field);
                if (fieldError) {
                    this.setFieldState(field, { isValid: false, error: fieldError.message });
                }
            }
            if (result && result.value && result.value[field] !== undefined) {
                this.data[field] = result.value[field];
            }
        }

        if (
            this.config.validations &&
            this.config.validations[field] &&
            this.getFieldState(field).isValid
        ) {
            const result = this.config.validations[field](this.data[field], this.data);

            if (result && typeof result.then === 'function') {
                this.setFormState({ isValidating: true });
                const asyncResult = await result;
                if (asyncResult !== undefined) {
                    markFieldInvalid(this, field, asyncResult.message);
                }
                this.setFormState({ isValidating: false });
            } else if (result !== undefined) {
                markFieldInvalid(this, field, result.message);
            }
        }

        const hasInvalidField = Object.values(this.state.fields).some((s) => s && !s.isValid);
        this.setFormState({ isValid: !hasInvalidField });

        return this.getFieldState(field).isValid;
    },

    // --- Submission ---
    async submit(onSubmit) {
        this.setFormState({ isSubmitting: true, isSubmitted: false, error: '' });
        await this.runValidations();

        if (!this.state.form.isValid) {
            this.setFormState({ isSubmitting: false });
            if (this.config.focusOnError) {
                this.focusFirstError();
            }
            return;
        }

        try {
            await onSubmit.call(this._component || this, this.data);
            this.setFormState({ isSubmitting: false, isSubmitted: true });
        } catch (error) {
            this.setFormState({
                isSubmitting: false,
                isValid: false,
                error: error.message || 'There was an error while submitting your form',
            });
        }
    },

    // --- Events ---
    eventData(field, type = 'change', extras = {}) {
        const data = {
            field,
            type,
            value: this.getValue(field),
            ...extras,
            ...this.extras,
        };

        if (this.config.fieldChangeHasAllData) {
            data.formData = this.data;
        }

        return data;
    },
    getEventName(eventData) {
        if (eventData.type === 'change') {
            return this.config.fieldChangeEventName;
        }
        return eventData.type;
    },
    trigger(element, eventData = {}) {
        element.$dispatch(this.getEventName(eventData), eventData);
    },
});
