const createFormState = () => ({
    isValid: true,
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    submitAttempts: 0
});

const createFieldState = () => ({
    isValid: true,
    isDirty: false,
    isTouched: false,
    error: null
});

const defaultConfig = {
    validateOnChange: true,
    validateOnBlur: true,
    validations: {},
    enableFieldEvents: false,
    fieldEventName: 'field-change',
    includeFullDataInEvents: false,
    showErrorsOnSubmit: true
};

export const AlpineForm = (
    data = {},
    options = {
        schema: {},
        config: {},
        extras: {},
    }
) => ({
    fields: [],
    data: {...data},
    schema: options.schema || {},
    config: {...defaultConfig, ...options.config},
    state: {
        form: createFormState(),
        fields: {}
    },
    extras: options.extras || {},

    setFormState(state = {}) {
        this.state.form = {
            ...this.state.form,
            ...state
        };
    },

    setFieldState(field, state = {}) {
        if (!this.state.fields[field]) {
            this.state.fields[field] = createFieldState();
        }
        this.state.fields[field] = {
            ...this.state.fields[field],
            ...state
        };
    },

    markFieldTouched(field) {
        this.setFieldState(field, {
            isTouched: true,
            isDirty: this.getValue(field) !== ''
        });

        if (this.config.validateOnBlur) {
            this.validateField(field);
        }
    },

    triggerFieldChange(field, event, options = {}) {
        if (this.config.enableFieldEvents) {
            const eventData = this.eventData(field, 'change', {
                originalEvent: event,
                ...options
            });

            this.trigger(event.target, eventData);
        }
    },

    validateField(field) {
        let isValid = true;
        let error = null;

        // Joi schema validation
        if (this.schema && this.schema[field]) {
            const fieldSchema = this.getSchema().extract([field]);
            const {error: schemaError} = fieldSchema.validate(this.data[field]);

            if (schemaError) {
                isValid = false;
                error = schemaError.details[0].message;
            }
        }

        // Custom validations
        if (isValid && this.config.validations[field]) {
            const customValidationResult = this.config.validations[field](this.data[field]);
            if (customValidationResult) {
                isValid = false;
                error = customValidationResult.message;
            }
        }

        this.setFieldState(field, {
            isValid,
            error
        });

        return isValid;
    },

    getSchema() {
        if (this.schema && window.joi) {
            return window.joi.object(this.schema);
        }
        return null;
    },

    runValidations() {
        let overallValid = true;

        // Reset form validity
        this.setFormState({ isValid: true, error: null });

        // Validate each field
        Object.keys(this.schema || {}).forEach(field => {
            const isFieldValid = this.validateField(field);
            if (!isFieldValid) {
                overallValid = false;
            }
        });

        this.setFormState({ isValid: overallValid });
        return overallValid;
    },

    setValue(field, value) {
        this.data[field] = value;
        this.setFieldState(field, {
            isDirty: true,
            isTouched: true
        });

        if (this.config.validateOnChange) {
            this.runValidations();
        }
    },

    getValue(field = null) {
        if (field) {
            return this.data[field] ?? '';
        }

        const fieldData = {};
        Object.keys(this.schema || {}).forEach(key => {
            fieldData[key] = this.data[key] ?? '';
        });
        return fieldData;
    },

    getFormState() {
        return this.state.form;
    },

    getFieldState(field) {
        const state = this.state.fields[field]
            ? {...createFieldState(), ...this.state.fields[field]}
            : createFieldState();

        return state;
    },

    field(field, extras = {}) {
        if (!this.state.fields[field]) {
            this.fields.push(field);
            this.state.fields[field] = createFieldState();
            this.runValidations();
        }
        return {
            name: field,
            extras: extras,
        };
    },

    error(field, options = {isValid: false}) {
        return {
            name: field,
            condition: options
        }
    },

    async submit(onSubmit) {
        // Increment submit attempts
        this.setFormState({
            submitAttempts: (this.state.form.submitAttempts || 0) + 1
        });

        // Run validations
        const isValid = this.runValidations();

        // Show errors if configured
        if (this.config.showErrorsOnSubmit && !isValid) {
            return false;
        }

        // Proceed if form is valid
        if (isValid) {
            this.setFormState({
                isSubmitting: true,
                error: null
            });

            try {
                const result = await onSubmit(this.data);

                this.setFormState({
                    isSubmitting: false,
                    isSubmitted: true,
                    submissionResult: result
                });

                return result;
            } catch (error) {
                this.setFormState({
                    isSubmitting: false,
                    isValid: false,
                    error: error.message || 'Submission failed'
                });

                throw error;
            }
        }

        return false;
    },

    reset(fields = null) {
        if (fields) {
            // Reset specific fields
            fields.forEach(field => {
                delete this.data[field];
                this.state.fields[field] = createFieldState();
            });
        } else {
            // Reset entire form
            this.data = {};
            this.state = {
                form: createFormState(),
                fields: {},
            };
        }
    },

    eventData(field, type = 'change', extras = {}) {
        const data = {
            field,
            type,
            value: this.getValue(field),
            ...extras,
            ...this.extras,
        };

        if (this.config.includeFullDataInEvents) {
            data.formData = this.data;
        }

        return data;
    },

    hasErrors() {
        return Object.values(this.state.fields)
            .some(fieldState => !fieldState.isValid);
    },

    addField(field, schema = null, options = {}) {
        // Add to fields array if not already present
        if (!this.fields.includes(field)) {
            this.fields.push(field);
        }

        // Update schema if validation is provided
        if (schema && window.joi) {
            this.schema[field] = schema;
        }

        // Initialize field state
        this.state.fields[field] = createFieldState();

        // Set initial value if provided in options
        if (options.value !== undefined) {
            this.setValue(field, options.value);
        }

        // Add custom validation if provided
        if (options.validation) {
            if (!this.config.validations) {
                this.config.validations = {};
            }
            this.config.validations[field] = options.validation;
        }

        // Return the field configuration for chaining
        return {
            name: field,
            extras: options
        };
    },
});