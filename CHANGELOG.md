# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-04-12

### Added

- `Alpine.Form(data, options)` factory for creating reactive form instances inside `x-data`
- `x-register` directive with auto-binding for text, email, password, number, date, textarea, select, multi-select, checkbox, radio, and file inputs
- Form state tracking: `isValid`, `isValidating`, `isSubmitting`, `isSubmitted`, `isDirty`, `error`
- Field state tracking: `isValid`, `isDirty`, `isTouched`, `error`
- Five validation modes: `onChange`, `onBlur`, `onTouched`, `onSubmit`, `all`
- Pluggable schema validation via `config.validator` (works with Joi, Zod, or any custom adapter)
- Built-in `joiValidator` adapter for Joi schema validation
- Per-field custom validation functions with cross-field data access
- Async validation support with automatic race condition handling
- Manual error control: `setError()`, `clearErrors()`, `getErrors()`
- Form submission with `submit(callback)` — handles validation, async callbacks, error capture
- Reset with default value tracking: `reset()`, `reset(newDefaults)`, `getDefaults()`
- Dirty tracking: `getDirtyFields()` for PATCH-style partial updates
- Bulk value setting with `setValues()` for populating from API responses
- Single-field validation with `validateField(field)`
- Dynamic field management: `unregister()`, `updateSchema()`
- Auto-focus first invalid field on failed submit (`focusOnError` config)
- Field change events via Alpine's `$dispatch` (`fieldChangeEventEnabled` config)
- CDN build (IIFE), ESM, and CJS distribution formats
- Documentation site with docsify (search, live demos, API reference)
