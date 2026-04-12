function getJoi() {
    if (typeof globalThis !== 'undefined' && globalThis.joi) return globalThis.joi;
    if (typeof window !== 'undefined' && window.joi) return window.joi;
    throw new Error(
        '[alpine-forms] joi is required for joiValidator but was not found. ' +
            'CDN: load joi via <script> before alpine-forms. ' +
            'Module: install joi (npm install joi) and assign it to globalThis.joi, ' +
            'or write a custom validator function instead.',
    );
}

export default function joiValidator(schema, data) {
    const joi = getJoi();
    const joiSchema = joi.object(schema);
    const result = joiSchema.validate(data, {
        abortEarly: false,
        allowUnknown: true,
    });

    const errors = [];
    if (result.error) {
        for (const detail of result.error.details) {
            errors.push({
                field: detail.context.key,
                message: detail.message,
            });
        }
    }

    return {
        errors,
        value: result.value,
    };
}
