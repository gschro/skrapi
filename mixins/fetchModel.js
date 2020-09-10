export default {
  methods: {
    fetchModel(model, slugOverride, params) {
        const path = this.getPath()
        const slug = slugOverride ?? this.getSlug(path)
        return this.getModel(model, { slug, ...params })
    },
    async fetchAndPopModel(model) {
      const path = this.getPath()
      const slug = this.getSlug(path)
      const modelValue = await this.getModel(model, { slug })
      this.initialModel = modelValue

      return this.populateModel(modelValue)
    },
    populateModel(model) {
      return this.fields.reduce((acc, cv) => {
        const value = model[cv.model]
        acc[cv.model] = value && typeof value === "object" ? value.id : value
        return acc
      }, {
        id: model.id
      })
    },
    async getModel(model, params, all = false) {
      const values = await this.$axios.$get(`/${model}`, { params })
      const [value] = values
      return all ? values : value
    },
    async getModelById(model, id) {
      const [value] = await this.$axios.$get(`/${model}/${id}`)
      return value
    },
    async deleteModelById(model, id) {
      const result = await this.$axios.$delete(`/${model}/${id}`)
      return result
    },
    getPath() {
      const { pathname } = window.location
      return this.$route.path || pathname
    },
    getSlug(path) {
      return path.split('/').pop()
    }
  }
}