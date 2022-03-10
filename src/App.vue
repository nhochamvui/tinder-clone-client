<template>
    <div class="main">
        <SideBar
            v-if="isUserAuthenticated && me !== undefined"
            v-bind:myInfo="me"
            class="side-bar"
        />
        <section
            class="W(100%)"
            :class="{ right: isUserAuthenticated }"
        >
            <router-view
                v-if="
                    !isLoading ||
                    routeName === 'Authenticate' ||
                    routeName === 'SignupProfile'
                "
            />
            <h1 v-else>Loading...</h1>
        </section>
    </div>
</template>

<script>
import { useStore, mapGetters, mapActions } from "vuex";
import SideBar from "./components/SideBar.vue";
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
    computed: {
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
                    await this.setUserProfileImages();
                    this.fetchSettings();
                    this.createConnection();
                    this.connect();
                }
            },
            immediate: true,
        },
        isLoading: function (newValue) {
            console.log("isLoading: ", newValue);
        },
        isUserAuthenticated: {
            handler: function (isAuthenticated) {
                console.log(
                    "at App isUserAuthenticated changes: ",
                    isAuthenticated
                );
                if (isAuthenticated) {
                    // this.setUserProfileImages(); call inside loadUser
                    // this.fetchSettings();
                    // this.createConnection();
                    // this.connect();
                } else {
                    this.$router.push({
                        name: "Authenticate",
                        params: { action: "login" },
                    });
                }
            },
            immediate: true,
        },
        token: {
            handler: async function (newValue) {
                if (newValue != "") {
                    console.log("new token: ", newValue);
                    const isLoadedUser = await this.loadUser();
                    console.log('isLoadedUser:', isLoadedUser);
                    if (isLoadedUser && this.isUserAuthenticated) {
                        switch(isLoadedUser){
                            // case 200:
                            //     this.$router.push({ name: "MakeFriends" });
                            //     break;
                            case 404:
                                this.unLoadUser();
                                break;
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
        }),
        ...mapActions({
            loadUser: "users/loadUser",
            setToken: "users/setToken",
            setUserProfileImages: "users/setProfileImages",
            fetchSettings: "fetchSettings",
            connect: "connect",
            createConnection: "createConnection",
            unLoadUser: "users/unLoadUser",
        }),
    },
    created: function () {},
    mounted: async function () {
        console.log("mounted at App.vue...");
        document.addEventListener('storage', (e) =>{
            console.log('storage changed: ', e);
        });
        // const isLoadedUser = await this.loadUser();
        // console.log("isLoadedUser: ", isLoadedUser);
        // if (!isLoadedUser && this.isUserAuthenticated) {
        //     this.$router.push({
        //         name: "SignupProfile",
        //         params: { action: "login" },
        //     });
        // }
    },
    updated: async function () {},
    components: {
        SideBar,
    },
};
</script>

<style scoped>
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
    /* min-width: 310px;
  max-width: 375px; */
    height: 100%;
}
</style>

<style>
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
    font-family: ProximaNova, sans-serif;
    overflow-y: -moz-hidden-unscrollable;
    font-size: 13px;
}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 0;
}
</style>
