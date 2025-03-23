# Schema Validation

A simple example without validation and no initial data is show below. 

<!-- tabs:start -->
#### **Output**
<div x-data="schemaValidation()">
    <form class="pure-form" @submit.prevent="form.submit((data) => submitHandler(data))">
        <div class="p-4">
            <div class="pure-u-1 pure-u-md-1-3">
                <label for="first_name">First Name</label>
                <input x-register:form="form.field('first_name')" class="pure-u-23-24" type="text" />
                <div style="color: red" x-field-error:form="form.error('first_name', {isValid: false, isDirty: true})"></div>
            </div>
            <div class="pure-u-1 pure-u-md-1-3 mt-1">
                <label for="last_name">Last Name</label>
                <input x-register:form="form.field('last_name')" class="pure-u-23-24" type="text" />
                <div style="color: red" x-field-error:form="form.error('last_name', {isValid: false, isDirty: true})"></div>
            </div>
            <div class="field is-grouped mt-1">
                <button class="pure-button">Save</button>
                <button type="button" @click="form.reset()" class="pure-button">Cancel</button>
            </div>
        </div>
    </form>
    <pre x-show="showResult" class="mt-1 p-1 border" x-text="result">
    </pre>
</div>
#### **JavaScript**
[filename](../../js/basic.js ':include')

#### **HTML**
```html
<div x-data="schemaValidation()">
    <form class="pure-form" @submit.prevent="form.submit((data) => submitHandler(data))">
        <div class="p-4">
            <div class="pure-u-1 pure-u-md-1-3">
                <label for="first_name">First Name</label>
                <input x-register:form="form.field('first_name')" class="pure-u-23-24" type="text" />
            </div>
            <div class="pure-u-1 pure-u-md-1-3 mt-1">
                <label for="last_name">Last Name</label>
                <input x-register:form="form.field('last_name')" class="pure-u-23-24" type="text" />
            </div>
            <div class="field is-grouped mt-1">
                <button class="pure-button">Save</button>
                <button type="button" @click="form.reset()" class="pure-button">Cancel</button>
            </div>
        </div>
    </form>
    <pre x-show="showResult" class="mt-1 p-1 border" x-text="result">
    </pre>
</div>
```
<!-- tabs:end -->