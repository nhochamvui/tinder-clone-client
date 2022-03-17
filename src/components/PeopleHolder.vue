<template>
    <div
        v-on:mouseover="showArrowButton"
        v-on:mouseleave="hideArrowButton" 
        :class="{ 'people-card': !isPersonalInfo, 
        'people-card people-card-detail': isPersonalInfo}" 
    >
        <router-view v-if="isLoadedRequirements()"></router-view>
        <div ref="card" class="info-container" v-if="['MakeFriends', 'Profile', 'SetGenderSide'].includes(routeName)">
            <a v-if="showMore" style="z-index:1;right:50px" class="P(abs) B(0) Cur(p)" @click="showMore = false">
                <img style="width:30px" src="/icon/collapse.svg" alt="">            
            </a>
            <div class="D(flex) W(100) Pb(50px) H(100) Of(scroll) Fd(column)" 
                >
                <div  class="W(100)">
                    <div 
                        :class="{'dragable': routeName == 'MakeFriends' && !showMore, 'detail': showMore, 'background': !isPersonalInfo, 'background-detail': isPersonalInfo}"
                        v-bind:style="backgroundImage"
                    >
                        <div class="arrow-button Cur(p) Pos(l0) Us(none)"
                            v-if="isShowBackButton"
                            v-on:click="onPreviousClick()"
                        >
                            <img  v-bind:src="iconPreviousArrow"
                                v-if="backArrowHover" alt="back">
                        </div>
                        <div class="arrow-button Cur(p) Pos(r0) Us(none)" 
                            v-if="isShowNextButton"
                            v-on:click="onNextClick()"
                        >
                            <img v-bind:src="iconNextArrow" 
                                v-if="nextArrowHover" alt="next">
                        </div>
                        <div v-if="routeName == 'MakeFriends' && !showMore" class="info Pl(5%)">
                            <a class="P(abs) Cur(p)" style="top:10px;right:50px" v-if="routeName === 'MakeFriends'" @click="showMore = !showMore">
                                <img style="width:30px;transform: rotate(180deg);" src="/icon/expand.svg" alt="">            
                            </a>
                            <span class="row">
                                <h2 class="Color(white)" v-if="person.name">{{ person.name }}</h2><h3 class="Color(white)" v-if="person.age">{{ '  '+ person.age }}</h3>
                            </span>
                            <span v-if="person.hometown" class="D(flex) Align(baseline) row mt(12px)">
                                <img class="Sq(14px) Filter(white)" v-bind:src="iconLocation">
                                <span class="info-text Color(white)" v-text="'Lives in ' + person.hometown"></span>
                            </span>
                            <span class="D(flex) Align(baseline) row">
                                <img class="Sq(14px) Filter(white)" v-bind:src="iconSex">
                                <span class="info-text Color(white)" v-if="person.gender" v-text="person.gender"></span>
                            </span>
                            <p class="D(flex) Align(baseline) row Color(white)" v-if="person.about">{{ person.about }}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div v-if="['Profile', 'ProfileEdit', 'SetGenderSide'].includes(routeName) || showMore">
                        <div class="myInfo Pl(10%) Bs(border-box)">
                            <span class="row">
                                <h2 v-if="person.name">{{ person.name }}</h2><h3 v-if="person.age">{{ '  '+ person.age }}</h3>
                            </span>
                            <span v-if="person.hometown" class="D(flex) Align(baseline) row mt(12px)">
                                <img class="Sq(14px) icon" v-bind:src="iconLocation">
                                <span class="info-text" v-text="'Lives in ' + person.hometown"></span>
                            </span>
                            <span class="D(flex) Align(baseline) row">
                                <img class="Sq(14px) icon" v-bind:src="iconSex">
                                <span class="info-text" v-if="person.gender" v-text="person.gender"></span>
                            </span>
                        </div>
                        <hr v-if="person.about" class="divider">
                        <div class="myInfo Pl(10%) Bs(border-box)">
                            <span class="D(flex) Align(baseline) row info-text" v-if="person.about">{{ person.about }}</span>
                        </div>
                    </div>
                    <div v-if="routeName == 'MakeFriends' && !showMore" class="foreground"></div>
                    <div v-if="routeName == 'MakeFriends' && !showMore"
                        v-bind:class="{'black-background': !showMore}"
                     class="tools-container">
                        <button style="border-color:#106bd5" class="normal-button Us(none) Cur(p)">
                            <img style="max-width:24px" src="/icon/repeat.svg" alt="">
                        </button>
                        <button style="border-color:#fd546c" class="special-button Us(none) Cur(p)" v-on:click="onDislikeClick()">
                            <img style="max-width:24px" src="/icon/dislike.svg" alt="">
                        </button>
                        <!-- <button class="normal-button Us(none)">Super Like</button> -->
                        <button style="border-color:#2df187" class="special-button Us(none) Cur(p)" v-on:click="onLikeClick()">
                            <img style="max-width:24px" src="/icon/like.svg" alt="">
                        </button>
                        <button style="border-color:#7b05ba" class="normal-button Us(none) Cur(p)">
                            <img style="max-width:24px" src="/icon/skip.svg" alt="">
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="['Profile', 'SetGenderSide'].includes(routeName) " class="P(abs) B(0) Pb(10px) D(flex) Js(center) H(40px) W(100)"
            style="background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(252,252,252,0.896796218487395) 14%, rgba(255,252,247,0) 100%);"
        >
            <router-link class="button" :to="{ name: 'ProfileEdit' }">
                <span>Edit Info</span>
            </router-link>
        </div>
        
    </div>
    
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// import ProfileEdit from './ProfileEdit.vue';
export default {
    name: "PeopleHolder",
    components: {
        // UploadPhoto,
        // ProfileEdit,
    },
    data() {
        const iconPreviousArrow = this.$store.state.baseUrl + 'previous.svg';
        const iconNextArrow = this.$store.state.baseUrl + 'next.svg';
        const iconLocation = this.$store.state.baseUrl + 'location.svg';
        const iconSex = this.$store.state.baseUrl + 'sex.svg';
        return {
            iconPreviousArrow,
            iconNextArrow,
            iconLocation,
            photoIndex: -1,
            currentMatchName: '',
            currentMatchID: '',
            // person: this.isPersonalData ? this.getMe() : this.personData,
            nextArrowHover: false,
            backArrowHover: false,
            iconSex,
            likeCountStatus: null,
            BASE_PHOTO_URL:
                this.$store.state.hostURL + this.$store.state.hostPhotosURL,
            showModal: false,
            showMore: false,
        }
    },
    props: {
        personData: Object,
        isPersonalData: Boolean,
    },
    methods: {
        ...mapActions({
            doLikePerson: 'users/likePerson',
            dislikePerson: 'users/dislikePerson',
            setNewMatch: 'setNewMatch',
        }),
        ...mapGetters({
            getDocument: "getDocument",
            getMe: "users/getMe",
            isLoadedRequirements: "isLoadedRequirements",
        }),
        openChat(){
            if(this.currentMatchID !== ''){
                this.$router.push({ name: 'Messages', params: {matchID: this.currentMatchID} });
            }
        },
        dragCard(refName){
            let dragElement = this.$refs[refName];
            let document = this.getDocument();

            if(!dragElement){
                return;
            }

            dragElement.onmousedown = onMouseDownEvent;
            dragElement.ontouchstart = onMouseDownEvent;
            let originOffsetLeft = dragElement.offsetLeft, originOffsetTop = dragElement.offsetTop;
            let prevX = 0, prevY = 0;
            let startX = 0, startY = 0;
            let directionX = 0, directionY = 0;
            let limitPoint = 200;
            let thisRef = this;
            function onMouseDownEvent(e){
                startX = e.clientX;
                startY = e.clientY;

                document.onmouseup = onMouseUpEvent;
                document.ontouchend = onMouseUpEvent;
                document.onmousemove = onMouseMoveEvent;
                document.ontouchmove = (e) => onMouseMoveEvent({clientX: e.touches[0].clientX, clientY: e.touches[0].clientY});

                if(startY >= originOffsetTop && startY <= (originOffsetTop + Math.round(dragElement.offsetHeight/2))){
                    directionY = 1;
                }
                else{
                    directionY = -1;
                }
            }

            function onMouseMoveEvent(e){
                let endX = e.clientX, endY = e.clientY;
                let posX = endX - startX, posY = endY - startY;
                startX = e.clientX;
                startY = e.clientY;
                prevX = dragElement.offsetLeft;
                prevY = dragElement.offsetTop;

                dragElement.style.left = prevX + posX + 'px';
                dragElement.style.top = prevY + posY + 'px';

                let deg = 0, maxDeg = 30;
                let currOffsetLeft = dragElement.offsetLeft;
                deg = Math.min((Math.abs(currOffsetLeft - originOffsetLeft)*maxDeg) / limitPoint, maxDeg);
                directionX = currOffsetLeft - originOffsetLeft < 0 ? -1 : 1;
                dragElement.style.transform = 'rotate(' + deg*directionX*directionY + 'deg)';
                dragElement.style.zIndex = 1;
            }

            function onMouseUpEvent(e){
                let currOffsetLeft = dragElement.offsetLeft, currOffsetTop = dragElement.offsetTop;
                
                dragElement.style.zIndex = '';
                if(Math.abs(currOffsetLeft - originOffsetLeft) <= limitPoint 
                    && Math.abs(currOffsetTop - originOffsetTop) <= limitPoint){
                    dragElement.style.left = '';
                    dragElement.style.top = '';
                    dragElement.style.transform = ''; 
                }
                else{
                    dragElement.style.animationName = directionX < 0 ? 'swipe-left' : 'swipe-right';
                    dragElement.style.animationDuration = '0.4s';
                    dragElement.style.animationTimingFunction = 'ease';
                    dragElement.style.animationFillMode = 'forwards';
                    
                    if(directionX < 0){
                        thisRef.onDislikeClick();
                    }
                    else{
                        thisRef.onLikeClick();
                    }
                }
                console.log('mouseup',dragElement.style)
                document.onmouseup = null;
                document.onmousemove = null;
            }
        },
        onPreviousClick(){
            let currIndex = this.photoIndex;
            if(currIndex > 0){
                this.photoIndexGetSet = currIndex - 1;
            }
        },
        onNextClick(){
            let currIndex = this.photoIndex;
            if(currIndex < this.person.profileImages.length-1){
                this.photoIndexGetSet = currIndex + 1;
            }
        },
        getPhotoIndex(){
            if(this.person.profileImages.length > 0){
                this.photoIndex = 0;
                return this.photoIndex;
            }
            this.photoIndex = -1;
            return this.photoIndex;
        },
        async onLikeClick(){
            let result = await this.doLikePerson(this.person.userID);
            if(result && result.isMatched){
                this.showModal = true;
                this.setNewMatch(result.match);
                this.currentMatchName = result.match.name;
                this.currentMatchID = this.person.userID;
            }

            let dragElement = this.$refs['card'];

            if(dragElement.style.animation === ''){
                dragElement.style.animation = "swipe-right-rotate 0.4s ease forwards";
            }

            setTimeout(() => {
                this.$emit('onLikeClick', result.match);
            }, 440);
        }, 
        onDislikeClick(){
            // this.dislikePerson(this.person.userID)
            let dragElement = this.$refs['card'];
            console.log('onDislikeClick',dragElement.style)
            if(dragElement.style.animation === ''){
                dragElement.style.animation = "swipe-left-rotate 0.4s ease forwards";
            }
            setTimeout(() =>{
                this.$emit('onDislikeClick', this.person.id);
            }, 440);
        },
        showArrowButton(){
            if(this.isShowNextButton){
                this.nextArrowHover = true;
            }
            if(this.isShowBackButton){
                this.backArrowHover = true;
            }
        },
        hideArrowButton(){
            if(this.isShowNextButton){
                this.nextArrowHover = false;
            }
            if(this.isShowBackButton){
                this.backArrowHover = false;
            }
        },
        onModalClose(){
            this.showModal = false;
        }
    },
    computed: {
        person: {
            get(){
                return this.isPersonalData ? this.getMe() : this.personData;
            },
        },
        isPersonalInfo: {
            get(){
                return this.isPersonalData;
            }
        },
        photoIndexGetSet: {
            get(){
                return this.photoIndex;
            },
            set(newVal){
                this.photoIndex = newVal;
            }
        },
        profileImages: {
            get(){
                if(this.person.profileImages){
                    return this.person.profileImages.filter(item => item !== '');
                }
                return [];
            }
        },
        backgroundImage: {
            get(){
                if(this.profileImages && this.profileImages[this.photoIndexGetSet] !== undefined){
                    return { 'background-image': 'url(' + this.profileImages[this.photoIndexGetSet] + ')' };
                }
                return '';
            },
            set(val){
                console.log('set bg', val);
            }
        },
        isShowNextButton: function(){
            let currIndex = this.photoIndex;
            if(this.profileImages && currIndex == this.profileImages.length-1){
                return false;
            }
            return true;
        },
        isShowBackButton: function(){
            let currIndex = this.photoIndex;
            if(currIndex == 0){
                return false;
            }
            return true;
        },
        routeName: function(){
            return this.$route.name;
        },
        isNotEnoughLikeCount: {
            get(){
                return this.likeCountStatus;
            },
            set(newValue){
                this.likeCountStatus = newValue;
            }
        },
        me: function(){
            return this.getMe();
        }
    },
    watch: {
        profileImages: function(newValue, oldValue){
            console.log('profileImages changes: ', oldValue, newValue)
            if(oldValue.length == 0 && newValue.length > 0){
                this.photoIndexGetSet = 0;
            }
        },
        photoIndexGetSet: function(){
        },
        routeName: function(){
        },
        isMatched: function(newValue){
            console.log('your result: ', newValue);
        },
        backgroundImage: function(newValue){
        },
    },
    mounted: function(){
        console.log('peopleHolder mounted: ', this.person);
        if(!this.isPersonalInfo){
            this.dragCard('card');
        }

        if(this.person && this.person.profileImages && this.person.profileImages.length > 0){
            this.photoIndex = 0;
        }
        else{
            this.photoIndex = -1;
        }
    }
}
</script>

