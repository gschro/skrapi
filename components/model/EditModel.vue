<template>
<div class="container">
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
        class="box"
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
</div>
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
import editLabels from '~/mixins/editLabels'

// other
import { editModel, fetchSchema, fetchModel, getFieldRelations, mapFields, mapDateFields } from '~/skrapi/fetch'
import { componentMap, conditionalAttrs } from '~/skrapi/component'

export default {
  name: 'EditModel',
  mixins: [
    editLabels,
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
    method: {
      type: String,
      required: true,
    },
    remotes: {
      type: Object,
      default: {}
    },
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
    const { path, params } = this.$route
    this.path = path

    // set richtext editor
    const componentMapOverrides = {} // { richtext: { attrs: { editor: this.editor } } }

    // get content type metadata
    const { combined, contentType, finalModel, finalRemotes, name } = await editModel({ params, model: this.model, componentMapOverrides, options: this.options, remotes: this.remotes })
    this.name = name
    this.combined = combined
    this.finalRemotes = finalRemotes
    this.finalModel = finalModel
  },
  fetchOnServer: false,
}
</script>