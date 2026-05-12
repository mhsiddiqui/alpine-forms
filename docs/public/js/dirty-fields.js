Alpine.data('dirtyFieldsForm', () => ({
    result: '',
    showResult: false,
    form: Alpine.Form({ name: 'John', email: 'john@example.com', bio: '' }),
    handleSubmit() {
        const dirty = this.form.getDirtyFields();
        if (Object.keys(dirty).length === 0) {
            this.showResult = true;
            this.result = 'No changes to save';
            return;
        }
        this.showResult = true;
        this.result = 'Saving only changed fields:\n' + JSON.stringify(Alpine.raw(dirty), null, 2);
        this.form.reset({ ...Alpine.raw(this.form.getValue()) });
    },
}));
