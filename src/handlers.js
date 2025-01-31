const handleCheckbox = (el, form, field, options = {}) => {
    Alpine.bind(el, {
        '@change'(event) {
            form.setValue(field, event.target.checked);
            if (form.config.fieldChangeEnabled) {
                form.trigger(this, form.eventData(field, 'change', options))
            }
        },
        ':checked'() {
            return form.getValue(field) === undefined ? '' : form.getValue(field);
        },
    });
};

const handleInputFields = (el, form, field, options = {}) => {
    Alpine.bind(el, {
        '@change'(event) {
            form.setValue(field, event.target.value);
            if (form.config.fieldChangeEnabled) {
                form.trigger(this, form.eventData(field, 'change', options))
            }
        },
        ':value'() {
            return form.getValue(field) === undefined ? '' : form.getValue(field);
        },
    });
};

export {handleCheckbox, handleInputFields};