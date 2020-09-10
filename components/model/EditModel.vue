<template>
  <section class="section">
    <fetch-pending :pending="$fetchState.pending" :label="nameLabel">
      <template v-slot:pending>
        <form-skeleton></form-skeleton>
      </template>
      <div class="level">
        <span class="level-left">
          <ul>
            <li><heading-one :label="nameLabel" v-if="!hideTitle"></heading-one></li>
            <li><sub-link :path="redirect" :label="backLabel" v-if="!hideBackLink"></sub-link></li>
          </ul>
        </span>
        <b-button v-if="method === 'put'" type="is-danger" class="mt-2 level-right" icon-left="delete" @click="confirmDelete">Delete</b-button>
      </div>

      <form-fields
        :name="name"
        :plural="plural"
        :method="method"
        :fields="fields"
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
    name: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    remotes: {
      type: Object,
      default: {}
    },
    fields: {
      type: Array,
      required: true,
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
      initialModel: {},
    }
  },
  computed: {
    redirect () {
      const tab = this.backTab ? `?tab=${this.backTab}` : ''
      const redirect = `${this.pathPrefix}/${this.pluralLower}`
      const path = this.$route.path.replace(`/${this.$route.params.slug}`, '').replace('/new', '')
      const finalPath = path !== redirect ? path.replace(`/${this.pluralLower}`, '').replace(`/${this.name.toLowerCase()}`, '') : path
      return finalPath + tab
    },
  },
  methods: {
    confirmDelete() {
      this.$buefy.dialog.confirm({
          title: `Delete ${this.name}`,
          message: `Are you sure you want to <b>delete</b> this ${this.name}? This action cannot be undone.`,
          confirmText: 'Delete',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: async () => {
            await this.deleteModelById(this.pluralLower, this.finalModel.id)
            this.$router.push(`${this.redirect}?message=${this.name} deleted!`)
          }
      })
    }
  },
  async fetch () {
      const route = this.modelName || this.pluralLower
      const populatedModel = this.method === 'put' ? await this.fetchAndPopModel(route) : {}
      this.finalModel = { ...populatedModel, ...this.model }

      this.$emit(`got:initial:model:${this.name.toLowerCase()}`, this.initialModel)
      this.$emit(`got:model:${this.name.toLowerCase()}`, this.populatedModel)
      this.$emit(`got:merged:model:${this.name.toLowerCase()}`, this.finalModel)
  },
  fetchOnServer: false,
}
</script>