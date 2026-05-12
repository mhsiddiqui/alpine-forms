Alpine.data('basicForm', () => ({
    result: '',
    showResult: false,
    form: Alpine.Form(
        {},
        {
            schema: {
                email: joi.string().email({ tlds: false }).required().messages({
                    'string.email': 'Please enter a valid email',
                    'any.required': 'Email is required',
                }),
                password: joi.string().min(6).required().messages({
                    'string.min': 'Password must be at least 6 characters',
                    'any.required': 'Password is required',
                }),
            },
            config: {
                validator: joiValidator,
            },
        },
    ),
    submitFunction(data) {
        this.showResult = true;
        this.result = JSON.stringify(Alpine.raw(data), null, 2);
    },
}));
