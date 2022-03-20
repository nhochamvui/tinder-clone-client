<template>
    <h1>At Loading...</h1>
</template>

<script>
import { ref } from "vue";
import { mapActions, mapGetters, useStore } from "vuex";
export default {
    name: "Loading",
    setup() {
        const token = ref("");
        const store = useStore();
        return {
            token,
            store,
        };
    },
    computed: {
        me: function () {
            return this.userGetter();
        },
        isUserAuthenticated: function () {
            return this.$store.getters["users/isAuthenticated"];
        },
    },
    watch: {
        me: function () {},
        isUserAuthenticated: function () {
        },
    },
    methods: {
        ...mapGetters({
            userGetter: "users/getMe",
        }),
        ...mapActions({
            loadUser: "users/loadUser",
            setUserProfileImages: "users/setProfileImages",
            fetchSettings: "fetchSettings",
            connect: "connect",
            createConnection: "createConnection",
        }),
    },
    created: function () {
    },
    mounted: function () {
        console.log('mounted at Loading.vue......................')
        this.$router.push('/app/makefriends');
    },
    updated: function(){
        console.log('updated at Loading.vue...')
    },
};
</script>

<style>
</style>