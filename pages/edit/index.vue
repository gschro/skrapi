<template>
<div class="container">
  <section class="section">
    <div class="columns is-mobile is-multiline">
      <div v-for="(contentType, key) of contentTypes" :key="key" class="column is-2-desktop is-12-mobile small-gap">
        <nuxt-link
            :to="{ path: `${path}/${contentType.collection}` }"
            class="button is-active is-large is-fullwidth"
            exact-active-class="is-active">
          {{contentType.label}}
        </nuxt-link>
      </div>
    </div>
  </section>
</div>
</template>

<style scoped>
.column.small-gap {
  padding: .4rem;
}
</style>

<script>
// mixins
import fetchModel from '~/mixins/fetchModel'
import sort from '~/mixins/sort'

export default {
  name: 'EditPage',
  middleware: 'admin',
  mixins: [
    fetchModel,
    sort
  ],
  data () {
    return {
     contentTypes: [],
    }
  },
  async fetch () {
    const { path } = this.$route
    this.path = path
    const { data } = await this.getObject('/content-manager/content-types')
    const contentTypes = data.filter(({ isDisplayed }) => isDisplayed)
      .map(({ label, schema, uid }) => ({
        label,
        collection: schema.collectionName,
        uid
      }))
      .sort(this.by('label'))
    this.contentTypes = contentTypes
  },
  fetchOnServer: false,
}
</script>
