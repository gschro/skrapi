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
        :remotes="remotes"
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
      initialModel: {},
      contentTypeName: '',
      theModel: {},
      combined: []
    }
  },
  computed: {
    redirect () {
      const tab = this.backTab ? `?tab=${this.backTab}` : ''
      const redirect = `${this.pathPrefix}/${this.pluralLower}`
      const path = this.$route.path.replace(`/${this.$route.params.slug}`, '').replace('/new', '')
      const finalPath = path !== redirect ? path.replace(`/${this.pluralLower}`, '').replace(`/${this.contentTypeLabel.toLowerCase()}`, '') : path
      return finalPath + tab
    },
    contentTypeLabel () {
      return this.makeSingular(this.contentTypeName)
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
      // const route = this.modelName || this.pluralLower
      // const populatedModel = this.method === 'put' ? await this.fetchAndPopModel(route) : {}
      // this.finalModel = { ...populatedModel, ...this.model }

    const { path, params } = this.$route
    this.path = path
    const { data } = await this.getObject('/content-manager/content-types')
    const [contentType] = data.filter(({ schema }) => schema.collectionName === params.model)
    this.contentType = contentType
    this.contentTypeName = contentType.label
    const { data: meta } = await this.getObject(`/content-manager/content-types/${contentType.uid}`)
    // const { data: meta } = await this.getObject(`/content-manager/content-types/application::${params.model}.${params.model}`)
    this.contentTypeMeta = meta
    console.log('contentType', contentType)
    console.log('meta', meta)
    console.log('model param', params.model)
    console.log('id', params.id)
    const { metadatas, schema: { attributes }} = meta.contentType
    const componentMap = {
      integer: 'b-input',
      string: 'b-input',
      boolean: 'b-switch',
      decimal: 'b-input',
      relation: 'b-select',
      json: 'b-input'
    }
    const combined = Object.entries(metadatas)
      .map(([model, value]) => ({
        model,
        ...value.edit,
        ...attributes[model],
        component: componentMap[attributes[model].type],
        message: '',
        componentState: ''
      }))
      .filter(({visible}) => visible)
    console.log('combined', combined)
    this.combined = combined

    const model = await this.fetchAndPopModel(params.model, params.id, combined)
    console.log('model', model)
    this.theModel = model
    this.finalModel = { ...this.theModel, ...this.model }
      this.$emit(`got:initial:model:${this.contentTypeLabel.toLowerCase()}`, this.initialModel)
      this.$emit(`got:model:${this.contentTypeLabel.toLowerCase()}`, this.populatedModel)
      this.$emit(`got:merged:model:${this.contentTypeLabel.toLowerCase()}`, this.finalModel)
  },
  fetchOnServer: false,
}
</script>