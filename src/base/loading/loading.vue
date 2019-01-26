<template>
    <div class='loading'>
        <img src='./loading.gif' width='30' height='30' />
        <p>{{ loadingText }}</p>
    </div>
</template>

<script>
    export default {
        props: {
            loadingText: {
                type: String,
                default: '加载中...'
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .loading
        background rgba(0, 0, 0, .3)
        position fixed
        top 0
        left 0
        right 0
        bottom 0
        display flex !important
        flex-wrap wrap
        justify-content center
        align-items center
        z-index 99
        p
            font-size .24rem
            margin-left .1rem
            color #fff
            font-weight 700
</style>