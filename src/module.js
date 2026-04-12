import { AlpineForm } from './alpineForm';
import directive from './directive';
import joiValidator from './validators/joi';

function directives(Alpine) {
    directive(Alpine);
    Alpine.Form = AlpineForm;
}

export { directives, joiValidator };
