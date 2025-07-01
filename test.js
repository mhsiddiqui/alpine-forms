document.addEventListener('alpine:init', () => {
    Alpine.data('basicForm', () => ({
        result: {},
        showResult: false,
        form: Alpine.Form(),
        submitHandler(data) {
            this.showResult = true;
            this.result = JSON.stringify(Alpine.raw(data));
        }
    }))
})