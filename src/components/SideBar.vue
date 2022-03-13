<template>
    <aside v-if="windowWidth >= 750">
        <div class="sidebar-header">
            <router-link class="my-profile" :to="{ name: 'Profile' }">
                <router-link class="back-arrow" :to="{name:'MakeFriends', replace:true}" v-if="routeName !== 'MakeFriends' && routeName !== 'Messages'">
                    <img v-bind:src="iconPreviousArrow" alt="back" />
                </router-link>
                <div class="avatar">
                    <div class="circle">
                        <Image
                            v-bind:src="backgroundImage"
                            v-bind:altString="'background-avatar'"
                            class="background-avatar Of(cover)"
                        ></Image>
                    </div>
                    <h2>My Profile</h2>
                </div>
            </router-link>
        </div>
        <div class="sidebar-content">
            <nav
                class="mini-nav"
                v-if="routeName === 'MakeFriends' || routeName === 'Messages' || routeName === 'MessageList'"
            >
                <span
                    :class="{ 'nav-item-hightlight': navActiveIndex == 1 }"
                    class="nav-item"
                    v-on:click="onNavClick(1)"
                >
                    <a>Matches</a>
                </span>
                <span
                    :class="{ 'nav-item-hightlight': navActiveIndex == 2 }"
                    class="nav-item"
                    v-on:click="onNavClick(2)"
                    style="margin-left: 16px"
                >
                    <a>Messages</a>
                </span>
            </nav>
            <router-view
                v-slot="{ Component }"
                name="side"
                v-if="loadedRequirements()"
            >
                <component
                    :is="Component"
                    v-on:nav-index-change="onNavIndexChange"
                    v-on:on-set-gender-pref-click="onSetGenderPrefClick"
                />
            </router-view>
            <!-- <Matches v-on:openChat="onOpenChat" style="margin-top: 10px" v-if="navActiveIndex == 1 && (routeName == 'MakeFriends' || routeName === 'Messages')"/> -->
            <!-- <MessageList v-if="navActiveIndex == 2"/> -->
        </div>
    </aside>
    <nav v-else>
        <ul class="side-bar__ul">
            <li>
                <router-link class="button" :to="{ name: 'MakeFriends' }">
                    <img class="button--img" src="/icon/tinder-icon.svg" style="width: 30px; height: 30px;" alt="">
                </router-link>
            </li>
            <li>
                <router-link class="button" :to="'/app/messages/'">
                    <img class="button--img" src="/icon/message.svg" style="width: 30px; height: 30px;" alt="">
                </router-link>
            </li>
            <li>
                <router-link class="button" :to="{ name: 'Profile' }">
                    <img class="button--img" src="/icon/profile.svg" style="width: 30px; height: 30px;" alt="">
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
// import Matches from './Matches.vue';
// import MessageList from './MessageList.vue';
import Profile from './Profile.vue';
import SetGender from "./SetGender.vue";
import Image from "./Image.vue";
import { mapActions, mapGetters, useStore } from "vuex";
import { onMounted } from '@vue/runtime-core';
export default {
    name: "SideBar",
    components: {
        // Matches,
        // MessageList,
        SetGender,
        Image,
        Profile,
    },
    props: {
        myInfo: Object,
    },
    setup(){
        onMounted(async () =>{
            const store = useStore();
            await store.dispatch('fetchMatches');
        });
    },
    data() {
        const iconPreviousArrow = this.$store.state.baseUrl + "previous.svg";
        return {
            iconPreviousArrow,
            navActiveIndex: 1,
            isSetAgePref: false,
            bgImage: '',
            windowWidth: this.getWindowWidth(),
            sideComponent: 'Profile',
            show: false,
        };
    },
    methods: {
        ...mapGetters({
            getUser: "users/getMe",
            getHostPhotosURL: "getHostPhotosURL",
            isLoadedRequirements: "isLoadedRequirements",
            getMatches: "getMatches",
            getWindowWidth: "getWindowWidth",
        }),
        ...mapActions({
            fetchMatches: "fetchMatches",
        }),
        onWindowResize(){
            this.windowWidth = window.innerWidth;
        },
        onNavClick: function (value) {
            // need: router go...
            if (this.navActiveIndex == value) {
                return;
            }
            switch (value) {
                case 1: {
                    this.$router.push({ name: "MakeFriends" });
                    break;
                }
                case 2: {
                    this.$router.push({
                        name: "Messages",
                        // params: { matchID: 2 },
                    });
                    break;
                }
            }
            this.navActiveIndex = value;
        },
        onSetGenderPrefClick: function () {
            console.log("received");
            this.$router.push({ name: "SetGender" });
            this.isSetAgePref = true;
        },
        onOpenChat: function (navIndex) {
            this.navActiveIndex = navIndex;
        },
        onNavIndexChange: function (navIndex) {
            this.navActiveIndex = navIndex;
        },
        loadedRequirements: function () {
            if (
                this.routeName === "Messages" ||
                this.routeName === "MakeFriends"
            ) {
                return this.isloadedMatches && this.isLoadedRequirements();
            }
            return this.isLoadedRequirements();
        },
    },
    computed: {
        routeName: function () {
            return this.$route.name;
        },
        me: function(){
            return this.getUser();
        },
        backgroundImage: {
            get(){
                return this.bgImage;
            },
            set(newVal){
                this.bgImage = newVal;
            }
        },
        isloadedMatches: function () {
            return this.getMatches().length > 0;
        },
    },
    watch: {
        routeName: {
            handler: function (name) {
                console.log('routeName: ', name);
                if (name === "Messages" || name === "MakeFriends") {
                    // this.fetchMatches();
                }
            },
            immediate: true,
        },
        backgroundImage: function (newVal) {
        },
        me: {
            handler: function(newVal){
                if(newVal && newVal.profileImages){
                    console.log('me changed: ', newVal.profileImages)
                    this.bgImage = newVal.profileImages.find(e => e !== '') || '/img/default_profile_picture.jpg';
                }
            },
            deep: true,
        }
    },
    mounted: function () {
        console.log("mounted sidebar");
        this.$nextTick(() =>{
            window.addEventListener("resize", this.onWindowResize)
        })
        this.isSetAgePref = false;
    },
    activated: function () {
        console.log("activated sidebar");
        this.isSetAgePref = false;
    },
};
</script>

