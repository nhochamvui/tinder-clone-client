<template>
  <h1>Home Page</h1>
  <NavBar/>
</template>

<script>
import NavBar from './NavBar.vue';
export default {
    name: "Home",
    components:{
      NavBar
    },
    methods: {
      init () {
        const isAuthenticated = this.$store.getters['users/isAuthenticated'];
        console.log('home.vue: ');
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