Alpine.data('dynamicFieldsForm', () => ({
    result: '',
    showResult: false,
    showPhone: false,
    form: Alpine.Form(
        { name: '', phone: '' },
        {
            config: {
                validationMode: 'onTouched',
                validations: {
                    name(value) {
                        if (!value) return { message: 'Name is required' };
                    },
                },
            },
        },
    ),
    togglePhone() {
        this.showPhone = !this.showPhone;
        if (!this.showPhone) {
            this.form.unregister('phone');
        }
    },
    handleSubmit(data) {
        this.showResult = true;
        this.result = JSON.stringify(Alpine.raw(data), null, 2);
    },
}));
