export default {
  methods: {
    by(field) {
      return (a, b) => (a[field] > b[field]) ? 1 : -1
    }
  }
}