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
      // make layout configurable
      // clean up api (attrs in object for dynamicity, preRender hook, preSubmit hook)
      // refactor (externalize config?, maybe via plugin or nuxt or env vars)
      // add uid support
      // caching of data (esp content type) via vuex
      // allow choosing to stay on page after save
      // add other relationship types
      // unit tests

      // post release
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
    const editor = this.editor
    const componentMap = {
      relation: { component: 'b-select' },
      string: { component: 'b-input' },
      text: { component: 'b-input', attrs: { type: 'textarea' } },
      richtext: { component: 'ckeditor', attrs: { editor: this.editor } },
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
      json: { component: 'v-jsoneditor', attrs: {options: { mode: 'text' } } },
      uid: { component: 'b-input' } // add front-end preview or hide?
    }
    // when "plugin": "upload" then b-upload
    this.options['type'] = ['Roller Coaster', 'Flat Ride', 'Dark Ride', 'Water Ride', 'Family Ride', 'Kids Ride', 'Thrill Ride'].sort()
    const combined = Object.entries(metadatas)
      .map(([field, value]) => {
        const compMap = componentMap[attributes[field].type]
        const remote = attributes[field].via ? { remote: attributes[field].model } : {}
        const hasOptions = this.options[field] || attributes[field].enum
        const options = hasOptions ? { options: hasOptions } : {}
        const optionsComp = hasOptions  ? { component: 'b-select' } : {}
        const component = hasOptions ? optionsComp : compMap
        // const componentType = subtypeLookup[attributes[field].type]|| 'text'
        // const disabled = !!attributes[field].configurable
        const { attrs = {}, ...comp } = component || {}
        // const attrs = component && component.attrs || {}
        console.log('field!', field)
        if(attributes[field].type === 'integer') console.log('attributes', attributes[field])
        attrs.disabled = !!attributes[field].configurable
        if(attributes[field].required){
          attrs['aria-required'] = true
          attrs.required = true
        }
        if(attributes[field].min){
          attrs.min = String(attributes[field].min)
        }
        if(attributes[field].max){
          attrs.max = String(attributes[field].max)
        }

      return {
        field,
        ...value.edit,
        ...attributes[field],
        ...{ ...component, ...attrs },
        message: '',
        componentState: '',
        ...remote,
        ...options
      }
      })
      .filter(({visible}) => visible)
      .filter((a) => !a.private)

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
    this.combined = combined

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


    // fix date fields: new Date(Date.parse(a))
      this.$emit(`got:initial:model:${this.contentTypeLabel.toLowerCase()}`, this.initialModel)
      this.$emit(`got:model:${this.contentTypeLabel.toLowerCase()}`, this.populatedModel)
      this.$emit(`got:merged:model:${this.contentTypeLabel.toLowerCase()}`, this.finalModel)
  },
  fetchOnServer: false,
}
</script>