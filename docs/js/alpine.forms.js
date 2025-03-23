(() => {
  // src/alpineForm.js
  var createFormState = () => ({
    isValid: true,
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    submitAttempts: 0
  });
  var createFieldState = () => ({
    isValid: true,
    isDirty: false,
    isTouched: false,
    error: null
  });
  var defaultConfig = {
    validateOnChange: true,
    validateOnBlur: true,
    validations: {},
    enableFieldEvents: false,
    fieldEventName: "field-change",
    includeFullDataInEvents: false,
    showErrorsOnSubmit: true
  };
  var AlpineForm = (data = {}, options = {
    schema: {},
    config: {},
    extras: {}
  }) => ({
    fields: [],
    data: { ...data },
    schema: options.schema || {},
    config: { ...defaultConfig, ...options.config },
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
        isDirty: this.getValue(field) !== ""
      });
      if (this.config.validateOnBlur) {
        this.validateField(field);
      }
    },
    triggerFieldChange(field, event, options2 = {}) {
      if (this.config.enableFieldEvents) {
        const eventData = this.eventData(field, "change", {
          originalEvent: event,
          ...options2
        });
        this.trigger(event.target, eventData);
      }
    },
    validateField(field) {
      let isValid = true;
      let error = null;
      if (this.schema && this.schema[field]) {
        const fieldSchema = this.getSchema().extract([field]);
        const { error: schemaError } = fieldSchema.validate(this.data[field]);
        if (schemaError) {
          isValid = false;
          error = schemaError.details[0].message;
        }
      }
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
      this.setFormState({ isValid: true, error: null });
      Object.keys(this.schema || {}).forEach((field) => {
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
      var _a;
      if (field) {
        return (_a = this.data[field]) != null ? _a : "";
      }
      const fieldData = {};
      Object.keys(this.schema || {}).forEach((key) => {
        var _a2;
        fieldData[key] = (_a2 = this.data[key]) != null ? _a2 : "";
      });
      return fieldData;
    },
    getFormState() {
      return this.state.form;
    },
    getFieldState(field) {
      const state = this.state.fields[field] ? { ...createFieldState(), ...this.state.fields[field] } : createFieldState();
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
        extras
      };
    },
    error(field, options2 = { isValid: false }) {
      return {
        name: field,
        condition: options2
      };
    },
    async submit(onSubmit) {
      this.setFormState({
        submitAttempts: (this.state.form.submitAttempts || 0) + 1
      });
      const isValid = this.runValidations();
      if (this.config.showErrorsOnSubmit && !isValid) {
        return false;
      }
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
            error: error.message || "Submission failed"
          });
          throw error;
        }
      }
      return false;
    },
    reset(fields = null) {
      if (fields) {
        fields.forEach((field) => {
          delete this.data[field];
          this.state.fields[field] = createFieldState();
        });
      } else {
        this.data = {};
        this.state = {
          form: createFormState(),
          fields: {}
        };
      }
    },
    eventData(field, type = "change", extras = {}) {
      const data2 = {
        field,
        type,
        value: this.getValue(field),
        ...extras,
        ...this.extras
      };
      if (this.config.includeFullDataInEvents) {
        data2.formData = this.data;
      }
      return data2;
    },
    hasErrors() {
      return Object.values(this.state.fields).some((fieldState) => !fieldState.isValid);
    },
    addField(field, schema = null, options2 = {}) {
      if (!this.fields.includes(field)) {
        this.fields.push(field);
      }
      if (schema && window.joi) {
        this.schema[field] = schema;
      }
      this.state.fields[field] = createFieldState();
      if (options2.value !== void 0) {
        this.setValue(field, options2.value);
      }
      if (options2.validation) {
        if (!this.config.validations) {
          this.config.validations = {};
        }
        this.config.validations[field] = options2.validation;
      }
      return {
        name: field,
        extras: options2
      };
    }
  });

  // src/directive.js
  function handleCheckbox(Alpine, el, form, field, options = {}) {
    Alpine.bind(el, {
      "@change"(event) {
        form.setValue(field, event.target.checked);
        form.triggerFieldChange(field, event, options);
      },
      ":checked"() {
        var _a;
        return (_a = form.getValue(field)) != null ? _a : "";
      }
    });
  }
  function handleInputFields(Alpine, el, form, field, options = {}) {
    Alpine.bind(el, {
      "@change"(event) {
        form.setValue(field, event.target.value);
        form.triggerFieldChange(field, event, options);
      },
      "@blur"() {
        form.markFieldTouched(field);
      },
      ":value"() {
        var _a;
        return (_a = form.getValue(field)) != null ? _a : "";
      },
      ":aria-invalid"() {
        return !form.getFieldState(field).isValid;
      }
    });
  }
  function handleValidationError(Alpine, el, form, field, condition) {
    Alpine.bind(el, {
      "x-show"() {
        const fieldState = form.getFieldState(field);
        return !fieldState.isValid && Object.keys(condition).every(
          (key) => condition.hasOwnProperty(key) && condition[key] === fieldState[key]
        );
      },
      "x-text"() {
        return form.getFieldState(field).error;
      }
    });
  }
  function directive_default(Alpine) {
    Alpine.directive("register", (el, { value, expression }, { evaluate }) => {
      const form = evaluate(value);
      let { name, extras } = evaluate(expression);
      if (el.tagName === "INPUT") {
        if (el.type === "checkbox") {
          handleCheckbox(Alpine, el, form, name, extras);
        } else if ([
          "text",
          "number",
          "email",
          "password",
          "date",
          "datetime-local",
          "file",
          "tel",
          "url"
        ].includes(el.type)) {
          handleInputFields(Alpine, el, form, name, extras);
        }
      } else if (el.tagName === "SELECT" || el.tagName === "TEXTAREA") {
        handleInputFields(Alpine, el, form, name, extras);
      }
    }).before("bind");
    Alpine.directive("field-error", (el, { value, expression }, { evaluate }) => {
      const form = evaluate(value);
      let { name, condition } = evaluate(expression);
      handleValidationError(Alpine, el, form, name, condition);
    }).before("bind");
  }

  // src/cdn.js
  document.addEventListener("alpine:init", () => {
    window.Alpine.plugin(directive_default);
    window.Alpine.Form = AlpineForm;
  });
})();
