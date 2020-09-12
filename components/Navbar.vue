<template>
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }" class="brand-text">
                {{title}}
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                Home
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                  <template v-if="loggedIn">
                    <nuxt-link :to="{ path: editPath }" exact-active-class="is-active" class="button is-primary">
                      <strong>{{editName}}</strong>
                    </nuxt-link>
                    <a  class="button is-secondary" @click="logout">
                      <strong>Sign out</strong>
                    </a>
                  </template>
                  <template v-else>
                    <nuxt-link :to="{ path: '/auth/sign-in' }" exact-active-class="is-active" class="button is-light">
                      <strong>Sign in</strong>
                    </nuxt-link>
                  </template>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<style scoped>
  .brand-text {
    font-weight: bold;
    color: #714DD2;
  }
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    editName: {
      type: String,
      required: true
    },
    editPath: {
      type: String,
      required: true
    }
    // icon: {
    //   type: String,
    //   required: true
    // }
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn
    },
    user() {
      return this.$auth.user
    }
  },
  methods: {
    async logout() {
      // await this.$auth.logout();
      this.$auth.setUser(null)
      this.$auth.setToken('local', null)
    },
  },
}
</script>
