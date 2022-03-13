<template>
<div>
  <div class="matches__header">
    <slot name="header"></slot>
  </div>
  <section class="matches__section">
    <img 
    v-for="match of matchesGetSet"
    v-bind:key="match.id"
    v-on:click="openChat(match)"
    v-on:error="onError"
    class="match-card link Cur(p) Of(cover) Us(none)"
    v-bind:src="match.profileImages[0]" alt="profile_picture"
    >
  </section>
</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Matches",
  emits:[
    'navIndexChange'
  ],
  data(){
    return {
      BASE_PHOTO_URL: this.$store.state.hostURL + this.$store.state.hostPhotosURL,
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    routeValueChange: function () {
      return this.$route.name;
    },
    matchesGetSet: {
      get() {
        return this.getMatches();
      },
      set(newValue) {
        this.matches = newValue;
      },
    },
  },
  watch: {
    routeValueChange: function (newVal) {
      if (newVal == "MakeFriends") {
        this.matchesGetSet = this.getMatches();
      } else if (newVal == "Profile") {
        // let myProfile = await this.getMyProfile();
        // this.peopleGetSet = [ myProfile ];
        console.log("");
      }
      console.log("this.matches: ", this.matches);
    },
  },
  methods: {
    ...mapActions({
      fetchMatches: "fetchMatches",
    }),
    ...mapGetters({
      getMatches: "getMatches",
    }),
    openChat: function(match){
      this.$router.push({ name: "Messages", params: {matchID: match.id} });
      // this.$emit('OpenChat', 2);
    },
    onError(e){
      let defaultImage = '/img/default_profile_picture.jpg';
      if(e.target){
        e.target.src = defaultImage;
      }
    },
  },
  mounted: function () {
    this.$emit('navIndexChange', 1);
  },
};
</script>

<style scoped>

section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 15px;
  padding-left: 15px;
  padding-right: 15px;
}
.match-card {
  width: 100%;
  height: 125px;
  background-position: center;
  background-size: cover;
  border-radius: 5px;
}

@media screen and (max-width: 749px){
  .match-card {
    width: 90px;
    margin-right: 15px;
  }
  .matches__section {
    width: calc(100vw - 15px);
    overflow-x: scroll;
    box-sizing: border-box;
    white-space: nowrap;
    display: inline-block;
  }
}
.link:hover{
  filter: none;
  color: none;
}
.matches__header{
  margin-bottom: 10px;
  margin-left: 10px;
  font-weight: 600;
}
</style>