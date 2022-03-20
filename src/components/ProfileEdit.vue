<template>
    <router-view
    name = "modals"
    v-bind:Title="title"
    v-bind:Options="options"
    v-bind:SelectedValue="gender"
    v-bind:previous-route-name="$router.path"
    v-on:on-done="onDoneEditGender"
    />
    <div v-if="routeName == 'ProfileEdit'" class="gray-background H(100%) W(100%) Ofy(scroll) Pb(50px)">
        <ul
            class="
                Bs(border-box)
                D(flex)
                H(60%)
                W(100%)
                Pd(0)
                Fd(row)
                Jc(space-between)
                Jc(center)
                Fw(wrap)
                Pl(5%)
                Pr(5%)
                Rg(15px)
            "
        >
            <li
                class="W(30%) file-container"
                v-for="index in maxAvatarSlots"
                v-on:change="
                    (e) => onFileSelected(e.target.files[0], index - 1)
                "
                v-bind:key="index"
            >
                <div
                    class="avatar"
                    v-if="profileImages[index - 1] && profileImages[index - 1] !== ''"
                    v-bind:style="{
                        backgroundImage:
                            'url(' +
                            profileImages[index - 1] +
                            ')',
                    }"
                    alt=""
                ></div>
                <label
                    class="D(flex) Jc(center) Al(center) button Cur(p)"
                    :class="{ active: profileImages[index - 1] && profileImages[index - 1] !== '' }"
                    v-on:click="removeImage(index-1)"
                >
                    <img
                        style="width: 50%; height: 50%; position: relative"
                        :class="{
                            'remove-icon': profileImages[index - 1] && profileImages[index - 1] !== '',
                        }"
                        class="add-icon"
                        v-bind:src="iconAdd"
                    />
                    <input v-if="(index-1) == 0 || profileImages[index - 1] === '' || !profileImages[index - 1]" type="file" />
                </label>
            </li>
        </ul>
        <p class="secondary-text">
            Add more pictures to get closer to completing your profile and you
            may even get more Likes.
        </p>
        <div class="block-content">
            <div class="label">ABOUT YOU</div>
            <div class="content">
                <textarea
                    v-model.trim="bioString"
                    spellcheck="false"
                    class="content-editor"
                    maxlength="500"
                ></textarea>
            </div>
        </div>
        <hr class="B(none)" />
        <div class="block-content">
            <div class="label">LIVING IN</div>
            <div class="content">
                <textarea
                    v-model.trim="livingIn"
                    spellcheck="false"
                    class="content-editor"
                    maxlength="100"
                    style="height: 20px"
                ></textarea>
            </div>
        </div>
        <hr class="B(none)" />
        <div class="block-content">
            <div class="label">GENDER</div>
            <div class="content D(flex) Al(center)">
                <router-link
                    class="
                        content-editor
                        D(flex)
                        Al(center)
                        Td(none)
                        Fd(row)
                        Jc(space-between)
                        text
                    "
                    style="height: 20px"
                    :to="{ name: 'ProfileEditGender' }"
                    v-on:mouseover="mouseOverEvent"
                    v-on:mouseout="mouseOutEvent"
                >{{ gender }}
                    <!-- <span class="text">{{ gender }}</span> -->
                    <img
                        class="link fill-brandBG icon-link"
                        style="width: 12px; height: 12px"
                        src="../../public/icon/next.svg"
                    />
                </router-link>
            </div>
        </div>
        <div class="P(abs) B(0) Pb(10px) D(flex) Jc(center) H(40px) W(100%)"
            style="background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(252,252,252,0.896796218487395) 14%, rgba(255,252,247,0) 100%);"
        >
            <div class="button-save-info" v-on:click="saveInfo()">
                <span>Save Info</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import ModalForm from "./ModalForm.vue";
