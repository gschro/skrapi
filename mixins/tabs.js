export default {
  computed: {
    initialTab() {
      const tab = this.$route.query.tab
      return tab ? this.tabs.map(a => a.toLowerCase()).indexOf(tab) : 0
    }
  }
}