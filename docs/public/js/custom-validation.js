Alpine.data('basicFormNoJoi', () => ({
    result: '',
    showResult: false,
    form: Alpine.Form(
        {},
        {
            config: {
                validations: {
                    email(value) {
                        if (!value) return { message: 'Email is required' };
                        if (!/\S+@\S+\.\S+/.test(value))
                            return { message: 'Please enter a valid email' };
                    },
                    password(value) {
                        if (!value) return { message: 'Password is required' };
                        if (value.length < 6) return { message: 'Must be at least 6 characters' };
                    },
                },
            },
        },
    ),
    submitFunction(data) {
        this.showResult = true;
        this.result = JSON.stringify(Alpine.raw(data), null, 2);
    },
}));
