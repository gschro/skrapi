<template>
 <div class="fullwidth">
  <hero-section :editPath="editPath"></hero-section>
 </div>
</template>

<style scoped>
  .fullwidth {
    width: 100%;
  }
</style>

<script>
import HeroSection from '~/components/sections/HeroSection'
import editLabels from '~/mixins/editLabels'

export default {
  name: 'HomePage',
  mixins: [editLabels],
  components: {
    HeroSection
  }
}
</script>
