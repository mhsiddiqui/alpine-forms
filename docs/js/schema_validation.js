document.addEventListener('alpine:init', () => {
    Alpine.data('schemaValidation', () => ({
        result: {},
        showResult: false,
        form: Alpine.Form({}, {
            schema: {
                first_name: joi.string().required().min(3).max(10).label('First Name'),
                last_name: joi.string().required().min(5).max(15).label('Last Name'),
            }
        }),
        submitHandler(data) {
            this.showResult = true;
            this.result = JSON.stringify(Alpine.raw(data));
        }
    }))
})