# skrapi

netlify.toml, replace BASE_URL=https://ancient-thicket-40521.herokuapp.com/ with your url

Some design pulled from: https://github.com/app-generator/bulmaplay

# TODO
## alpha
- clean up api
- uid, add front-end preview or hide?
- add other relationship types
- unit tests

## roadmap
- clean up api (attrs in object for dynamicity, preRender hook, preSubmit hook)
- refactor (externalize config?, maybe via plugin or nuxt or env vars)
- caching of data (esp content type) via vuex
- media upload filter types
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