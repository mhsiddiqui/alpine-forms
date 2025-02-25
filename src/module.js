import {AlpineForm} from "./alpineForm";
import directive from "./directive";

function directives (Alpine) {
    directive(Alpine);
    Alpine.Form = AlpineForm;
}

export {directives};