<template>
  <section class="section is-fullwidth width100">
    <div class="task-container columns is-multiline">
      <div class="card column is-one-third is-offset-one-third">
        <div class="flex-card">
          <form @submit.prevent="userLogin">
            <div class="field">
              <label>Username or Email</label>
              <div class="control">
                  <input type="text" v-model="login.identifier" class="input is-medium" placeholder="Enter username">
              </div>
            </div>
            <div class="field">
              <label>Password</label>
              <div class="control">
                  <input type="password" v-model="login.password" class="input is-medium" placeholder="Enter password">
              </div>
            </div>

            <button class="button is-fullwidth secondary-btn raised">Log in</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .width100 {
    width: 100%;
  }
</style>

<script>
export default {
  data() {
    return {
      login: {
        identifier: '',
        password: ''
      }
    }
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
    async userLogin() {
      try {
        // console.log('logging in', this.login.username)
        let response = await this.$auth.loginWith('local', { data: this.login })
        // console.log('login response', response)
        // // this.$router.push('/')
        // const token = this.$auth.getToken('local')
        // console.log('token', token)
        // this.$strapi.setToken(token)
      } catch (err) {
        console.error('login err', err)
      }
    }
  }
}
</script>