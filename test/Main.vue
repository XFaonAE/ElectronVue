<template>
    <div>
        This text will update
        <Frame message="Hey" />
    </div>
</template>

<script>
    import Frame from "./components/Frame.vue";

    export default {
        components: {
            Frame
        }
    }
</script>

<style scoped>
    * {
        font-family: sans-serif;
    }
</style>