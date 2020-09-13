<template>
  <edit-model
    :name="name"
    :fields="fields"
    :method="method"
    :remotes="remotes"
    :pathPrefix="editPath"
  >
  </edit-model>
</template>

<script>
// components
import EditModel from '~/components/model/EditModel'

// mixins
import editLabels from '~/mixins/editLabels'
import fetchModel from '~/mixins/fetchModel'
import sort from '~/mixins/sort'

export default {
  name: 'EditPark',
  middleware: 'admin',
  mixins: [
    editLabels,
    fetchModel,
    sort
  ],
  components: {
    EditModel,
  },
  data () {
    return {
      name: 'Company',
      method: 'put',
      remotes: {},
      fields: [
        {
          model: 'name',
          label: 'Name',
          message: '',
          type: '',
          component: 'b-input',
          required: true
        },
        {
          model: 'official_name',
          label: 'Official Name',
          message: '',
          type: '',
          component: 'b-input'
        },
        {
          model: 'slug',
          label: 'Slug',
          message: '',
          type: '',
          component: 'b-input',
          required: true
        },
        {
          model: 'website',
          label: 'Website',
          message: '',
          type: '',
          component: 'b-input'
        },
        {
          model: 'type',
          label: 'Type',
          message: '',
          type: '',
          component: 'b-select',
          options: [
            'Blog/Social',
            'Park Operator',
            'Ride Design',
          ],
          required: true
        },
      ],
    }
  },
  async fetch () {
    const { path, params } = this.$route
    this.path = path
    const { data } = await this.getObject('/content-manager/content-types')
    const [contentType] = data.filter(({ schema }) => schema.collectionName === params.model)
    this.contentType = contentType
    const { data: meta } = await this.getObject(`/content-manager/content-types/${contentType.uid}`)
    // const { data: meta } = await this.getObject(`/content-manager/content-types/application::${params.model}.${params.model}`)
    this.contentTypeMeta = meta
    const model = await this.fetchAndPopModel(params.model, params.id)
    this.model = model
    // combine responses to create "fields"
    //  create map of field types to buefy fields (add missing from other packages or create)
  },
  fetchOnServer: false,
}
</script>