<template>
  <section>
    <b-skeleton width="30%" height="3em" :animated="animated"></b-skeleton>
    <b-skeleton width="10%" :animated="animated"></b-skeleton>
    <div class="mt-3 columns is-mobile is-multiline">
      <div v-for="(n, index) in 12" :key="index" class="column is-half-desktop small-gap">
          <box-skeleton></box-skeleton>
      </div>
    </div>
  </section>
</template>

<script>
import BoxSkeleton from '~/components/skeleton/BoxSkeleton'
export default {
    components: {
      BoxSkeleton
    }
}
</script>