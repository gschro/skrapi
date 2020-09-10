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
  }
}