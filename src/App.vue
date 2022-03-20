<template>
    <div class="main">
        <div class="app-bar D(flex) Al(center)" v-if="windowWidth < 750 && isUserAuthenticated && me !== undefined">
            <div class="P(abs)" style="top:15px;left:15px">
                <router-link :to="{ name: 'Settings' }">
                    <img src="/icon/settings.png" style="width:30px;height:30px" alt="">
                </router-link>
            </div>
            <h1 class="W(100%) Ta(center) Color(brandColor) Us(none)">tinder clone</h1>
        </div>
        <div v-bind:class="{'side-bar': windowWidth < 750}">
            <SideBar
                v-if="isUserAuthenticated && me !== undefined"
                v-bind:myInfo="me"
                class="W(100%) H(100%)"
            />
        </div>
        <section
            class="W(100%)"
            :class="{ right: isUserAuthenticated }"
            v-bind:style="{height: windowWidth < 750 ? windowHeight-108 + 'px' : ''}"
        >
            <div class="W(100%) H(100%)" v-if="
                    !isLoading ||
                    routeName === 'Authenticate' ||
                    routeName === 'SignupProfile' ||
                    routeName === 'Privacy'"
            >
                <router-view/>
            </div>
            <h1 v-else>Loading...</h1>
        </section>
    </div>
</template>

<script>
import { useStore, mapGetters, mapActions } from "vuex";
import SideBar from "./components/SideBar.vue";
// import Image from "./components/Image.vue";
// import Profile from './components/Profile.vue'
import "../css/index.css";

export default {
    name: "App",
    inheritAttrs: false,
    setup() {
        const store = useStore();
        return {
            store,
            loadingState: false,
        };
    },
    data(){
        return{
            showSide: false,
        }
    },
    computed: {
        windowWidth: function(){
            return this.getWindowWidth();
        },
        windowHeight: function(){
            return this.getWindowHeight();
        },
        routeName: function () {
            return this.$route.name;
        },
        token: function () {
            return this.getToken();
        },
        me: function () {
            return this.$store.getters["users/getMe"];
        },
        isUserAuthenticated: function () {
            return this.$store.getters["users/isAuthenticated"];
        },
        isLoadedSetting: function () {
            const boolean =
                this.getSettings() != null && this.getSettings() != undefined;
            return (
                this.getSettings() != null && this.getSettings() != undefined
            );
        },
        isLoading: {
            get() {
                return !this.isUserAuthenticated || !this.isLoadedSetting;
            },
        },
    },
    watch: {
        me: {
            handler: async function (newVal) {
                console.log("at App, me changed:", newVal);
                if(newVal){
                    this.fetchSettings();
                    this.createConnection();
                    this.connect();
                }
            },
            immediate: true,
        },
        isLoading: function (newValue) {
        },
        isUserAuthenticated: {
            handler: function (isAuthenticated) {
                console.log(
                    "at App isUserAuthenticated changes: ",
                    isAuthenticated
                );
            },
            immediate: true,
        },
        token: {
            handler: async function (newValue) {
                console.log("new token: ", newValue, this.routeName);
                const getFBToken = new Promise(resolve => {
                    FB.getLoginStatus((res) => {
                        if(res.status === 'connected'){
                            resolve(res.authResponse?.accessToken);
                        }
                        resolve();
                    });
                });
                if (newValue === "") {
                    let fbToken = await getFBToken;
                    if(fbToken){
                        const res = await this.doFbAuth({accessToken: fbToken});
                        if(res !== null && res !== ""){
                            this.setToken(res.accessToken);
                        }
                    }
                    else{
                        this.$router.push({name: "Authenticate", params: { action: "login" }});
                    }
                }
                else {
                    const isLoadedUser = await this.loadUser();
                    if (isLoadedUser && this.isUserAuthenticated) {
                        switch(isLoadedUser){
                            case 404:
                                this.unLoadUser();
                                break;
                            case 200:
                            {
                                const delay = () => {
                                    const expTimeInSec = JSON.parse(Buffer.from((newValue.split('.')[1]), 'base64').toString('utf8').split(',')).exp;
                                    // return a delay time in miliseccond, delay time is early than expire time 1min
                                    return (expTimeInSec*1000 - Date.now()) - 60000;
                                }
                                setTimeout(async (root = this) => {
                                    let fbToken = await new Promise(resolve => {
                                        FB.getLoginStatus((res) => {
                                            if(res.status === 'connected'){
                                                resolve(res.authResponse?.accessToken);
                                            }
                                            resolve();
                                        });
                                    });
                                    if(!fbToken){
                                        root.unLoadUser();
                                    }
                                    else{
                                        const res = await root.doFbAuth({accessToken: fbToken});
                                        if(res !== null && res !== ""){
                                            root.setToken(res.accessToken);
                                        }
                                    }
                                }, delay());
                                break;
                            }
                        }
                    }
                    
                }
            },
            immediate: true,
        },
    },
    methods: {
        //vi du, dung xoa
        // ...mapGetters('users', ["isAuthenticated"]),
        ...mapGetters({
            getSettings: "getSettings",
            getToken: "users/getToken",
            isLoadingUser: "users/isLoadingUser",
            getWindowWidth: "getWindowWidth",
            getWindowHeight: "getWindowHeight",
            getMe: "users/getMe",
        }),
        ...mapActions({
            loadUser: "users/loadUser",
            setToken: "users/setToken",
            setUserProfileImages: "users/setProfileImages",
            fetchSettings: "fetchSettings",
            connect: "connect",
            createConnection: "createConnection",
            unLoadUser: "users/unLoadUser",
            doFbAuth: "doFbAuth",
        }),
        getProfileImage(){
            return this.me.profileImage.find(e => e !== '');
        }
    },
    created: function () {},
    mounted: async function () {
        console.log("mounted at App.vue...");
        document.addEventListener('storage', (e) =>{
            console.log('storage changed: ', e);
        });
    },
    updated: async function () {},
    components: {
        SideBar,
        // Image,
        // Profile
    },
};
</script>

