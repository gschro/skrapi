<template>
<div class="container">
  <section class="section">
    <div class="level">
      <span class="level-left">
        <ul>
          <li><heading-one :label="allLabel" v-if="!hideTitle" class="mb-0 is-block"></heading-one></li>
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
          class="mt-2"
          :data="theData"
          :paginated="isPaginated"
          :per-page="perPage"
          :current-page.sync="currentPage"
          :pagination-simple="isPaginationSimple"
          :pagination-position="paginationPosition"
          :default-sort-direction="defaultSortDirection"
          :sort-icon="sortIcon"
          :sort-icon-size="sortIconSize"
          default-sort="name"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page">

            <b-table-column field="id" label="ID" width="40" sortable numeric searchable v-slot="props">
             {{ props.row.id }}
            </b-table-column>

            <b-table-column field="name" label="Name" searchable sortable v-slot="props">
              <nuxt-link :to="{ path: `${finalPathPrefix}/${props.row[routeParam]}` }" exact-active-class="is-active">
                {{ props.row.name }}
              </nuxt-link>
            </b-table-column>

            <b-table-column field="slug" label="Slug" searchable sortable v-slot="props">
              {{ props.row.slug }}
            </b-table-column>

            <b-table-column field="date" label="Created On" searchable sortable centered v-slot="props">
              <span class="tag is-success">
                {{ new Date(props.row.created_at).toLocaleDateString() }}
              </span>
            </b-table-column>
        </b-table>
      </fetch-pending>
  </section>
</div>
</template>

<script>
// components
import FetchPending from '~/components/FetchPending'
import SubLink from '~/components/SubLink'
import HeadingOne from '~/components/HeadingOne'
import TableSkeleton from '~/components/skeleton/TableSkeleton'

// mixins
import pluralName from '~/mixins/pluralName'
import editLabels from '~/mixins/editLabels'

export default {
  name: 'ListModel',
  mixins: [
    pluralName,
    editLabels
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
    }
  },
  data () {
    return {
      fetchData: [],
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: 'both',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      currentPage: 1,
      perPage: 20
    }
  },
  mounted () {
    const { message = '' } = this.$route.query
    if (message) {
      this.$buefy.toast.open(message)
    }
  },
  async fetch () {
    if (!this.data){
      this.fetchData = await this.$axios.$get(`/${this.pluralLower}`, { params: { _sort: 'name:ASC' }})
    }
  },
  fetchOnServer: false,
}
</script>
