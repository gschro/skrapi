<template>
  <section class="hero is-fullheight is-default is-bold main-hero">
    <div class="hero-body reorient ">
        <div class="container">
            <div class="columns is-vcentered">
                <div class="column is-5 is-offset-1 landing-caption ">

                    <span class="has-text-white">
                    A quick setup user facing editing site for strapi
                    </span>
                    <h1 class="title is-1 is-bold is-spaced has-text-white">
                        Skrapi
                    </h1>
                    <p class="subtitle is-muted has-text-white">
                     Built with Nuxt, Buefy, and deployable to Netlify
                     <!-- (Photo by Luis Ruiz from Pexels) -->
                    </p>
                    <p>
                                <nuxt-link :to="{ path: editPath }"
              exact-active-class="is-active" class="button cta rounded primary-btn raised">
                            Go to Content Types
                        </nuxt-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    editPath: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
  .reorient {
    -moz-transform: scale(-1, 1);
    -o-transform: scale(-1, 1);
    -webkit-transform: scale(-1, 1);
    transform: scale(-1, 1);
  }
  .main-hero {
    background: url(https://cdn.pixabay.com/photo/2016/07/10/19/18/iron-1508269_1280.jpg);
    background-size: cover;
    height: 100%;
    overflow: hidden;
    -moz-transform: scale(-1, 1);
    -o-transform: scale(-1, 1);
    -webkit-transform: scale(-1, 1);
    transform: scale(-1, 1);
  }
</style>