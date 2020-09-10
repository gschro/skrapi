<template>
    <section>
        <b-skeleton width="20%" :animated="animated" position="is-right"></b-skeleton>
        <b-skeleton :count="4" :animated="animated"></b-skeleton>
        <b-skeleton width="20%" :animated="animated" position="is-right"></b-skeleton>
    </section>
</template>

<script>
export default {
    data() {
        return {
            animated: true
        }
    }
}
</script>