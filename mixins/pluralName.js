import pluralize from 'pluralize'

export default {
  computed: {
    plural () {
      return pluralize(this.name)
    },
    pluralLower () {
      return this.plural.toLowerCase()
    },
  },
  methods: {
    makePlural (value) {
      return pluralize(value)
    },
    makeSingular (value) {
      return pluralize.singular(value)
    }
  }
}