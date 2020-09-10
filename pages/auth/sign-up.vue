<template>
  <section class="section is-fullwidth width100">
    <div class="task-container columns is-multiline">
      <div class="card column is-one-third is-offset-one-third">
        <div class="flex-card">
          <div class="field">
            <label>Username</label>
            <div class="control">
                <input type="text" class="input is-medium">
            </div>
          </div>
          <div class="field">
            <label>Email</label>
            <div class="control">
                <input type="text" class="input is-medium">
            </div>
          </div>
          <div class="field">
            <label>Password</label>
            <div class="control">
                <input type="password" class="input is-medium">
            </div>
          </div>
          <div class="field">
            <label>I agree to the <a href="">terms and conditions</a></label>
            <div class="control">
                <input type="checkbox" class="is-medium">
            </div>
          </div>

          <a class="button is-fullwidth secondary-btn raised">Sign up</a>
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