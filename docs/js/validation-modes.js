Alpine.data('validationModesForm', () => ({
    result: '',
    showResult: false,
    currentMode: 'onTouched',
    form: Alpine.Form(
        { email: '', password: '' },
        {
            config: {
                validationMode: 'onTouched',
                validations: {
                    email(value) {
                        if (!value) return { message: 'Email is required' };
                        if (!/\S+@\S+\.\S+/.test(value)) return { message: 'Invalid email' };
                    },
                    password(value) {
                        if (!value) return { message: 'Password is required' };
                        if (value.length < 8) return { message: 'At least 8 characters' };
                    },
                },
            },
        },
    ),
    setMode(mode) {
        this.currentMode = mode;
        this.form.config.validationMode = mode;
        this.form.reset();
        this.showResult = false;
    },
    handleSubmit(data) {
        this.showResult = true;
        this.result = JSON.stringify(Alpine.raw(data), null, 2);
    },
}));
