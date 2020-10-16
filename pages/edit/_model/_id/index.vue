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
import sort from '~/mixins/sort'

// other
import { fetchModel } from '~/skrapi/fetch'

export default {
  name: 'EditModelContainer',
  middleware: 'admin',
  mixins: [
    editLabels,
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
            'Operations',
            'Design',
          ],
          required: true
        },
      ],
    }
  },
  async fetch () {
    // const test = await fetchModel(this.$route)
    // console.log('test', test)
    // const {
    //   path,
    //   contentType,
    //   initialModel,
    //   meta,
    //   model
    // } = test
    // this.path = path
    // this.contentType = contentType
    // this.contentTypeMeta = meta
    // this.model = model
    // this.initialModel = initialModel
  },
  fetchOnServer: false,
}
</script>