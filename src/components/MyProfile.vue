<template>
    <div class="profile-body" ref="body">
        <PeopleHolder
            v-bind:person-data="me"
            v-bind:is-personal-data="isPersonalData"
        >
        </PeopleHolder>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PeopleHolder from './PeopleHolder.vue';
export default {
    name: "MyProfile",
    data(){
        return{
            user: {},
            isPersonalData: true,
        }
    }, 
    methods: {
        ...mapGetters({
            getMe: "users/getMe",
        }),
    },
    computed: {
        me: function(){
            return this.getMe();
        }
    },
    components: {
        PeopleHolder,
    },
    created: function(){
        console.log('my profile created')
        this.user = this.getMe();
    },
};
</script>

<style scoped>
.profile-body{
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

</style>