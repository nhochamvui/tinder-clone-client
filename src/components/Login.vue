<template>
    <router-view
        v-if="routeName !== 'Authenticate'"
        name="replace"
        v-bind:signup-data="signupData"
        v-on:submit="(e) => onSignupFormSubmit(e)"
    />
    <div v-else class="D(flex) Fd(column) W(100%) H(100%) login__section">
        <!-- <h1>Login Page</h1>
        <form v-on:submit="onSubmit">
            <ul>
                <li>
                    <label for="">User Name: </label>
                    <input type="text" v-model="loginInfo.user_name" />
                </li>
                <li>
                    <label for="">Password: </label>
                    <input type="text" v-model="loginInfo.password" />
                </li>
                <li>
                    <input type="submit" title="Login" />
                </li>
            </ul>
        </form> -->
        <div class="test">
            <Image v-bind:altString="'tinder logo'" v-bind:imgSrc="'/tinder.ico'" v-bind:width="'36px'" v-bind:height="'36px'"/>
            <h1 class="heading">GET STARTED</h1>
            <p class="Ta(center) mb(12px)">By clicking Log In, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookie Policy.</p>
            <button
                class="button D(flex) Fd(row) Al(center) Cur(p)"
            >
                <span class="button__icon">
                    <img src="/icon/google-logo.svg" alt="google logo">
                </span>
                <span class="button__label">LOGIN WITH GOOGLE</span>
            </button>
            <button
                class="button D(flex) Fd(row) Al(center) Cur(p)"
                @click="loginFB"
            >
                <span class="button__icon">
                    <img src="/icon/facebook-logo.svg" alt="facebook logo">
                </span>
                <span class="button__label">LOGIN WITH FACEBOOK</span>
            </button>
            <hr class="W(100%)">
            <h1 class="heading">COMING SOON IN 2023!</h1>
            <div class="D(flex) W(100%) Fd(row) Jc(space-between) Al(center)">
                <Image v-bind:altString="'app store logo'" v-bind:imgSrc="'/img/appstore-logo.png'" style="height:48px;object-fit:contain"/>
                <Image v-bind:altString="'app store logo'" v-bind:imgSrc="'/img/googleplay-logo.png'" style="height:70px;object-fit:contain"/>
            </div>
        </div>
        
    </div>
