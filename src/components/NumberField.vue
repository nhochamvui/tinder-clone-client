<template>
  <div class="number__field--container">
      <input type="number"
        v-bind:value="value" v-on:input="$emit('update:value', $event.target.value)">
  </div>
</template>

<script>
export default {
    name: "NumberField",
    props: ['value'],
    emits: ['update:value'],
    mounted: function(){
    },
    methods: {
    }
}
</script>

<style scoped>

</style>