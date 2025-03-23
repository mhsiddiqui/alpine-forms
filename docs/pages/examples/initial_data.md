# Initial Data

For loading initial data in your form, you need to pass initial data when creating form. For detail, see below example

<!-- tabs:start -->
#### **Output**
<div x-data="initialData()">
    <form class="pure-form" @submit.prevent="form.submit((data) => submitHandler(data))">
        <div class="p-4">
            <div class="pure-u-1 pure-u-md-1-3">
                <label for="email">Email</label>
                <input x-register:form="form.field('email')" class="pure-u-23-24" type="email" />
            </div>
            <div class="pure-u-1 pure-u-md-1-3 mt-1">
                <label for="name">Name</label>
                <input x-register:form="form.field('name')" class="pure-u-23-24" type="text" />
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
[filename](../../js/initial_data.js ':include')

#### **HTML**
```html
<div x-data="initialData()">
    <form class="pure-form" @submit.prevent="form.submit((data) => submitHandler(data))">
        <div class="p-4">
            <div class="pure-u-1 pure-u-md-1-3">
                <label for="email">Email</label>
                <input x-register:form="form.field('email')" class="pure-u-23-24" type="email" />
            </div>
            <div class="pure-u-1 pure-u-md-1-3 mt-1">
                <label for="name">Name</label>
                <input x-register:form="form.field('name')" class="pure-u-23-24" type="text" />
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