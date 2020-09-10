<template>
  <section>
    <b-skeleton v-if="showHeader" width="30%" height="3em" :animated="animated"></b-skeleton>
    <b-skeleton v-if="showHeader" width="10%" :animated="animated"></b-skeleton>
    <div class="columns mt-3 mb-3" v-for="(n, index) in 3" :key="index">
      <ul class="column" v-for="(n, index) in 3" :key="index">
        <li>
          <b-skeleton width="30%" :animated="animated"></b-skeleton>
        </li>
        <li>
          <b-skeleton width="90%" height="3em" :animated="animated"></b-skeleton>
        </li>
      </ul>
    </div>
    <b-skeleton width="12%" height="3em" :animated="animated"></b-skeleton>
  </section>
</template>

<script>
export default {
    props: {
      showHeader: {
        type: Boolean,
        default: false
      }
    },
    data() {
        return {
            animated: true
        }
    }
}
</script>