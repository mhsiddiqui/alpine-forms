// src/alpineForm.js
var formState = {
  isValid: true,
  isSubmitting: false,
  isSubmitted: false,
  isDirty: false,
  error: ""
};
var fieldState = {
  isValid: true,
  isDirty: false,
  error: ""
};
var formConfig = {
  validationOnSubmit: false,
  validations: {},
  fieldChangeEventEnabled: false,
  fieldChangeEventName: "field-change",
  fieldChangeHasAllData: false
};
var AlpineForm = (data, options = {
  schema: {},
  config: formConfig,
  extras: {}
}) => ({
  data,
  schema: options.schema,
  config: { ...formConfig, ...options.config },
  state: {
    form: formState,
    fields: {}
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
        allowUnknown: true
      });
      if (result.error) {
        this.setFormState({ isValid: false });
        for (let error of result.error.details) {
          this.setFieldState(error.context.key, {
            isValid: false,
            error: error.message
          });
        }
      } else {
        this.setFormState({ isValid: true, error: "" });
        for (let field in this.schema) {
          this.setFieldState(field, { isValid: true, error: "" });
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
          if (validationResult !== void 0) {
            this.setFormState({ isValid: false });
            this.setFieldState(field, {
              isValid: false,
              error: validationResult.message
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
      return this.data[field] === void 0 ? "" : this.data[field];
    } else {
      let fieldData = {};
      for (let field2 in this.schema) {
        fieldData[field2] = this.data[field2];
      }
      return fieldData;
    }
  },
  getFormState() {
    return this.state.form;
  },
  getFieldState(field) {
    if (this.state.fields[field] !== void 0) {
      return { ...fieldState, ...this.state.fields[field] };
    } else {
      return fieldState;
    }
  },
  field(field, extras = {}) {
    return {
      name: field,
      extras
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
          isValid: true
        });
      } catch (error) {
        this.setFormState({
          ...formState,
          isValid: false,
          error: "There was an error while submitting your form"
        });
      }
    }
  },
  eventData(field, type = "change", extras = {}) {
    let data2 = {
      field,
      type,
      value: this.getValue(field),
      ...extras,
      ...this.extras
    };
    if (this.config.fieldChangeHasAllData) {
      data2["formData"] = this.data;
    }
    return data2;
  },
  getEventName(eventData) {
    if (eventData.type === "change") {
      return this.config.fieldChangeEventName;
    }
  },
  trigger(element, eventData = {}) {
    element.$dispatch(this.getEventName(eventData), eventData);
  }
});

// src/directive.js
function handleCheckbox(Alpine, el, form, field, options = {}) {
  Alpine.bind(el, {
    "@change"(event) {
      form.setValue(field, event.target.checked);
      if (form.config.fieldChangeEnabled) {
        form.trigger(this, form.eventData(field, "change", options));
      }
    },
    ":checked"() {
      return form.getValue(field) === void 0 ? "" : form.getValue(field);
    }
  });
}
function handleInputFields(Alpine, el, form, field, options = {}) {
  Alpine.bind(el, {
    "@change"(event) {
      form.setValue(field, event.target.value);
      if (form.config.fieldChangeEnabled) {
        form.trigger(this, form.eventData(field, "change", options));
      }
    },
    ":value"() {
      return form.getValue(field) === void 0 ? "" : form.getValue(field);
    }
  });
}
function directive_default(Alpine) {
  Alpine.directive("register", (el, { value, expression }, { evaluate }) => {
    const form = evaluate(value);
    let { name, extras } = evaluate(expression);
    if (el.tagName === "INPUT") {
      if (el.type === "checkbox") handleCheckbox(Alpine, el, form, name, extras);
      else if (el.type === "text" || el.type === "number" || el.type === "email" || el.type === "password" || el.type === "date" || el.type === "datetime-local" || el.type === "file")
        handleInputFields(Alpine, el, form, name, extras);
    } else if (el.type === "select-one") {
      handleInputFields(Alpine, el, form, name, extras);
    }
  }).before("bind");
}

// src/module.js
function directives(Alpine) {
  directive_default(Alpine);
  Alpine.Form = AlpineForm;
}
export {
  directives
};
