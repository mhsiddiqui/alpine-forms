# Basic Example

# HTML

[filename](../../js/examples.js ':include :type=code')


<div x-data="basicForm()">
    <form class="pure-form" @submit.prevent="form.submit(submitFunction)">
        <div class="p-4">
            <div class="pure-u-1 pure-u-md-1-3">
                <label for="multi-first-name">Email</label>
                <input x-register:form="form.field('email')" class="pure-u-23-24" type="email" />
                <span x-show="!form.getFieldState('email').isValid" class="text-red"
                        x-text="form.getFieldState('email').error"></span>
            </div>
            <div class="pure-u-1 pure-u-md-1-3 mt-1">
                <label for="multi-first-name">Password</label>
                <input x-register:form="form.field('password')" class="pure-u-23-24" type="password" />
                <span x-show="!form.getFieldState('password').isValid" class="text-red"
                        x-text="form.getFieldState('password').error"></span>
            </div>
            <div class="field is-grouped mt-1">
                <button class="pure-button">Save</button>
                <button class="pure-button">Cancel</button>
            </div>
        </div>
    </form>
    <pre x-show="showResult" class="mt-1 p-1 border" x-text="result">
    </pre>
</div>