</template>
<script >
import { ref } from "vue";
import axios from "axios";
import Image from "./Image.vue"
import { mapActions, mapGetters } from "vuex";
export default {
    name: "Login",
    components: {
        Image
    },
    setup() {
        const loginInfo = ref({
            user_name: "unclebob",
            password: "1234",
        });
        return {
            loginInfo,
            fbAccessToken: FB.getAuthResponse(),
            signupData: null,
        };
    },
    data(){
        return{
            test: 'hello',
        }
    },
    computed: {
        routeName: function () {
            return this.$route.name;
        },
    },
    methods: {
        //------vi du: ...mapActions({usersFunction: 'users/addNewUser', parrent: 'test'}),
        ...mapActions({
            addNewUser: "users/addNewUser",
            unLoadUser: "users/unLoadUser",
            setProfileImages: "users/setProfileImages",
            setToken: "users/setToken",
            doFbAuth: "doFbAuth",
            doSignup: "doSignup",
            doGet: "doGet"
        }),
        ...mapGetters("users", ["isAuthenticated", "getMe"]),
        async loginFB() {
            const authResponse = FB.getAuthResponse();
            if (!authResponse) {
                FB.login(this.loginCallback, {
                    scope: "email,user_birthday,user_gender,user_location,user_photos",
                    return_scopes: true,
                });
            } else {
                FB.api("/me/permissions", "delete", null, () => FB.logout());
            }
        },
        afterLoginCallback: function (me, authResponse) {
            console.log("afterlogincallback:", me);
            if (
                me &&
                me.email &&
                me.gender &&
                me.birthday.length == 10 &&
                me.picture
            ) {
                me['accessToken'] = authResponse.accessToken;
                this.handleSignup(me);
            } else {
                this.signupData = me;
                this.fbAccessToken = authResponse.accessToken;
                this.$router.push({ name: "SignupProfile" });
            }
        },
        loginCallback: async function (response) {
            let authResponse = response.authResponse;
            if (authResponse) {
                const res = await this.doFbAuth({
                    accessToken: authResponse.accessToken,
                });
                if (res !== null) {
                    console.log('o day ne',res)
                    if (res.accessToken) {
                        this.setToken(res.accessToken);
                        this.$router.push({ name: "MakeFriends" });
                    } else {
                        FB.api(
                            "/me",
                            "get",
                            {
                                access_token: authResponse.accessToken,
                                fields: "email,name,gender,birthday,picture",
                            },
                            (me) => this.afterLoginCallback(me, authResponse)
                        );
                    }
                }
            }
            console.log("login call back:", response);
        },
        onSignupFormSubmit(data){
            data['accessToken'] = this.fbAccessToken;
            this.handleSignup(data);
        },
        async handleSignup(data){
            const res = await this.doSignup(data);
            if(res != null && res.accessToken){
                this.setToken(res.accessToken.result);
                this.$router.push({ name: "MakeFriends" });
            }
        },
        async onSubmit(event) {
            event.preventDefault();
            const objectParam = {
                userName: this.loginInfo.user_name,
                password: this.loginInfo.password,
            };
            try {
                let response = await axios.post(
                    process.env.VUE_APP_HOST_URL +"/api/users/login",
                    objectParam
                );
                this.loginInfo.user_name = "unclebob";
                this.loginInfo.password = "1234";

                // localStorage.setItem("TinderClone/token", response.data);
                this.setToken(response.data);

                console.log("after login, going to App... ", response.data);
                this.$router.push({ name: "MakeFriends" });
            } catch (err) {
                console.log("error while login: ", err);
            }
        },
        async init() {
            console.log("init login.vue");
            console.log(this.test)
            if (this.$route.params.action == "login") {
                const isAuthenticated =
                    this.$store.getters["users/isAuthenticated"];
                if (isAuthenticated) {
                    this.$router.push({ name: "MakeFriends" });
                }
            } else if (this.$route.params.action == "logout") {
                this.unLoadUser();
                this.$router.push({ name: "Home" });
            }
        },
    },
    created: function () {
        FB.getLoginStatus((response) => {
            if (response.status === "connected") {
                console.log('fb cookie: ',response);
                // localStorage.setItem("TinderClone/token", response.authResponse.accessToken);
                // this.setToken(response.authResponse.accessToken);
                // this.$router.push({ name: "MakeFriends" });
            } else if (response.status === "not_authorized") {
                console.log(response.status);
            } else {
                console.log(response.status);
                // The user isn't logged in to Facebook. You can launch a
                // login dialog with a user gesture, but the user may have
                // to log in to Facebook before authorizing your application.
            }
        });
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style>
.login__section{
    margin-top: 20px;
    width: 60%;
    max-width: 500px;
    height: 100%;
    align-self: center;
    justify-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.login__section > hr{
    margin-top: 30px;
}
</style>
<style scoped>
.test{
    margin-top: 20px;
    width: 60%;
    max-width: 500px;
    height: 100%;
    align-self: center;
    justify-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.heading{
    margin-top: 30px;
    text-align: center;
    font-style: italic;
}

.button{
    width: 315px;
    min-height: 54px;
    border-radius: 100px;
    background-color: white;
    margin-top: 10px;
    margin-bottom: 10px;
    border: gray 1px solid;
    color: gray;
}

.button:hover{
    border: black 1px solid;
    color: black;
}

.button__icon{
    width: 15%;
}

.button__label{
    width: 75%;
    font-size: 0.85rem;
}

@media screen and (max-width: 500px) {
    .button{
        width: 75% !important;
    }
}

input[type="submit"] {
    float: right;
}
form {
    margin: 0 auto;
}
li {
    list-style: none;
}
label {
    max-width: 50px;
    text-align: right;
}
</style>