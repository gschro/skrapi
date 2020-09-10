<template>
  <edit-model
    :name="name"
    :fields="fields"
    :method="method"
    :remotes="remotes"
    :pathPrefix="pathPrefix"
  >
  </edit-model>
</template>

<script>
import EditModel from '~/components/model/EditModel'

export default {
  name: 'EditSlug',
  middleware: 'admin',
  components: {
    EditModel,
  },
  data () {
    return {
      name: 'model',
      method: 'put',
      pathPrefix: '/edit',
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
          model: 'slug',
          label: 'Slug',
          message: '',
          type: '',
          component: 'b-input',
          required: true
        },
        {
          model: 'type',
          label: 'Type',
          message: '',
          type: '',
          component: 'b-select',
          options: [
            'Type 1',
            'Type 2',
            'Type 3',
          ],
          required: true
        },
      ],
    }
  },
}
</script>