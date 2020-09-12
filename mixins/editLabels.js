export default {
  computed: {
    methodLabel () {
      return this.method === 'put' ? 'Update' : 'Add'
    },
    nameLabel() {
      return `${this.methodLabel} ${this.name}`
    },
    backLabel () {
      return `All ${this.plural}`
    },
    editPath () {
      return process.env.EDIT_PATH || '/edit'
    },
    editName () {
      return process.env.EDIT_NAME || 'Edit'
    },
    routeParam() {
      return process.env.ROUTE_PARAM || 'id'
    }
  }
}