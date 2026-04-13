# Events

## `eventData(field, type?, extras?)`

Build an event payload object. Used internally by the directive.

```js
form.eventData('email', 'change', { section: 'contact' });
// { field: 'email', type: 'change', value: '...', section: 'contact', ...formExtras }
```

If `config.fieldChangeHasAllData` is `true`, the payload also includes `formData` (the full data object).

## `getEventName(eventData)`

Resolve the event name from event data. Returns `config.fieldChangeEventName` for `'change'` type, otherwise returns the type string.

## `trigger(element, eventData)`

Dispatch a custom event via `element.$dispatch()`.

## Listening for Events

```html
<div
    x-data="{ form: Alpine.Form({}, { config: { fieldChangeEventEnabled: true } }) }"
    @field-change.window="console.log($event.detail)"
>
    <input x-register:form="form.field('name')" type="text" />
</div>
```
