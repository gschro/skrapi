<template>
  <edit-model
    :method="method"
    :pathPrefix="pathPrefix"
  >
  </edit-model>
</template>

<script>
import EditModel from '~/components/model/EditModel'

export default {
  name: 'NewModel',
  middleware: 'admin',
  components: {
    EditModel,
  },
  data () {
    return {
      method: 'post',
      pathPrefix: '/edit',
    }
  },
}
</script>