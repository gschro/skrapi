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
      options: {}
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
      // const route = this.modelName || this.pluralLower
      // const populatedModel = this.method === 'put' ? await this.fetchAndPopModel(route) : {}
      // this.finalModel = { ...populatedModel, ...this.model }

    const { path, params } = this.$route
    this.path = path
    const { data } = await this.getObject('/content-manager/content-types')
    const [contentType] = data.filter(({ schema }) => schema.collectionName === params.model)
    this.contentType = contentType
    this.name = contentType.label
    const { data: meta } = await this.getObject(`/content-manager/content-types/${contentType.uid}`)
    // const { data: meta } = await this.getObject(`/content-manager/content-types/application::${params.model}.${params.model}`)
    this.contentTypeMeta = meta
    const { metadatas, schema: { attributes }} = meta.contentType
    const componentMap = {
      integer: 'b-input',
      string: 'b-input',
      boolean: 'b-switch',
      decimal: 'b-input',
      relation: 'b-select',
      json: 'b-input'
    }
    this.options['type'] = ['Roller Coaster', 'Flat Ride', 'Dark Ride', 'Water Ride', 'Family Ride', 'Kids Ride', 'Thrill Ride'].sort()
    const combined = Object.entries(metadatas)
      .map(([field, value]) => {
        const remote = attributes[field].via ? { remote: attributes[field].model } : {}
        const options = this.options[field] ? { options: this.options[field] } : {}
      return {
        field,
        ...value.edit,
        ...attributes[field],
        component: this.options[field] ? 'b-select' : componentMap[attributes[field].type],
        message: '',
        componentState: '',
        ...remote,
        ...options
      }
      })
      .filter(({visible}) => visible)
      // .reduce((field, acc)=>{
      //   acc[field] =
      //   return acc
      // }, {})

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
    this.finalModel = { ...this.theModel, ...this.model }
      this.$emit(`got:initial:model:${this.contentTypeLabel.toLowerCase()}`, this.initialModel)
      this.$emit(`got:model:${this.contentTypeLabel.toLowerCase()}`, this.populatedModel)
      this.$emit(`got:merged:model:${this.contentTypeLabel.toLowerCase()}`, this.finalModel)
  },
  fetchOnServer: false,
}
</script>