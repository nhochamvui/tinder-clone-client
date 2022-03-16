<template>
  <div class="makefriend-body" ref="body">
    <Modal
      v-on:close="onModalClose"
      v-if="showModal"
    >
      <template v-slot:body>
        <img class="mini__avatar" v-bind:src="me.profileImages.find(e => e !== '')"  alt="my-avatar">
        <img class="mini__avatar object-avatar" v-bind:src="currentMatchProfileImage"  alt="others-avatar">
        <span class="congrats-text" v-text="currentMatchName !== ''? currentMatchName + ' likes you too!' : 'Someone likes you too!'"></span>
        <h1 class="its-a-match">IT'S A MATCH!!</h1>
      </template>
      <template v-slot:footer>
        <button type="button" class="button__message" @click="openChat">
          Messaging
        </button>
      </template>
    </Modal>
    <div class="W(100%) H(100%) D(flex) Jc(center) Al(center) P(relative)" v-if="people.length > 0">
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
    <div class="P(relative) W(100%) H(100%)" v-else-if="!showModal">
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
import Modal from "./Modal.vue";
import Image from "./Image.vue";
export default {
  name: "MakeFriends",
  components: {
    PeopleHolder: PeopleHolder,
    Image,
    Modal,
  },
  data() {
    return {
      people: [],
      isPersonalData: false,
      showModal: false,
      currentMatchName: '',
      currentMatchProfileImage: '',
      currentMatchID: '',
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
    onModalClose(){
      this.showModal = false;
    },
    async getMyProfile() {
      return this.userGetter();
    },
    fetchPeople() {
      this.getNewSuggestedPeople();
    },
    onLikeClick(match) {
      if(match){
        this.currentMatchName = match.name;
        this.currentMatchProfileImage = match.profileImages.find(e => e !== '');
        this.currentMatchID = match.id;
        this.showModal = true;
      }
      
      this.people.pop();
    },
    onDislikeClick() {
      this.people.pop();
    },
    openChat(){
      this.$router.push({ name: "Messages", params: {matchID: this.currentMatchID} });
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
.button__message{
    width: 100px;
    min-height: 40px;
    border-radius: 100px;
    font-size: 0.9rem;
    cursor: pointer;
    background: linear-gradient(262deg, #ff7854, #fd267d);
    color: white;
    border: none;
}
.button__message:hover{
    background: white;
    color: black;
    border: black 1px solid;
}
.heading{
    text-align: center;
    font-style: italic;
}
.its-a-match{
    position: absolute;
    font-style: italic;
    bottom: 5%;
    font-size: 2.3rem;
    animation-name: itsamatch;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    text-shadow: 1px -1px #FF0000;
}
.object-avatar{
    opacity: 0;
    animation: ojectavataranim 1s ease-out 1s forwards;
}

@keyframes itsamatch {
    from {
        font-size: 20rem;
        text-shadow: 20px -20px #FF0000;
    }
    to {font-size: 5rem;
        text-shadow: 20px -20px #FF0000;
    }
}
@keyframes ojectavataranim {
    from {
        transform: scale(0.1);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
.mini__avatar{
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: white 2px solid;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 28%);
}

.congrats-text{
    opacity: 0;
    position: absolute;
    bottom: 50%;
    animation: ojectavataranim 1s ease-out 1s forwards;
}
/********
********/

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