<style>
@keyframes swipe-right {
    100% {
        left: 120vw;
    }
}

@keyframes swipe-right-rotate {
    0%{
        left: 200px;
        transform: rotate(15deg);
    }
    100% {
        left: 120vw;
    }
}

@keyframes swipe-left {
    100% {
        left: -120vw;
    }
}
@keyframes swipe-left-rotate {
    0%{
        left: -200px;
        transform: rotate(-15deg);
    }
    100% {
        left: -120vw;
    }
}
@keyframes return-from-left {
    100% {
        left: -100vw;
    }
}
</style>
<style scoped>
h2, h3{
    display: inline;
    user-select: none;
}

.background-detail{
    max-height: calc(100vh * 0.85 - 40px * 0.85);
    height: calc(667px * 0.85);
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}
.background{
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 10px;
    background-size: cover;
    border: rgb(221, 217, 217) solid 1px;
    box-shadow: 0px 0px 14px 1px rgb(0 0 0 / 20%);
}
.detail{
    max-height: calc(100vh * 0.85 - 40px * 0.85);
    height: calc(667px * 0.85);
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border: rgb(221, 217, 217) solid 1px;
    box-shadow: 0px 0px 14px 1px rgb(0 0 0 / 20%);
}
.people-card{
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 375px;
    height: 667px;
    max-height: calc(100vh - 44px);
    /* height: 85%; */
    border-radius: 10px;
    position: absolute;
    box-shadow: 0px 0px 14px 1px rgb(0 0 0 / 20%);
}
@media screen and (max-width: 749px){
    .people-card{
        width: 100%;
        height: 100%;
        margin-left: 10px;
        margin-right: 10px;
        max-height: none;
        position: absolute;
        border-radius: 10px;
        box-shadow: 0px 0px 14px 1px rgb(0 0 0 / 20%);
    }
}
.dragable{
    position: absolute;
    animation-duration: 1s;
    animation-direction: alternate;
    /* animation-fill-mode: forwards; */
}