<style scoped>
.app-bar{
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    padding-left: 5px;
}

.main {
    display: flex;
    width: 100%;
    height: 100%;
}
section {
    /* width: 100%; */
    height: 100%;
}
.right {
    width: 75%;
    max-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.side-bar {
    border-right: #e6eaf0 solid 1px;
    width: 25%;
    height: 100%;
}
</style>
<style scoped>
@media screen and (max-width: 749px){
    .main{
        flex-direction: column;
        justify-content: center;
    }
    .right{
        width: 100%;
        height: 85%;
        padding-left: 10px;
        padding-right: 10px;
    }
    .side-bar{
        width: 100%;
        height: 48px;
        position: fixed;
        bottom: 0;
    }
}
</style>
<style>
*{
    box-sizing: border-box;
}
:root {
    --blue40: #47a1ff;
    --blue50: #3d9fff;
    --gray10: #f5f7fa;
    --gray20: #e6eaf0;
    --gray30: #cad1db;
    --gray40: #a6afbd;
    --gray50: #859e95;
    --brandColor: #fd546c;
    --secondaryColor: #656e7b;
    --primaryColor: #3c444f;
    --color--divider-primary: #d4d8de;
    --color--brand-coral: #ff6036;
    --color--brand-hot-pink: #fd267a;
    --color--text-secondary: #505965;
    --color--empty-background: #e9ebee;
    --color--empty-background2: #f0f2f4;
    --filter-color-brand-hot-pink: "invert(43%) sepia(97%) saturate(5877%) hue-rotate(322deg) brightness(101%) contrast(98%)";
}
::-webkit-scrollbar {
    display: none;
}

html,
body {
    height: 100%;
}
body {
    margin: 0;
    font-family: ProximaNova,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica,Arial,Apple Color Emoji,Segoe UI emoji;
    overflow: hidden;
    font-size: 13px;
}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 0;
    overflow: hidden;
}
</style>
