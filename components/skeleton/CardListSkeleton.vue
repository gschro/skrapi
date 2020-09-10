<template>
  <section>
    <b-skeleton width="30%" height="3em" :animated="animated"></b-skeleton>
    <b-skeleton width="10%" :animated="animated"></b-skeleton>
    <div class="mt-3 columns is-mobile is-multiline">
      <div v-for="(n, index) in 12" :key="index" class="column is-half-desktop small-gap">
          <card-skeleton></card-skeleton>
      </div>
    </div>
  </section>
</template>

<script>
import CardSkeleton from '~/components/skeleton/CardSkeleton'
export default {
    components: {
      CardSkeleton
    }
}
</script>