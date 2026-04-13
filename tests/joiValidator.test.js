import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Joi from 'joi';
import joiValidator from '../src/validators/joi.js';

describe('joiValidator', () => {
    beforeEach(() => {
        globalThis.joi = Joi;
    });

    afterEach(() => {
        delete globalThis.joi;
    });

    it('returns no errors for valid data', () => {
        const schema = {
            email: Joi.string().email({ tlds: false }).required(),
        };
        const result = joiValidator(schema, { email: 'test@example.com' });
        expect(result.errors).toEqual([]);
        expect(result.value.email).toBe('test@example.com');
    });

    it('returns errors for invalid data', () => {
        const schema = {
            email: Joi.string().email({ tlds: false }).required(),
        };
        const result = joiValidator(schema, { email: 'not-an-email' });
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].field).toBe('email');
        expect(result.errors[0].message).toBeTruthy();
    });

    it('returns all errors with abortEarly: false', () => {
        const schema = {
            email: Joi.string().email({ tlds: false }).required(),
            password: Joi.string().min(6).required(),
        };
        const result = joiValidator(schema, { email: '', password: '' });
        expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('allows unknown fields', () => {
        const schema = {
            email: Joi.string().required(),
        };
        const result = joiValidator(schema, { email: 'test@test.com', extra: 'field' });
        expect(result.errors).toEqual([]);
        expect(result.value.extra).toBe('field');
    });

    it('uses custom error messages', () => {
        const schema = {
            email: Joi.string().email({ tlds: false }).required().messages({
                'string.email': 'Please enter a valid email',
            }),
        };
        const result = joiValidator(schema, { email: 'bad' });
        expect(result.errors[0].message).toBe('Please enter a valid email');
    });

    it('coerces values', () => {
        const schema = {
            age: Joi.number().required(),
        };
        const result = joiValidator(schema, { age: '25' });
        expect(result.errors).toEqual([]);
        expect(result.value.age).toBe(25);
    });

    it('throws when joi is not available', () => {
        delete globalThis.joi;
        expect(() => {
            joiValidator({}, {});
        }).toThrow('[alpine-forms] joi is required');
    });

    it('finds joi on window', () => {
        delete globalThis.joi;
        window.joi = Joi;
        const result = joiValidator({ name: Joi.string().required() }, { name: 'test' });
        expect(result.errors).toEqual([]);
        delete window.joi;
    });
});
