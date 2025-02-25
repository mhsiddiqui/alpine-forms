import {AlpineForm} from "./alpineForm";
import directive from "./directive";

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(directive);
    window.Alpine.Form = AlpineForm;
})
