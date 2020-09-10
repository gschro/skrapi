<template>
 <div class="fullwidth">
  <hero-section></hero-section>
 </div>
</template>

<style scoped>
  .fullwidth {
    width: 100%;
  }
</style>

<script>
import HeroSection from '~/components/sections/HeroSection'

export default {
  name: 'HomePage',

  components: {
    HeroSection
  }
}
</script>