// import Test from "./Test.vue";
export default {
    name: "ProfileEdit",
    data() {
        const iconAdd = this.$store.state.baseUrl + "icon/add.svg";
        return {
            iconAdd,
            maxAvatarSlots: 6,
            BASE_URL: this.$store.state.baseUrl,
            BASE_PHOTO_URL:
                this.$store.state.hostURL + this.$store.state.hostPhotosURL,
            bioString: this.getMe().about,
            livingIn: this.getMe().hometown,
            title: "gender",
            options: [
                { key: 0, value: "Male" },
                { key: 1, value: "Female" },
                { key: 2, value: "Other" },
            ],
        };
    },
    components: {
        // ModalForm: ModalForm,
        // Test,
    },
    computed: {
        me: {
            get() {
                return this.getMe();
            },
        },
        gender: {
            get(){
                return this.getMe().gender;
            }
        },
        profileImages: {
            get() {
                if(this.getMe().profileImages != undefined){
                    return this.getMe().profileImages;
                }
                return [];
            },
        },
        basePhotoURL: {
            get() {
                return this.BASE_PHOTO_URL;
            },
        },
        routeName: function () {
            return this.$route.name;
        },
    },
    watch: {
        routeName: function(){
        },
    },
    methods: {
        ...mapActions({
            uploadAvatar: "users/uploadPhoto",
            setGender: "users/setGender",
            removeProfileImage: "users/removeProfileImage",
            setProfileImages: "users/setProfileImages",
            updateInfo: "users/updateInfo",
            getMe: "users/getMe",
            loadUser: "users/loadUser",
            uploadIMGBB: "users/uploadIMGBB",
        }),
        ...mapGetters({
            getMe: "users/getMe",
            isLoadedRequirements: "isLoadedRequirements",
        }),
        getMyAvatar(index) {
            if (this.profileImages[index] && this.profileImages[index] !== "") {
                return this.BASE_PHOTO_URL + this.profileImages[index];
            }

            return undefined;
        },
        onFileSelected(fileSelected, index) {
            if(!fileSelected){
                return;
            }

            this.uploadAvatar({
                photo: fileSelected,
                index: index,
            });
        },
        onDoneEditGender(key){
            this.setGender(key);
        },
        removeImage(index){
            if(index == 0){
                return;
            }

            if(!this.profileImages[index] || this.profileImages[index] === ''){
                return;
            }
            this.removeProfileImage(index).then(isSuccess => {
                if(isSuccess){
                    this.setProfileImages();
                }
            });
        },
        saveInfo(){
            let info = {
                about: this.bioString,
                hometown: this.livingIn,
                dateOfBirth: this.getMe().dateOfBirth,
            }
            this.updateInfo(info).then(isSuccess => {
                if(isSuccess){
                    this.loadUser().then(this.$router.push({name: "Profile"}));
                }                
            });
        },
        mouseOverEvent: function(e){
            let me = e.target;
            me.childNodes.forEach(element => {
                if(element.nodeName == 'IMG'){
                    element.style.filter = 'invert(47%) sepia(92%) saturate(2481%) hue-rotate(321deg) brightness(101%) contrast(98%)';
                }
            });
        },
        mouseOutEvent: function(e){
            let me = e.target;
            me.childNodes.forEach(element => {
                if(element.nodeName == 'IMG'){
                    element.style.filter = 'invert(97%) sepia(3%) saturate(392%) hue-rotate(183deg) brightness(93%) contrast(103%)';
                }
            });
        },
    },
};
</script>

<style scoped>
.gray-background {
    background-color: var(--color--empty-background2);
}

.secondary-text {
    padding: 16px 12px 16px 12px;
    margin-top: 10px;
    text-align: center;
    color: var(--color--text-secondary);
    user-select: none;
    font-weight: 100;
    font-size: 0.9rem;
}
.text {
    user-select: none;
    font-weight: 100;
    font-size: 0.9rem;
    color: var(--primaryColor);
}
.text:hover{
    color: var(--color--brand-hot-pink);
}
.file-container {
    height: 50%;
    background-color: var(--color--empty-background);
    border-radius: 10px;
    position: relative;
}
.label {
    margin-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--color--text-secondary);
    user-select: none;
}
.button-save-info{
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    box-shadow: 0 1px 6px 0 rgb(0 0 0 / 27%);
    height: 40px;
    max-width: 100%;
    color: #fff;
    box-sizing: border-box;
    bottom: 10px;
    padding-left: 24px;
    padding-right: 24px;
    border-radius: 30px;
    background: linear-gradient(225deg,var(--color--brand-coral),var(--color--brand-hot-pink));
    cursor: pointer;
    box-shadow: 0 1px 6px 0 rgb(0 0 0 / 27%);
}
.content {
    background-color: white;
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 12px;
    padding-bottom: 12px;
}
.content-editor {
    width: 100%;
    height: 75px;
}

textarea,
textarea:focus-visible {
    border: none;
    outline: none;
    resize: none;
}
.avatar {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-size: cover;
}
.button {
    position: absolute;
    bottom: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background-color: var(--brandColor);
    box-shadow: 0 2px 6px 0 rgb(101 110 123 / 14%);
}
input {
    display: none;
}
.cancel {
    background-color: white;
}
.add-icon {
    filter: invert(100%) sepia(0%) saturate(976%) hue-rotate(322deg)
        brightness(114%) contrast(100%);
}
.remove-icon {
    filter: invert(46%) sepia(60%) saturate(3638%) hue-rotate(325deg)
        brightness(110%) contrast(98%);
    transform: rotate(45deg);
}
.active {
    background-color: white;
}
</style>