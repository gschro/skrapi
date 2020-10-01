<template>
  <section class="section">
    <fetch-pending :pending="$fetchState.pending">
      <template v-slot:pending>
        <form-skeleton></form-skeleton>
      </template>
      <div class="level">
        <span class="level-left">
          <ul>
            <li><heading-one :label="contentTypeLabel" v-if="!hideTitle"></heading-one></li>
            <li><sub-link :path="redirect" :label="backLabel" v-if="!hideBackLink"></sub-link></li>
          </ul>
        </span>
        <b-button v-if="method === 'put'" type="is-danger" class="mt-2 level-right" icon-left="delete" @click="confirmDelete">Delete</b-button>
      </div>

      <form-fields
        :name="contentTypeLabel"
        :plural="plural"
        :method="method"
        :fields="combined"
        :model="finalModel"
        :remotes="finalRemotes"
        :redirect="redirect"
        :modelName="modelName"
        :wrapperComponent="wrapperComponent"
      >
      </form-fields>
    </fetch-pending>
  </section>
</template>

<style>
section.section {
  width: 100%;
}
</style>

<script>
// components
import FetchPending from '~/components/FetchPending'
import FormFields from '~/components/FormFields'
import SubLink from '~/components/SubLink'
import HeadingOne from '~/components/HeadingOne'
import FormSkeleton from '~/components/skeleton/FormSkeleton'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

// mixins
import pluralName from '~/mixins/pluralName'
import fetchModel from '~/mixins/fetchModel'
import editLabels from '~/mixins/editLabels'

const toBool = a => !!a
const condition = toBool

