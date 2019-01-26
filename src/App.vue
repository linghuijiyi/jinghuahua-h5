<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style scoped lang='stylus'>
    #app 
        width 100%
        height 100%
        overflow hidden
    .router-fade-enter-active,
    .router-fade-leave-active 
        transition: opacity .3s
    .router-fade-enter,
    .router-fade-leave-active
        opacity: 0
</style>
