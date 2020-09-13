export default {
  methods: {
    fetchModel(model, slugOverride, params) {
        const path = this.getPath()
        const slug = slugOverride ?? this.getSlug(path)
        return this.getModel(model, { slug, ...params })
    },
    async fetchAndPopModel(model, id, fields) {
      // const path = this.getPath()
      // const slug = this.getSlug(path)
      const modelValue = await this.getModelById(model, id)
      this.initialModel = modelValue
      return this.populateModel(modelValue, fields)
    },
    populateModel(model, fields = []) {
      return fields.reduce((acc, cv) => {
        const value = model[cv.field]
        acc[cv.field] = value && typeof value === "object" ? value.id : value
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
    async getObject(path, params) {
      const values = await this.$axios.$get(path, { params })
      return values
    },
    async getModelById(model, id) {
      const value = await this.$axios.$get(`/${model}/${id}`)
      console.log('values', value)
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