Alpine.data('serverErrorsForm', () => ({
    result: '',
    showResult: false,
    form: Alpine.Form(
        { email: '', username: '' },
        {
            config: {
                validationMode: 'onTouched',
                validations: {
                    email(value) {
                        if (!value) return { message: 'Email is required' };
                    },
                    username(value) {
                        if (!value) return { message: 'Username is required' };
                    },
                },
            },
        },
    ),
    async handleSubmit(data) {
        // Simulate a server response with errors
        await new Promise((r) => setTimeout(r, 800));
        const raw = Alpine.raw(data);
        if (raw.email === 'taken@example.com') {
            this.form.setError('email', 'This email is already registered');
            return;
        }
        if (raw.username === 'admin') {
            this.form.setError('username', 'This username is not available');
            return;
        }
        this.showResult = true;
        this.result = 'Registration successful!\n' + JSON.stringify(Alpine.raw(data), null, 2);
    },
}));
