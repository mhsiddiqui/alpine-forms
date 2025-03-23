document.addEventListener('alpine:init', () => {
    Alpine.data('initialData', () => ({
        result: {},
        showResult: false,
        form: Alpine.Form({email: 'test@example.com', name: 'My Name'}),
        submitHandler(data) {
            this.showResult = true;
            this.result = JSON.stringify(Alpine.raw(data));
        }
    }))
})