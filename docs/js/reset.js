Alpine.data('resetForm', () => ({
    result: '',
    showResult: false,
    form: Alpine.Form(
        { name: 'John', email: 'john@example.com' },
        {
            config: { validationMode: 'onTouched' },
        },
    ),
    handleSubmit(data) {
        this.showResult = true;
        this.result = 'Saved!\n' + JSON.stringify(Alpine.raw(data), null, 2);
        this.form.reset({ ...Alpine.raw(data) });
    },
}));
