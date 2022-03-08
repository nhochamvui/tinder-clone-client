<template>
  <div class="makefriend-body" ref="body">
    <div v-if="people.length > 0">
      <PeopleHolder
        v-for="person of people"
        v-bind:key="person.id"
        :personData="person"
        :isPersonalData="false"
        v-on:onLikeClick="onLikeClick"
        v-on:onDislikeClick="onDislikeClick"
      >
      </PeopleHolder>
    </div>
    <div class="P(relative) W(100%) H(100%)" v-else>
      <div class="D(flex) P(abs) Top(50%) Left(50%)" style="transform: translate(-50%, -50%);">
        <svg class="radar-circle">
          <circle cx="50%" cy="50%" r="0" fill-opacity="0" fill="#fa6f6880" stroke="#fa6f6880" stroke-width="2px" stroke-opacity="1">
            <animate attributeName="r" from="50" to="200" dur="4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" from="1" to="0" dur="4s" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="0" dur="4s" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="50%" cy="50%" r="0" fill-opacity="0" fill="#fa6f6880" stroke="#fa6f6880" stroke-width="2px" stroke-opacity="1">
            <animate attributeName="r" from="50" to="200" dur="4s" begin="2s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" from="1" to="0" dur="4s" begin="2s" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="0" dur="4s" begin="2s" repeatCount="indefinite"></animate>
          </circle>
        </svg>
        <Image
          v-bind:imgSrc="profileImagesGetSet"
          v-bind:alt="'avatar'"
          class="avatar Of(cover) Us(none)"
        />
      </div>
      <p class="P(abs) Ta(center) Margin(0) Left(50%)" style="top:80%;transform: translate(-50%, -50%)">
        Oops! We've run out of potential matches in your area. 
        Try to change your settings to meet more people!
      </p>
    </div>
  </div>
</template>

<script>
import PeopleHolder from "./PeopleHolder.vue";
import { mapActions, mapGetters } from "vuex";
import Image from "./Image.vue";
export default {
  name: "MakeFriends",
  components: {
    PeopleHolder: PeopleHolder,
    Image
  },
  data() {
    return {
      people: [],
      isPersonalData: false,
    };
  },
  computed: {
    routeValueChange: function () {
      return this.$route.name; 
    },
    discoverySettings: {
      get(){
        return this.getDiscoverySettings();
      },
    },
    me: {
      get(){
        return this.userGetter();
      }
    },
    peopleGetSet: {
      get() {
        return this.rootSuggestedPeopleGetter();
      },
      set(newValue) {
        this.people = newValue;
      },
    },
    profileImagesGetSet: {
      get() {
        return this.me.profileImages.find(e => e !== '');
      },
    },
  },
  watch: {
    routeValueChange: async function (newVal) {
      console.log("route value change: ", newVal);
      if (newVal == "MakeFriends") {
        this.isPersonalData = false;
        console.log('routeValueChange, fetch people');
        this.fetchPeople();
      } 
      // else {
      //   this.isPersonalData = true;
      //   let myProfile = await this.getMyProfile();
      //   this.peopleGetSet = [myProfile];
      // }
      console.log("route: ", newVal, " | this.people: ", this.people);
    },
    peopleGetSet: function (newValue) {
      this.peopleGetSet = newValue;
    },
    profileImagesGetSet: function () {
    },
    discoverySettings: function(){
      let settings = this.getDiscoverySettings();
      if(settings !== null && this.routeValueChange == 'MakeFriends'){
        console.log('setting changed, fetch people');
        this.fetchPeople();
      }
    }
  },
  directives: {},
  methods: {
    ...mapGetters({
      userGetter: "users/getMe",
      rootSuggestedPeopleGetter: "getSuggestedPeople",
      getDiscoverySettings: "getSettings"
    }),
    ...mapActions({
      userSetProfileImages: "users/setProfileImages",
      getNewSuggestedPeople: "getNewSuggestedPeople",
      doLikePerson: "users/likePerson",
      setDocument: "setDocument",
    }),
    async getMyProfile() {
      return this.userGetter();
    },
    fetchPeople() {
      this.getNewSuggestedPeople();
    },
    onLikeClick() {
      this.people.pop();
    },
    onDislikeClick() {
      this.people.pop();
    },
  },
  mounted: async function () {
    let routeName = this.$route.name;
    console.log("mounted at makefriends.vue, route:", routeName);
    this.setDocument(this.$refs['body']);
    if (routeName == "MakeFriends" && this.discoverySettings !== null) {
      this.fetchPeople();
      this.isPersonalData = false;
    } 
    // else{
    //   this.isPersonalData = true;
    //   let myProfile = await this.getMyProfile();
    //   this.peopleGetSet = [myProfile];
    // }
  },
};
</script>

<style scoped>
.radar-circle{
  width: 400px;
  height: 400px;
  position: absolute;
  align-self: center;
  transform: translateX(-37%);
}
.avatar{
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: white 3px solid;
  position: relative;
}
.makefriend-body {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.side-bar {
  border-right: #e6eaf0 solid 1px;
  width: 25%;
  min-width: 310px;
  max-width: 375px;
  height: 100%;
}
</style>