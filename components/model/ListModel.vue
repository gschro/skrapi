<template>
<div class="container">
  <section class="section">
    <div class="level">
      <span class="level-left">
        <ul>
          <li><heading-one :label="allLabel" v-if="!hideTitle" class="mb-0 is-block"></heading-one> ({{this.count}})</li>
          <li><sub-link :path="`${pathPrefix}`" label="Edit" v-if="!hideBackLink"></sub-link></li>
        </ul>
      </span>
      <b-button tag="nuxt-link" type="is-primary" class="fa-3x level-right mb-2" size="is-medium" :to="{ path: `${finalPathPrefix}/new` }" icon-left="plus">
        New {{singluarName}}
      </b-button>
    </div>

       <fetch-pending :pending="$fetchState.pending" :label="allLabel">
         <template v-slot:pending>
           <table-skeleton :showHeader="!hideTitle"></table-skeleton>
         </template>

        <b-table
          v-if="count < 101"
          class="mt-2"
          :data="theData"
          :columns="columns"
          :paginated="isPaginated"
          :per-page="limit"
          :current-page.sync="page"
          :pagination-simple="isPaginationSimple"
          :pagination-position="paginationPosition"
          :default-sort-direction="defaultSortOrder"
          :sort-icon="sortIcon"
          :sort-icon-size="sortIconSize"
          :hoverable="true"
          :striped="true"
          :narrowed="false"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
          @click="linkToEntry">
        </b-table>

        <b-table
          v-else
          class="mt-2"
          :data="theData"
          :columns="columns"
          :loading="loading"
          :paginated="isPaginated"
          :per-page="limit"
          :current-page.sync="page"
          :pagination-simple="isPaginationSimple"
          :pagination-position="paginationPosition"
          :sort-icon="sortIcon"
          :sort-icon-size="sortIconSize"
          :hoverable="true"
          :striped="true"
          :narrowed="false"
          :total="count"
          backend-pagination
          backend-sorting
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
          :default-sort-direction="defaultSortOrder"
          :default-sort="[sortField, sortOrder]"
          @sort="onSort"
          @click="linkToEntry"
          @page-change="onPageChange">
        </b-table>
      </fetch-pending>
  </section>
</div>
</template>

<style>
.table tr {
  cursor: pointer;
}
</style>

<script>
// components
import FetchPending from '~/components/FetchPending'
import SubLink from '~/components/SubLink'
import HeadingOne from '~/components/HeadingOne'
import TableSkeleton from '~/components/skeleton/TableSkeleton'

// mixins
import pluralName from '~/mixins/pluralName'
import editLabels from '~/mixins/editLabels'
import fetchModel from '~/mixins/fetchModel'

export default {
  name: 'ListModel',
  mixins: [
    pluralName,
    editLabels,
    fetchModel
  ],
  components: {
    FetchPending,
    HeadingOne,
    SubLink,
    TableSkeleton
  },
  props: {
    name: {
      type: String,
      required: true
    },
    pathPrefix: {
      type: String,
      default: ''
    },
    singularPath: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array
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
  computed: {
    finalPathPrefix () {
      const name = this.name ? this.name.toLowerCase() : ''
      return this.singularPath ? `${this.pathPrefix}/${name}` : `${this.pathPrefix}/${this.pluralLower}`
    },
    allLabel () {
      return this.singularPath ? `All ${this.name}` : this.backLabel
    },
    theData () {
      return this.data || this.fetchData
    },
    singluarName () {
      return this.makeSingular(this.name)
    },
    startPage () {
      return (this.page - 1) * this.limit
    }
  },
  data () {
    return {
      fetchData: [],
      // routeParam: 'id',
      limit: 100,
      start: 0,
      loading: false,
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: 'both',
      sortField: 'id',
      sortOrder: 'asc',
      defaultSortOrder: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      page: 1,
      columns: [],
      count: 0
    }
  },
  mounted () {
    const { message = '' } = this.$route.query
    if (message) {
      this.$buefy.toast.open(message)
    }
  },
  methods: {
    linkToEntry(row) {
      this.$router.push(`${this.finalPathPrefix}/${row['id']}`)
    },
    async loadAsyncData() {
        this.loading = true
        console.log('tests', this.pluralLower)
        this.fetchData = await this.$axios.$get(`/${this.pluralLower}`, { params: { _sort: `${this.sortField}:${this.sortOrder.toUpperCase()}`, _start: this.startPage, _limit: this.limit }})
        this.loading = false
    },
    async onPageChange(page) {
        this.page = page
        await this.loadAsyncData()
    },
    async onSort(field, order) {
        this.sortField = field
        this.sortOrder = order
        await this.loadAsyncData()
    },
  },
  async fetch () {
    // get count, if 100 or less then front-end search otherwise api search, allow overwrite with limit
    // get columns, format:
    // get
    //field, label, numeric, centered
    const { path, params } = this.$route
    // this.path = path
    const { data } = await this.getObject('/content-manager/content-types')
    const [contentType] = data.filter(({ schema }) => schema.collectionName === params.model)
    const { data: meta } = await this.getObject(`/content-manager/content-types/${contentType.uid}`)
    // this.contentType = contentType

    console.log('contentType', contentType)
    console.log('meta', meta)
    const list = meta.contentType.layouts.list
    const filteredMetas = Object.entries(meta.contentType.metadatas).filter(([key, value]) => {
        console.log('key', key)
      return list.includes(key)
    }).map(([key,value]) => ({
      field: key,
      ...value.list
    }))
    // add in filter for backend paginated
    // add in type?
    // add in option for string truncation?
    const count = await this.$axios.$get(`/${this.pluralLower}/count`)
    console.log('count', count)
    this.count = count

    this.columns = count > 100 ? filteredMetas.map(({searchable, ...a}) => (a)) : filteredMetas
    console.log('filteredMetas', filteredMetas)
    if (!this.data){
      await this.loadAsyncData()// await this.$axios.$get(`/${this.pluralLower}`, { params: { _sort: 'name:ASC' }})
      console.log('fd', this.fetchData)
      console.log('fetchData', this.fetchData.length)
      console.log('params', this.$route.params)
    }
  },
  fetchOnServer: false,
}
</script>
