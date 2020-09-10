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
  name: 'EditPark',
  middleware: 'admin',
  components: {
    EditModel,
  },
  data () {
    return {
      name: 'Company',
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
}
</script>