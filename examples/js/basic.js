document.addEventListener('alpine:init', () => {
    Alpine.data('basicForm', () => ({
        form: AlpineForm(
            {},
            {
                schema: {
                    email: joi.string().min(5).max(40).required(),
                    password: joi.string().min(5).max(40).required(),
                },
                onSubmit: function (data) {
                    alert(data);
                }
            }
        ),
        submitFunction(data) {
            console.log(data);
        }
    }))
})