.people-card-detail{
    position: relative;
    overflow-y: scroll;
    scroll-behavior: auto;
}
img{
    width: 100%;
}
.foreground{
    height: 68px;
    width: 100%;
    position: absolute;
    bottom: 84px;
    background-image: linear-gradient(to top, black,#fff0);
}
.tools-container{
    min-height: 84px;
    height: 68px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    position: absolute;
    bottom: 0;
    align-items: center;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-bottom: 5px;
}
.info{
    position: absolute;
    height: 100%;
    width: 100%;
    top: 60%;
    display: flex;
    flex-flow: column;
    align-items: flex-start;
}
.info-container{
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 10px;
    background: white;
}
.myInfo{
    padding-left: 5%;
    padding-right: 5%;
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: flex-start;
}
.arrow-button{
    display: flex;
    align-items: center;
    width: 20px;
    height: 85%;
    position: absolute;
    top: 0;
    bottom: 20%;
    filter: invert(100%) sepia(2%) saturate(9%) hue-rotate(341deg) brightness(103%) contrast(103%);
}
.divider{
    height: 1px;
    width: 100%;
    overflow: visible;
    border-width: 0;
    background-color: var(--color--divider-primary);
}
.black-background{
    background: black;
}
.Pos\(r0\){
    right: 0;
}
.Pos\(l0\){
    left: 0;
}
.special-button{
    min-width: 78px;
    border-radius: 50%;
    aspect-ratio: 1/1;
}
.special-button:hover > img{
    transform: scale(1.3);
    transition: all 0.5s ease-out;
}

.normal-button{
    min-width: 60px;
    border-radius: 50%;
    aspect-ratio: 1/1;
}
button{
    border: white solid 1px;
    background-color: transparent;
}
.icon{
    filter: invert(33%) sepia(10%) saturate(795%) hue-rotate(175deg) brightness(93%) contrast(81%);
}
.button{
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    box-shadow: 0 1px 6px 0 rgb(0 0 0 / 27%);
    height: 40px;
    max-width: 100%;
    color: #fff;
    box-sizing: border-box;
    padding-left: 24px;
    padding-right: 24px;
    border-radius: 30px;
    background: linear-gradient(225deg,var(--color--brand-coral),var(--color--brand-hot-pink));
    cursor: pointer;
    box-shadow: 0 1px 6px 0 rgb(0 0 0 / 27%);
}
.button:hover{
    background: linear-gradient(-225deg,var(--color--brand-coral),var(--color--brand-hot-pink));
}
a{
    text-decoration: none;
}
.row{
    margin-top: 5px;
    user-select: none;
}
.info-text{
    margin-left: 5px;
    color: #505965;
}
.Cur\(p\){
    cursor: pointer;
}
.Va\(m\){
    vertical-align: middle;
} 
.Sq\(14px\){
    width: 14px;
    height: 14px;
}
.D\(flex\){
    display: flex;
}
.Align\(baseline\){
    align-items: baseline;
}
.Al\(center\){
    align-items: center;
}

.Js\(center\){
    justify-content: center;
}
.mt\(12px\){
    margin-top: 12px;
}

.Bs\(border-box\){
    box-sizing: border-box;
}

.W\(100\){
    width: 100%;
}

.H\(100\){
    height: 100%;
}
.H\(40px\){
    height: 40px;
}

.Of\(scroll\){
    overflow: scroll;
}
.Fd\(column\){
    flex-direction: column;
}
.P\(abs\){
    position: absolute;
}
.B\(0\){
    bottom: 0;
}
.Pb\(10px\){
    padding-bottom: 10px;
}
.Pb\(50px\){
    padding-bottom: 50px
} 
</style>