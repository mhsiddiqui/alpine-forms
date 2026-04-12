import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import directive from '../src/directive.js';
import { AlpineForm } from '../src/alpineForm.js';

function waitForAlpine() {
    return new Promise((resolve) => setTimeout(resolve, 50));
}

function type(input, value) {
    input.value = value;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

function blur(el) {
    el.dispatchEvent(new Event('blur', { bubbles: true }));
}

describe('x-register directive', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        Alpine.Form = AlpineForm;
        Alpine.plugin(directive);
    });

    afterEach(() => {
        Alpine.destroyTree(document.body);
    });

    // ─── Text Input ──────────────────────────────────────────

    describe('text input', () => {
        it('binds value from form data to input', async () => {
            Alpine.data('textBind', () => ({
                form: Alpine.Form({ name: 'John' }),
            }));
            document.body.innerHTML = `
                <div x-data="textBind">
                    <input x-register:form="form.field('name')" type="text" id="input">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            const input = document.getElementById('input');
            expect(input.value).toBe('John');
        });

        it('updates form data on change', async () => {
            let formRef;
            Alpine.data('textChange', () => ({
                form: Alpine.Form({ name: '' }),
                init() {
                    formRef = this.form;
                },
            }));
            document.body.innerHTML = `
                <div x-data="textChange">
                    <input x-register:form="form.field('name')" type="text" id="input">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            type(document.getElementById('input'), 'Jane');
            expect(formRef.getValue('name')).toBe('Jane');
        });

        it('marks field as touched on blur', async () => {
            let formRef;
            Alpine.data('textBlur', () => ({
                form: Alpine.Form({ name: '' }),
                init() {
                    formRef = this.form;
                },
            }));
            document.body.innerHTML = `
                <div x-data="textBlur">
                    <input x-register:form="form.field('name')" type="text" id="input">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            blur(document.getElementById('input'));
            expect(formRef.getFieldState('name').isTouched).toBe(true);
        });
    });

    // ─── Checkbox ────────────────────────────────────────────

    describe('checkbox', () => {
        it('binds checked state from form data', async () => {
            Alpine.data('cbBind', () => ({
                form: Alpine.Form({ agree: true }),
            }));
            document.body.innerHTML = `
                <div x-data="cbBind">
                    <input x-register:form="form.field('agree')" type="checkbox" id="cb">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            expect(document.getElementById('cb').checked).toBe(true);
        });

        it('updates form data with boolean on change', async () => {
            let formRef;
            Alpine.data('cbChange', () => ({
                form: Alpine.Form({ agree: false }),
                init() {
                    formRef = this.form;
                },
            }));
            document.body.innerHTML = `
                <div x-data="cbChange">
                    <input x-register:form="form.field('agree')" type="checkbox" id="cb">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            const cb = document.getElementById('cb');
            cb.checked = true;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
            expect(formRef.getValue('agree')).toBe(true);
        });
    });

    // ─── Radio ───────────────────────────────────────────────

    describe('radio', () => {
        it('checks the radio matching form value', async () => {
            Alpine.data('radioBind', () => ({
                form: Alpine.Form({ color: 'red' }),
            }));
            document.body.innerHTML = `
                <div x-data="radioBind">
                    <input x-register:form="form.field('color')" type="radio" value="blue" id="r1">
                    <input x-register:form="form.field('color')" type="radio" value="red" id="r2">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            expect(document.getElementById('r1').checked).toBe(false);
            expect(document.getElementById('r2').checked).toBe(true);
        });

        it('updates form data to radio value on change', async () => {
            let formRef;
            Alpine.data('radioChange', () => ({
                form: Alpine.Form({ color: 'red' }),
                init() {
                    formRef = this.form;
                },
            }));
            document.body.innerHTML = `
                <div x-data="radioChange">
                    <input x-register:form="form.field('color')" type="radio" value="blue" id="r1">
                    <input x-register:form="form.field('color')" type="radio" value="red" id="r2">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            const r1 = document.getElementById('r1');
            r1.checked = true;
            r1.dispatchEvent(new Event('change', { bubbles: true }));
            expect(formRef.getValue('color')).toBe('blue');
        });
    });

    // ─── Select ──────────────────────────────────────────────

    describe('select', () => {
        it('binds value from form data', async () => {
            Alpine.data('selBind', () => ({
                form: Alpine.Form({ role: 'admin' }),
            }));
            document.body.innerHTML = `
                <div x-data="selBind">
                    <select x-register:form="form.field('role')" id="sel">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            expect(document.getElementById('sel').value).toBe('admin');
        });

        it('updates form data on change', async () => {
            let formRef;
            Alpine.data('selChange', () => ({
                form: Alpine.Form({ role: 'user' }),
                init() {
                    formRef = this.form;
                },
            }));
            document.body.innerHTML = `
                <div x-data="selChange">
                    <select x-register:form="form.field('role')" id="sel">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            const sel = document.getElementById('sel');
            sel.value = 'admin';
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            expect(formRef.getValue('role')).toBe('admin');
        });
    });

    // ─── Select Multiple ─────────────────────────────────────

    describe('select multiple', () => {
        it('updates form data with array of selected values', async () => {
            let formRef;
            Alpine.data('multiSelChange', () => ({
                form: Alpine.Form({ skills: [] }),
                init() {
                    formRef = this.form;
                },
            }));
            document.body.innerHTML = `
                <div x-data="multiSelChange">
                    <select x-register:form="form.field('skills')" multiple id="sel">
                        <option value="js">JS</option>
                        <option value="py">Python</option>
                        <option value="go">Go</option>
                    </select>
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            const sel = document.getElementById('sel');
            sel.options[0].selected = true;
            sel.options[2].selected = true;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            expect(formRef.getValue('skills')).toEqual(['js', 'go']);
        });
    });

    // ─── Textarea ────────────────────────────────────────────

    describe('textarea', () => {
        it('binds value from form data', async () => {
            Alpine.data('taBind', () => ({
                form: Alpine.Form({ bio: 'Hello' }),
            }));
            document.body.innerHTML = `
                <div x-data="taBind">
                    <textarea x-register:form="form.field('bio')" id="ta"></textarea>
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            expect(document.getElementById('ta').value).toBe('Hello');
        });

        it('updates form data on change', async () => {
            let formRef;
            Alpine.data('taChange', () => ({
                form: Alpine.Form({ bio: '' }),
                init() {
                    formRef = this.form;
                },
            }));
            document.body.innerHTML = `
                <div x-data="taChange">
                    <textarea x-register:form="form.field('bio')" id="ta"></textarea>
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            const ta = document.getElementById('ta');
            ta.value = 'New bio';
            ta.dispatchEvent(new Event('change', { bubbles: true }));
            expect(formRef.getValue('bio')).toBe('New bio');
        });
    });

    // ─── Component Scope ─────────────────────────────────────

    describe('component scope', () => {
        it('stores Alpine component scope on form._component', async () => {
            let formRef;
            Alpine.data('scopeComp', () => ({
                form: Alpine.Form({ name: '' }),
                init() {
                    formRef = this.form;
                },
            }));
            document.body.innerHTML = `
                <div x-data="scopeComp">
                    <input x-register:form="form.field('name')" type="text">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            expect(formRef._component).toBeTruthy();
            expect(formRef._component.form).toBeDefined();
        });
    });

    // ─── Field Change Events ─────────────────────────────────

    describe('field change events', () => {
        it('dispatches event when fieldChangeEventEnabled is true', async () => {
            const handler = vi.fn();
            Alpine.data('eventComp', () => ({
                form: Alpine.Form(
                    { name: '' },
                    {
                        config: { fieldChangeEventEnabled: true },
                    },
                ),
            }));
            document.body.innerHTML = `
                <div x-data="eventComp" @field-change.window="$event.detail">
                    <input x-register:form="form.field('name')" type="text" id="input">
                </div>
            `;
            window.addEventListener('field-change', handler);
            Alpine.start();
            await waitForAlpine();
            type(document.getElementById('input'), 'test');
            window.removeEventListener('field-change', handler);
        });
    });

    // ─── Validation Warnings ─────────────────────────────────

    describe('validation warnings', () => {
        it('warns when form reference is not a valid form object', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            Alpine.data('badFormComp', () => ({
                form: { notAForm: true },
            }));
            document.body.innerHTML = `
                <div x-data="badFormComp">
                    <input x-register:form="form" type="text">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            const alpineFormWarning = warn.mock.calls.find(
                (call) => call[0] && call[0].includes('did not resolve to a valid form object'),
            );
            expect(alpineFormWarning).toBeTruthy();
            warn.mockRestore();
        });
    });

    // ─── Register Element ────────────────────────────────────

    describe('registerElement', () => {
        it('registers the DOM element on the form', async () => {
            let formRef;
            Alpine.data('regComp', () => ({
                form: Alpine.Form({ name: '' }),
                init() {
                    formRef = this.form;
                },
            }));
            document.body.innerHTML = `
                <div x-data="regComp">
                    <input x-register:form="form.field('name')" type="text" id="input">
                </div>
            `;
            Alpine.start();
            await waitForAlpine();
            expect(formRef._fieldElements.name).toBe(document.getElementById('input'));
        });
    });
});
