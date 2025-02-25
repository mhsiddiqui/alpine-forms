const formState = {
    isValid: true,
    isSubmitting: false,
    isSubmitted: false,
    isDirty: false,
    error: '',
};

const fieldState = {
    isValid: true,
    isDirty: false,
    error: '',
};

const formConfig = {
    validationOnSubmit: false,
    validations: {},
    fieldChangeEnabled: false,
    fieldChangeEventName: 'field-change',
    fieldChangeHasAllData: false
};

export function AlpineForm(
    data,
    options = {
        schema: {},
        config: formConfig,
        extras: {},
    }
) {
    return {
        data: data,
        schema: options.schema,
        config: { ...formConfig, ...options.config },
        state: {
            form: formState,
            fields: {},
        },
        extras: options.extras,
        updateSchema(addition = {}, removal = []) {
            const updatedSchema = { ...this.schema, ...addition };
            for (const key of removal) {
                delete updatedSchema[key];
                delete this.data[key];
            }
            this.schema = updatedSchema;
        },
        setFormState(state = {}) {
            this.state.form = { ...this.state.form, ...state };
        },
        setFieldState(field, state = {}) {
            this.state.fields[field] = { ...this.state.fields[field], ...state };
        },
        getSchema() {
            if (this.schema) {
                return joi.object(this.schema);
            }
        },
        runValidations() {
            let schema = this.getSchema();
            if (schema) {
                let result = schema.validate(this.data, {
                    abortEarly: false,
                    allowUnknown: true,
                });
                if (result.error) {
                    this.setFormState({ isValid: false });
                    for (let error of result.error.details) {
                        this.setFieldState(error.context.key, {
                            isValid: false,
                            error: error.message,
                        });
                    }
                } else {
                    this.setFormState({ isValid: true, error: '' });
                    for (let field in this.schema) {
                        this.setFieldState(field, { isValid: true, error: '' });
                    }
                }
                this.data = result.value;
            }
            if (this.config.validations) {
                for (let field in this.config.validations) {
                    if (this.getFieldState(field).isValid) {
                        let validationResult = this.config.validations[field](
                            this.data[field]
                        );
                        if (validationResult !== undefined) {
                            this.setFormState({ isValid: false });
                            this.setFieldState(field, {
                                isValid: false,
                                error: validationResult.message,
                            });
                        }
                    }
                }
            }
        },
        setValue(field, value) {
            this.data[field] = value;
            this.setFieldState(field, { isDirty: true });
            if (!this.config.validationOnSubmit) {
                this.runValidations();
            }
        },
        getValue(field = null) {
            if (field) {
                return this.data[field] === undefined ? '' : this.data[field];
            } else {
                let fieldData = {};
                for (let field in this.schema) {
                    fieldData[field] = this.data[field];
                }
                return fieldData;
            }
        },
        getFormState() {
            return this.state.form;
        },
        getFieldState(field) {
            if (this.state.fields[field] !== undefined) {
                return { ...fieldState, ...this.state.fields[field] };
            } else {
                return fieldState;
            }
        },
        field(field, extras = {}) {
            return {
                name: field,
                extras: extras,
            };
        },
        async submit(onSubmit) {
            this.runValidations();
            if (this.getFormState().isValid) {
                this.setFormState({ isSubmitting: true });
                try {
                    await onSubmit(this.data);
                    this.setFormState({
                        ...formState,
                        isSubmitted: true,
                        isValid: true,
                    });
                } catch (error) {
                    this.setFormState({
                        ...formState,
                        isValid: false,
                        error: 'There was an error while submitting your form',
                    });
                }
            }
        },
        eventData(field, type = 'change', extras = {}) {
            let data = {
                field: field,
                type: type,
                value: this.getValue(field),
                ...extras,
                ...this.extras,
            };

            if (this.config.fieldChangeHasAllData) {
                data['formData'] = this.data;
            }

            return data;
        },
        getEventName(eventData) {
            if (eventData.type === 'change') {
                return this.config.fieldChangeEventName;
            }
        },
        trigger(element, eventData = {}) {
            element.$dispatch(this.getEventName(eventData), eventData);
        },
    };
}

export default AlpineForm;