<style scoped>
.router-link-active > img{
    filter: invert(43%) sepia(97%) saturate(5877%) hue-rotate(322deg) brightness(101%) contrast(98%);
}
.router-link-exact-active, .aria-current > img{
    filter: invert(43%) sepia(97%) saturate(5877%) hue-rotate(322deg) brightness(101%) contrast(98%);
}

.avatar{
    border-radius: 50%;
}

.profile:first-child {
    width: 100%;
    height: 100%;
}
aside {
    display: flex;
    flex-direction: column;
    min-width: 325px;
    max-width: 375px;
}
.circle {
    width: 32px;
    height: 32px;
    border: white 2px solid;
    border-radius: 50%;
    clip-path: circle(50%);
    background-position: center;
    background-size: cover;
}
.background-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
}
.my-profile {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50%;
    align-items: center;
    text-decoration: none;
}
.sidebar-header {
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: linear-gradient(262deg, #ff7854, #fd267d);
}
.avatar {
    width: 50%;
    margin-left: 5%;
    height: 100%;
    display: flex;
    align-items: center;
}
.back-arrow {
    display: flex;
    align-items: center;
    max-width: 18px;
    min-width: 18px;
    margin-left: 2%;
    filter: invert(100%) sepia(2%) saturate(9%) hue-rotate(341deg)
        brightness(103%) contrast(103%);
}
h2 {
    margin-left: 5%;
    width: 75%;
    text-align: left;
    color: white;
    font-weight: normal;
}
.sidebar-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.mini-nav {
    padding: 0 4% 0 4%;
    display: flex;
    height: 10%;
    min-height: 48.3px;
    flex-direction: row;
    align-items: center;
}
.nav-item {
    height: 40%;
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
}
.nav-item:hover {
    cursor: pointer;
}
.nav-item-hightlight {
    border-bottom: #e90436 solid 3px;
    border-radius: 2px;
}
@media only screen and (min-width: 1025px) {
    .sidebar-header {
        min-height: 70px;
    }
}
</style>

<style scoped>
@media screen and (max-width: 749px){
    .side-bar{
        width: 100%;
        height: 48px;
        position: absolute;
        top: 93%;
    }
    .side-bar__ul{
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }
    .button{
        width: 30px;
        height: 30px;
    }

    .button-active{
        filter: invert(43%) sepia(97%) saturate(5877%) hue-rotate(322deg) brightness(101%) contrast(98%);
    }
}
</style>