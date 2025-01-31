import {handleCheckbox, handleInputFields} from "./handlers";


export default function (Alpine) {
    Alpine.directive('register', (el, {value, expression}, {evaluate}) => {
        const form = evaluate(value);
        let {name, extras} = evaluate(expression);
        if (el.tagName === 'INPUT') {
            if (el.type === 'checkbox') handleCheckbox(el, form, name, extras);
            else if (
                el.type === 'text' ||
                el.type === 'number' ||
                el.type === 'email' ||
                el.type === 'password' ||
                el.type === 'date' ||
                el.type === 'datetime-local' ||
                el.type === 'file'
            )
                handleInputFields(el, form, name, extras);
        } else if (el.type === 'select-one') {
            handleInputFields(el, form, name, extras);
        }
    }).before('bind');
}