const componentMap = {
  relation: { component: 'b-select' },
  string: { component: 'b-input' },
  text: { component: 'b-input', attrs: { type: 'textarea' } },
  richtext: { component: 'ckeditor', attrs: {} },
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

const addAttribute = (obj, { add, field, value, postTransform = a => a }) => {
  if (add) {
    return {
      ...obj,
      [field]: postTransform(value)
    }
  }
  return obj
}

export default {
  name: 'EditModel',
  mixins: [
    editLabels,
    fetchModel,
    pluralName,
  ],
  components: {
    FetchPending,
    FormFields,
    FormSkeleton,
    HeadingOne,
    SubLink,
  },
  props: {
    // name: {
    //   type: String,
    //   required: true,
    // },
    method: {
      type: String,
      required: true,
    },
    remotes: {
      type: Object,
      default: {}
    },
    // fields: {
    //   type: Array,
    //   required: true,
    // },
    pathPrefix: {
      type: String,
      default: '',
    },
    model: {
      type: Object
    },
    modelName: {
      type: String
    },
    backTab: {
      type: String,
      default: ''
    },
    hideBackLink: {
      type: Boolean,
      default: false
    },
    hideTitle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      finalModel: {},
      finalRemotes: {},
      initialModel: {},
      name: '',
      theModel: {},
      combined: [],
      relations: {},
      options: {},
      editor: ClassicEditor,
      wrapperComponent: 'b-field'
    }
  },
  computed: {
    redirect () {
      const redirect = `${this.pathPrefix}/${this.pluralLower}`
      const path = this.$route.path.replace(`/${this.$route.params.id}`, '').replace('/new', '')
      const finalPath = path !== redirect ? path.replace(`/${this.pluralLower}`, '').replace(`/${this.contentTypeLabel.toLowerCase()}`, '') : path
      return finalPath
    },
    contentTypeLabel () {
      return this.makeSingular(this.name)
    },
  },
  methods: {
    confirmDelete() {
      this.$buefy.dialog.confirm({
          title: `Delete ${this.contentTypeLabel}`,
          message: `Are you sure you want to <b>delete</b> this ${this.contentTypeLabel}? This action cannot be undone.`,
          confirmText: 'Delete',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: async () => {
            await this.deleteModelById(this.pluralLower, this.finalModel.id)
            this.$router.push(`${this.redirect}?message=${this.contentTypeLabel} deleted!`)
          }
      })
    }
  },
  async fetch () {
      // clean up api (attrs in object for dynamicity, preRender hook, preSubmit hook)
      // refactor (externalize config?, maybe via plugin or nuxt or env vars)
      // uid, add front-end preview or hide?
      // caching of data (esp content type) via vuex
      // add other relationship types
      // unit tests

      // post release
      // media upload filter types
      // add support for single types etc.
      // fix min/max validations is-danger missing
      // add custom validations
      // add validations (unique? via remote?)
      // allow configuration per field
      // allow using slug (or other field? instead of id)
      // add remote filtering, maybe templating for dropdown
      // allow related fields in table/lists
      // add counts for model entries
      // sidebar for content types?
      // bulk updates? select/delete from lists
      // add tabs?

    const { path, params } = this.$route
    this.path = path
    const { data } = await this.getObject('/content-manager/content-types')
    const [contentType] = data.filter(({ schema }) => schema.collectionName === params.model)
    // this.contentType = contentType
    this.name = contentType.label
    const { data: meta } = await this.getObject(`/content-manager/content-types/${contentType.uid}`)
    // const { data: meta } = await this.getObject(`/content-manager/content-types/application::${params.model}.${params.model}`)
    this.contentTypeMeta = meta
    const { metadatas, schema: { attributes }} = meta.contentType
    componentMap.richtext.attrs.editor = this.editor

    const combined = Object.entries(metadatas)
      .map(([field, value]) => {
        const attribute = { ...value.edit, ...attributes[field] }
        const { attrs: pAttrs = {}, ...comp } = componentMap[attribute.type] || {}
        const attrs = Object.assign({}, pAttrs)

        const finalAttrs = conditionalAttrs.map(({ valueKey, condition = toBool, ...attrib }) => {
          const value = attribute[valueKey]
          const add = condition(value, attribute)
          return {
            add,
            value,
            ...attrib
          }
        }).reduce((acc, cv) => addAttribute(acc, cv), attrs)

        const hasOptions = this.options[field] || attribute.enum
        const options = hasOptions ? { options: hasOptions } : {}
        const remote = attribute.via ? { remote: attribute.model } : {}
        const { default: defaultValue, description, editable, label, required, type, unique, visible } = attribute
        const commonAttrs = {
          default: defaultValue, description, editable, label, required, type, unique, visible
        }

        return {
          field,
          ...commonAttrs,
          component: {
            is: comp.component,
            attrs: finalAttrs,
            class: comp.class,
            message: '',
            componentState: '',
            ...options,
            ...remote
          }
        }
      })
      .filter(({ visible }) => visible)
      .filter((a) => !a.private)

    this.combined = combined

    const dateFields = combined.filter(a => ['date','datetime','time'].includes(a.type))

    console.log('combined', combined)
    const modelsWRels = combined.filter(a => a.remote)
    const relations = {}
    const memo = {}

    for(const model of modelsWRels){
      const relModel = this.makePlural(model.model)
      if (this.remotes[relModel]){
        continue
      }
      if(memo[relModel]){
        relations[model.field] = memo[relModel]
      }
      else {
        const resp = await this.getModel(relModel, null, true)
        relations[model.field] = resp
        memo[relModel] = resp
      }
    }

    this.finalRemotes = { ...relations, ...this.remotes }

    const model = await this.fetchAndPopModel(params.model, params.id, combined)
    this.theModel = model

    dateFields.forEach(a => {
      if (this.theModel && this.theModel[a.field]){
          if(a.type === 'date' || a.type === 'datetime') {
            this.theModel[a.field] = new Date(Date.parse(this.theModel[a.field]))
          }
          if(a.type==='time'){
            const dateObj = new Date();
            const dateStr = dateObj.toISOString().split('T').shift();
            const timeStr = this.theModel[a.field];
            const timeAndDate = new Date(Date.parse(dateStr + ' ' + timeStr))
            this.theModel[`${a.field}_skrapi_time`] = timeAndDate
          }
      }
      if (this.model && this.model[a.field]){
        if(a.type === 'date' || a.type === 'datetime') {
          this.model[a.field] = new Date(Date.parse(this.model[a.field]))
        }
        if(a.type === 'time') {
            const dateObj = new Date();
            const dateStr = dateObj.toISOString().split('T').shift();
            const timeStr = this.model[a.field];
            const timeAndDate = new Date(Date.parse(dateStr + ' ' + timeStr))
            this.model[a.field] = timeAndDate
        }
      }
    })
    this.finalModel = { ...this.theModel, ...this.model }

    this.$emit(`got:initial:model:${this.contentTypeLabel.toLowerCase()}`, this.initialModel)
    this.$emit(`got:model:${this.contentTypeLabel.toLowerCase()}`, this.populatedModel)
    this.$emit(`got:merged:model:${this.contentTypeLabel.toLowerCase()}`, this.finalModel)
  },
  fetchOnServer: false,
}
</script>