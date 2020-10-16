# skrapi

netlify.toml, replace BASE_URL=localhost:1337 with your url

Some design pulled from: https://github.com/app-generator/bulmaplay

# TODO
## alpha
- clean up api
- unit tests

## roadmap
- clean up api (attrs in object for dynamicity, preRender hook, preSubmit hook)
- add publishing support
- refactor (externalize config?, maybe via plugin or nuxt or env vars)
- caching of data (esp content type) via vuex
- add other relationship types (only one to many is supported)
- media upload filter types
- uid, add front-end preview or hide?
- add support for single types etc.
- fix min/max validations is-danger missing
- add custom validations
- add validations (unique? via remote?)
- allow configuration per field
- add remote filtering, maybe templating for dropdown
- allow related fields in table/lists
- add counts for model entries
- sidebar for content types?
- bulk updates? select/delete from lists

- allow using slug (or other field? instead of id)
- add tabs?