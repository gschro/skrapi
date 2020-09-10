<template>
  <list-model :name="name" :pathPrefix="pathPrefix"></list-model>
</template>

<script>
import ListModel from '~/components/model/ListModel'

export default {
  name: 'ModelList',
  middleware: 'admin',
  components: {
    ListModel
  },
  data () {
    return {
      name: 'Model',
      pathPrefix: '/edit'
    }
  }
}
</script>
