document.addEventListener('alpine:init', () => {
    Alpine.data('basicForm', () => ({
        result: {},
        showResult: false,
        form: Alpine.Form(
            {},
            {
                schema: {
                    email: joi.string().min(5).max(40).required(),
                    password: joi.string().min(5).max(40).required(),
                },
            }
        ),
        submitFunction(data) {
            // debugger;
            // this.showResult = true;
            // this.result = JSON.stringify(Alpine.raw(data));
            alert(JSON.stringify(Alpine.raw(data)));
        }
    }))
})