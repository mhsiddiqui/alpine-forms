function handleCheckbox(Alpine, el, form, field, options = {}) {
    Alpine.bind(el, {
        '@change'(event) {
            form.setValue(field, event.target.checked);
            if (form.config.fieldChangeEventEnabled) {
                form.trigger(this, form.eventData(field, 'change', options));
            }
        },
        ':checked'() {
            return form.getValue(field) === undefined ? false : form.getValue(field);
        },
    });
}

function handleRadio(Alpine, el, form, field, options = {}) {
    Alpine.bind(el, {
        '@change'() {
            form.setValue(field, el.value);
            if (form.config.fieldChangeEventEnabled) {
                form.trigger(this, form.eventData(field, 'change', options));
            }
        },
        ':checked'() {
            return form.getValue(field) === el.value;
        },
    });
}

function handleFile(Alpine, el, form, field, options = {}) {
    Alpine.bind(el, {
        '@change'(event) {
            form.setValue(field, el.multiple ? event.target.files : event.target.files[0]);
            if (form.config.fieldChangeEventEnabled) {
                form.trigger(this, form.eventData(field, 'change', options));
            }
        },
    });
}

function handleSelectMultiple(Alpine, el, form, field, options = {}) {
    Alpine.bind(el, {
        '@change'() {
            const selected = Array.from(el.selectedOptions, (opt) => opt.value);
            form.setValue(field, selected);
            if (form.config.fieldChangeEventEnabled) {
                form.trigger(this, form.eventData(field, 'change', options));
            }
        },
        ':value'() {
            return form.getValue(field) === undefined ? [] : form.getValue(field);
        },
    });
}

function handleInputFields(Alpine, el, form, field, options = {}) {
    Alpine.bind(el, {
        '@change'(event) {
            form.setValue(field, event.target.value);
            if (form.config.fieldChangeEventEnabled) {
                form.trigger(this, form.eventData(field, 'change', options));
            }
        },
        ':value'() {
            return form.getValue(field) === undefined ? '' : form.getValue(field);
        },
    });
}

export default function (Alpine) {
    Alpine.directive('register', (el, { value, expression }, { evaluate }) => {
        const form = evaluate(value);

        if (!form || typeof form.field !== 'function') {
            console.warn(
                `[alpine-forms] x-register:${value} — "${value}" did not resolve to a valid form object. Make sure x-data contains a property created with Alpine.Form().`,
            );
            return;
        }

        const descriptor = evaluate(expression);

        if (!descriptor || descriptor.name === undefined) {
            console.warn(
                `[alpine-forms] x-register:${value}="${expression}" — expression did not return a field descriptor. Use: form.field('fieldName')`,
            );
            return;
        }

        let { name, extras } = descriptor;

        // Store the Alpine component scope on the form so submit() can
        // call user callbacks with the correct `this` context.
        if (!form._component) {
            form._component = evaluate('$data');
        }

        if (el.tagName === 'INPUT') {
            if (el.type === 'checkbox') handleCheckbox(Alpine, el, form, name, extras);
            else if (el.type === 'radio') handleRadio(Alpine, el, form, name, extras);
            else if (el.type === 'file') handleFile(Alpine, el, form, name, extras);
            else handleInputFields(Alpine, el, form, name, extras);
        } else if (el.tagName === 'TEXTAREA') {
            handleInputFields(Alpine, el, form, name, extras);
        } else if (el.tagName === 'SELECT') {
            if (el.multiple) handleSelectMultiple(Alpine, el, form, name, extras);
            else handleInputFields(Alpine, el, form, name, extras);
        }

        form.registerElement(name, el);

        Alpine.bind(el, {
            '@blur'() {
                form.touchField(name);
            },
        });
    }).before('bind');
}
