function handleCheckbox(Alpine, el, form, field, options = {}) {
    Alpine.bind(el, {
        '@change'(event) {
            form.setValue(field, event.target.checked);
            form.triggerFieldChange(field, event, options);
        },
        ':checked'() {
            return form.getValue(field) ?? '';
        },
    });
}

function handleInputFields(Alpine, el, form, field, options = {}) {
    Alpine.bind(el, {
        '@change'(event) {
            form.setValue(field, event.target.value);
            form.triggerFieldChange(field, event, options);
        },
        '@blur'() {
            form.markFieldTouched(field);
        },
        ':value'() {
            return form.getValue(field) ?? '';
        },
        ':aria-invalid'() {
            return !form.getFieldState(field).isValid;
        },
    });
}

function handleValidationError(Alpine, el, form, field, condition) {
    Alpine.bind(el, {
        'x-show'(){
            const fieldState = form.getFieldState(field)
            return !fieldState.isValid && (Object.keys(condition).every(key =>
              condition.hasOwnProperty(key) &&
              condition[key] === fieldState[key]
            ));
        },
        'x-text'() {
            return form.getFieldState(field).error
        },
    });
}

export default function(Alpine) {
    Alpine.directive('register', (el, {value, expression}, {evaluate}) => {
        const form = evaluate(value);
        let {name, extras} = evaluate(expression);

        if (el.tagName === 'INPUT') {
            if (el.type === 'checkbox') {
                handleCheckbox(Alpine, el, form, name, extras);
            } else if ([
                'text', 'number', 'email', 'password',
                'date', 'datetime-local', 'file', 'tel', 'url'
            ].includes(el.type)) {
                handleInputFields(Alpine, el, form, name, extras);
            }
        } else if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
            handleInputFields(Alpine, el, form, name, extras);
        }
    }).before('bind');

    Alpine.directive('field-error', (el, {value, expression}, {evaluate}) => {
        const form = evaluate(value);
        let {name, condition} = evaluate(expression);
        handleValidationError(Alpine, el, form, name, condition)
    }).before('bind');
}