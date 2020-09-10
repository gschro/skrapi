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
      name: this.$route.params.model,
      pathPrefix: this.$route.path.replace(`/${this.$route.params.model}`, '')
    }
  }
}
</script>
