import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { toBool } from './utils'

const componentMap = {
  relation: { component: 'b-select' },
  string: { component: 'b-input' },
  text: { component: 'b-input', attrs: { type: 'textarea' } },
  richtext: { component: 'ckeditor', attrs: { editor: ClassicEditor } },
  email: { component: 'b-input', attrs: { type: 'email' } },
  password: { component: 'b-input', attrs: { type: 'password' } },
  integer: { component: 'b-numberinput', attrs: { step: 1 }},
  biginteger: { component: 'b-input', attrs: { step: 1 }},
  float: { component: 'b-numberinput' },
  decimal: { component: 'b-numberinput' },
  date: { component: 'b-datepicker' },
  time: { component: 'b-clockpicker' },
  datetime: { component: 'b-datetimepicker' },
  boolean: { component: 'b-switch' },
  enumeration: { component: 'b-select' },
  json: { component: 'v-jsoneditor', attrs: { options: { mode: 'text' } } },
  uid: { component: 'b-input' },
  media: { component: 'b-upload', attrs: {} }
}

Object.keys(componentMap).forEach(key => {
  componentMap[key].class = 'is-one-third-widescreen is-12-mobile column mb-3 small-gap no-marginb'
})

const conditionalAttrs = [
  {
    field: 'disabled',
    valueKey: 'configurable',
    preTransform: toBool
  },
  {
    field: 'required',
    valueKey: 'required'
  },
  {
    field: 'aria-required',
    valueKey: 'required'
  },
  {
    field: 'min',
    valueKey: 'min',
    postTransform: a => String(a)
  },
  {
    field: 'max',
    valueKey: 'max',
    postTransform: a => String(a)
  },
  {
    field: 'multiple',
    valueKey: 'multiple',
    condition: (value, field) => field.type === 'media' && field.multiple
  },
  {
    field: 'placeholder',
    valueKey: 'placeholder'
  }
]

export {
  componentMap,
  conditionalAttrs
}