<template>
    <router-view
        v-if="routeName !== 'Authenticate'"
        name="replace"
        v-bind:signup-data="signupData"
        v-on:submit="(e) => onSignupFormSubmit(e)"
    />
    <div v-else>
        <h1>Login Page</h1>
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
        </form>
        <button
            @click="loginFB"
            v-text="fbAccessToken ? 'Log out' : 'Login with Facebook'"
        ></button>
    </div>
</template>
<script >
import { ref } from "vue";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
export default {
    name: "Login",
    components: {},
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

<style scoped>
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