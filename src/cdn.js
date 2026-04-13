import { AlpineForm } from './alpineForm';
import directive from './directive';
import joiValidator from './validators/joi';

function register(Alpine) {
    Alpine.Form = AlpineForm;
    Alpine.plugin(directive);
}

// If Alpine is already loaded, register immediately
if (window.Alpine) {
    register(window.Alpine);
}

// Also register on alpine:init for the standard CDN load order
document.addEventListener('alpine:init', () => {
    register(window.Alpine);
});

window.joiValidator = joiValidator;
