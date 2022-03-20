<template>
  <ul>
      <li>
        <router-link v-if="!isUserAuthenticated" :to="{ name: 'Authenticate', params: { action: 'login' }}">Login</router-link>
        <router-link v-else :to="{ name: 'Authenticate', params: { action: 'logout' }}">Logout</router-link>
      </li>
  </ul>
</template>

<script>
export default {
  name: "NavBar",
    computed: {
      isUserAuthenticated: function(){
        console.log('navbar.vue')
        return this.$store.getters['users/isAuthenticated'];
      }
    },
    watch: {
      isUserAuthenticated: function(newVal, oldVal){
      }
    },
}
</script>

<style scoped>
ul{
  margin: 0;
  background-color: lightcoral;
  display: flex;
  flex-direction: row;
}
li{
  list-style: none;
  width: 50%;
};
</style>