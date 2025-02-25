function handleCheckbox(Alpine, el, form, field, options = {}) {
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

function handleInputFields (Alpine, el, form, field, options = {}) {
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

export default function (Alpine) {
    Alpine.directive('register', (el, {value, expression}, {evaluate}) => {
        const form = evaluate(value);
        let {name, extras} = evaluate(expression);
        if (el.tagName === 'INPUT') {
            if (el.type === 'checkbox') handleCheckbox(Alpine, el, form, name, extras);
            else if (
                el.type === 'text' ||
                el.type === 'number' ||
                el.type === 'email' ||
                el.type === 'password' ||
                el.type === 'date' ||
                el.type === 'datetime-local' ||
                el.type === 'file'
            )
                handleInputFields(Alpine, el, form, name, extras);
        } else if (el.type === 'select-one') {
            handleInputFields(Alpine, el, form, name, extras);
        }
    }).before('bind');
}