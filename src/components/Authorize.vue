<template>
  <div></div>
</template>

<script>
export default {
    name: "Authorize",
    methods: {
      init () {
        const isAuthenticated = this.$store.getters['users/isAuthenticated'];
        if (isAuthenticated){
          this.$router.push({ name: "MakeFriends" });
        }
      }
    },
    mounted: function() {
        this.init();
    },
}
</script>

<style>

</style>