<template>
  <div class="D(flex) Fd(row) W(100%) H(100%)">
    <div class="chat" v-if="matchId">
      <div class="match__info">
        <div class="match__avatar">
          <Image v-if="currentMatch" class="avatar Of(cover)" v-bind:imgSrc="currentMatch.profileImages[0]" v-bind:altString="'mini_avatar'"></Image>
          <div class="match__date" v-if="currentMatch" v-text="'You matched with ' + currentMatch.name + ' on ' + dateOfMatch"></div>
        </div>
        <a class="close__button Cur(p)" @click="$router.go(-1)">
          <img class="close__button--img" src="/close.svg" style="width: 30px; height: 30px;" alt="">
        </a>
      </div>
      <div ref="conversation-history" class="conversation__history" v-on:wheel.passive="onWheel">
      </div>
      <div class="chat__tools">
        <form class="chat__form" action="">
          <textarea class="chat__box Rs(none)" v-model="input" name="" id="" cols="30" rows="10" placeholder="Type a message" maxlength="5000" style="height: 37px"></textarea>
        </form>
        <button 
          v-on:click="submitMesssage(input)" 
          class="button__submit"
          v-bind:class="{ 'button__submit-disable': input.trim() === ''}"
          >SEND</button>
      </div>
    </div>
    <div class="H(100%) W(100%) tf" v-else-if="windowWidth < 750">
      <div class="H(100%) W(100%) D(flex) Fd(column) ">
        <Matches>
          <template v-slot:header>
            <span>New matches</span>
          </template>
        </Matches>
        <router-view name="child" />
      </div>
    </div>
    <h4 v-if="!matchId && windowWidth >= 750" class="Us(none) W(100%) Ta(center) Al(center)">Tip: Don't let your match waiting... Text them first!</h4>
  </div>
  
</template>

<script>
import { mapActions, mapGetters, useStore } from 'vuex';
import { computed, onMounted, ref, watchEffect,  } from 'vue';
import { defineComponent, createApp } from 'vue';
import Image from "./Image.vue";
import Matches from './Matches.vue';
import { debug } from 'console';
export default {
    name: "Messages",
    inheritAttrs: false,
    props: {
      matchID: String,
    },
    components: {
      Image: Image,
      Matches,
    },
    setup () {
      const inbox2 = ref([]);
      const store = useStore();
      const messages2 = computed(() => store.getters.getMessages);
      const fetch = () => {
        store.dispatch('fetchMessages');
      };
      onMounted(async () => {
        // await store.dispatch('fetchMatches');
      });
      watchEffect(() => {
        // if(messages2.value.length != 0){
        //   messages2.value.forEach(m => {
        //     inbox2.value.push(m);
        //   });
        // }
      });
      return {
        inbox2,
        fetch,
        messages2,
      }
  },
    data(){
      const signalR = require('@microsoft/signalr');
      const conn = new signalR.HubConnectionBuilder()
              .withUrl("https://localhost:5001/chat", {accessTokenFactory: () => this.getUserToken()})
              .configureLogging(signalR.LogLevel.Information)
              .build();
      return {
        input: '',
        connection: conn,
        inbox: Object,
        isMyTurn: null,
        currentTarget: null,
        pageIndex: 1,
        pageSize: 12,
        history: [],
        isFetchingMessages: false,
        isSmallWidth: true,
      }
    },
    computed: {
      me: {
        get(){
          return this.getMe();
        }
      },
      windowWidth: {
        get(){
          return this.getWindowWidth();
        }
      },
      matchAvatar: {
        get(){
          return this.currentMatch && this.currentMatch.profileImages[0] !== '' ? 
          this.currentMatch.profileImages[0] : '/img/default_profile_picture.jpg';
        },
        set(){
        }
      },
      matches: {
        get(){
          return this.getMatches();
        }
      },
      matchId: {
        get(){
          console.log('param matchID: ', this.$route.params.matchID)
          return this.$route.params.matchID;
        }
      },
      currentMatch: {
        get(){
          console.log('getting currentmatch, matchID: ', this.matchID);
          return this.matchID? this.matches.find(match => match.id == this.matchID) : undefined;
        }
      },
      dateOfMatch: {
        get(){
          let multiply = 1;
          if(this.currentMatch.dateOfMatch.toString().length == 10){
            multiply = 1000;
          }
          let unixDate = new Date(this.currentMatch.dateOfMatch * multiply);
          let separator = '/';
          return unixDate.getDate() + separator + (unixDate.getMonth()+1) + separator + unixDate.getFullYear();
        }
      },
      chatConnection: {
        get(){
          return this.connection;
        }
      },
      messages: {
        get(){
          return this.getMessages();
        }
      },
      lengthMessage: {
        get(){
          let length = this.messages.length;
          return length;
        }
      },
      rootHeight: {
        get(){
          let conversationHistory = this.$refs['conversation-history'];
          if(conversationHistory){
            return conversationHistory.height;
          }
          return 0;
        }
      }
    },
    watch: {
      messages: {
        handler: function(newValue, oldValue){
          let conversationHistory = this.$refs['conversation-history'];

          if(newValue){
            let prevScrollHeight = conversationHistory.scrollHeight;
            newValue.forEach(message => {
              this.renderMessage(message, true);
            });
            if(this.pageIndex == 1){
              conversationHistory.lastChild.scrollIntoView();
            }
            else{
              let currScrollHeight = conversationHistory.scrollHeight;
              conversationHistory.scrollTop = currScrollHeight - prevScrollHeight;
            }
          }
        },
        // deep: true,
        // immediate: true,
      },
      currentMatch: function(newValue){
        console.log('currentmatch changed: ', newValue);
      },
      lengthMessage: {
        handler: function(){
          // if(newValue - oldValue == 1){
          //   this.renderMessage(this.messages[this.messages.length-1]);
          // }
          // else{
            // this.messages.forEach(message => {
            //   this.renderMessage(message);
            // });
          // }
        },
        immediate: true,
      },
      matchId: {
        handler: function(newValue, oldValue){
          console.log('new matchID: ', newValue);
          console.log('old matchID: ', oldValue);
          let conversationHistory = this.$refs['conversation-history'];
          if(conversationHistory){
            conversationHistory.innerHTML = '';
          }
          if(newValue !== '' && newValue){
            this.pageIndex = 1;
            this.fetchMessagesByID({
              "pageIndex": this.pageIndex,
              "pageSize": this.pageSize, 
              "matchID": newValue
            });
          }
        },
        immediate: true,
      }
    },
    methods: {
      ...mapGetters({
        getMatches: "getMatches",
        getUserToken: "users/getUserToken",
        getMessages: "getMessages",
        getMe: "users/getMe",
        getConnection: "getConnection",
        getHostPhotosURL: "getHostPhotosURL",
        getWindowWidth: "getWindowWidth",
      }),
      ...mapActions({
        fetchMessagesByID: 'fetchMessagesByID',
        fetchMatches: 'fetchMatches',
      }),
      submitMesssage(message){
        if(message.trim().length > 0){
          try {
            this.getConnection().invoke("SendMessage", this.matchId, message);
            this.input = '';
            console.log('sending message: ', message);
          } catch (err) {
            console.error(err);
          }
        }
      },
      createBubbleAvatar(img, classes){
        let div = defineComponent({
          extends: Image,
        });
        const container = document.createElement('div');
        
        createApp(div, { imgSrc: img, altString: 'avatar'}).mount(container);
        container.firstChild.style.borderRadius = "50%";
        container.firstChild.style.objectFit = "cover";
        classes.forEach(name => {
          container.firstChild.className += ' ' + name;
        });
        return container.firstChild;
      },
      createBubbleChat(text, classes){
        let div = document.createElement('div');
        div.addEventListener("mouseover", (e) => this.historyMouseOver(e));
        div.addEventListener("mouseleave", this.historyMouseLeave);
        classes.forEach(name => {
          div.className = div.className + ' ' + name;
        });
        div.innerText = text;
        return div;
      },
      createBubbleTime(timeStamp, classes){
        let unixTime = new Date(timeStamp);
        let separator = '/';
        let date = unixTime.getDate() + separator + 
        (unixTime.getMonth()+1) + separator + unixTime.getFullYear() 
        + ' - ' + unixTime.getHours() + ':' + unixTime.getMinutes();
        let div = document.createElement('div');
        classes.forEach(name => {
          div.className += name + ' ';
        });
        div.innerText = date;
        return div;
      },
      renderMessage(message, isPrepend){
        let history = this.$refs['conversation-history'];
        let bubbleContainer = document.createElement("div");
        let bubbleChat;
        let avatar = this.createBubbleAvatar(this.matchAvatar, ['avatar', 'bubble__avatar'])
        let bubbleTime = this.createBubbleTime(message.timeStamp, ['time__bubble', 'Color(secondary)']);
        if(message.fromID == this.matchId || message.toID == this.matchId){
          // message sent by me
          if(message.fromID == this.me.userID){
            bubbleContainer.className = "right chat__container Al(flex-end)";
            bubbleChat = this.createBubbleChat(message.content, ['right__bubble', 'chat__bubble']);
            bubbleContainer.appendChild(bubbleTime);
            bubbleContainer.appendChild(bubbleChat);
          }
          // message sent from his/her
          else if(message.fromID == this.matchId){
            bubbleContainer.className = "left chat__container Al(flex-start)";
            bubbleChat = this.createBubbleChat(message.content, ['left__bubble', 'chat__bubble'])
            
            bubbleContainer.appendChild(avatar);
            bubbleContainer.appendChild(bubbleChat);
            bubbleContainer.appendChild(bubbleTime);
          }
          if(isPrepend){
            if(history.firstChild && history.firstChild.className.includes('left')){
              avatar.style.visibility = 'hidden';
            }

            history.prepend(bubbleContainer);
          }
          else{
            // in case of message from them -> hide avatar of previous message.
            if(message.fromID == this.matchId && history.lastChild && history.lastChild.className.includes('left')){
              history.lastChild.querySelector('.avatar').style.visibility = 'hidden';
            }
            history.appendChild(bubbleContainer);
            history.scrollTop = history.scrollHeight;
          }
        }
      },
      connect: async function(){
        try{
          await this.chatConnection.start();
          console.log('connected!');
        }
        catch(err){
          console.log('error while connect: ', err);
          setTimeout(this.connect, 5000);
        }
      },
      registerEvent: function(){
        this.getConnection().on("close", async () =>{
          try{
            console.log('socket on close')
            setTimeout(this.connect, 5000);
          }
          catch(err){
            console.log('err: ', err);
          }
        });

        this.getConnection().on('Inbox', (message) => {
          // this.inbox = message
          // co tin nhan moi
          // this.messages.push(message);
          this.renderMessage(message, false);
        });

        this.getConnection().on('NewMatch', (matchInfo) => {
          console.log('Hub -> new match:', matchInfo);
        });
      },
      historyMouseOver: function(e){
        if(e != null && e.target.className.includes('chat__bubble')){
          this.currentTarget = e.target;
          e.target.parentElement.querySelector('.time__bubble').className += 'active' + ' ';
        }
      },
      historyMouseLeave: function(){
        if(this.currentTarget !== null){
          let className = this.currentTarget.parentElement.querySelector('.time__bubble').className;
          this.currentTarget.parentElement.querySelector('.time__bubble').className = className.replace('active', '');
        }
        else{
          this.currentTarget = null;
        }
      },
      onScroll: function(e){
        let top = e.currentTarget.scrollTop;
        let conversationHistory = this.$refs['conversation-history'];
      },
      onWheel: function(e){
        let top = e.currentTarget.scrollTop;
        let conversationHistory = this.$refs['conversation-history'];
        
        if(top == 0 && e.wheelDeltaY > 0 && !this.isFetchingMessages){
          this.isFetchingMessages = true;
          this.fetchMessagesByID({
            "pageIndex": ++this.pageIndex,
            "pageSize": this.pageSize, 
            "matchID": this.matchID,
          }).then((contentSize) => {
            if(contentSize == 0){
              // neu content size = 0 -> no more old messages -> --pageIndex
              this.pageIndex--;
            }
            this.isFetchingMessages = false;
          });  
        }
      },
    },
    mounted: function(){
      console.log('mounted messages');
      console.log('this.matchID: ', this.matchID)
      this.registerEvent();
    },
    updated: function(){
    }
}
</script>

<style scoped>

form{
  margin: 0 0 0 0;
}
.chat{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  user-select: none;
}
.match__info{
  padding: 20px 24px 20px 24px;
  height: 75px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: #e6eaf0 solid 1px;
  box-sizing: border-box;
}

.chat__tools{
  height: 74px;
  width: 100%;
  bottom: 0;
  border-top: var(--gray40) solid 1px;
  /* display: flex;
  align-items: center; */
  display: grid;
  grid-template-columns: 4fr 1fr;
}

.chat__form{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.chat__box{
  width: 100%;
  border: none;
  outline: none;
  padding-left: 2%;
  padding-right: 2%;
  white-space: normal;
  align-self: center;
  font-size: 1rem;
}

.emoji__picker{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  align-self: center;
}

.button__submit{
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 25px;
  align-self: center;
  justify-self: center;
  font-size: 1rem;
  font-weight: bold;
  background: linear-gradient(45deg,#fd267a,#ff6036);
  color: white;
}
.button__submit-disable{
  color: var(--color--text-secondary);
  background: var(--color--empty-background);
}

.match__avatar{
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.avatar{
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: white solid 3px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 28%);
}
.match__date{
  width: 60%;
  height: 100%;
  padding-left: 24px;
  display: flex;
  align-items: center;
}
.close__button{
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: right;
}
.close__button--img{
  transition: transform .2s ease;
  filter: invert(73%) sepia(28%) saturate(133%) hue-rotate(177deg) brightness(92%) contrast(86%);
}
.close__button--img:hover{
  transform: rotate(-90deg);
  filter: none;
}

textarea{
  box-sizing: border-box;
}
.conversation__history{
  width: 100%;
  height: calc(100% - 150px);
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}
.conversation__history::-webkit-scrollbar{
  display: block;
  width: 8px;
  height: 8px;
  /* background: rgb(227 227 227); */
}
.conversation__history::-webkit-scrollbar-thumb{
  display: block;
  background: gray;
  border-radius: 5px;
}
</style>
<style>
.right__bubble{
  text-align: right;
  background-color: var(--blue40);
  margin-bottom: 6px;
  margin-top: 6px;
  color: white;
  /* border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 4px;  */
}

.left__bubble{
  text-align: left;
  background-color: var(--gray20);
  margin-bottom: 6px;
  margin-top: 6px;
  margin-left: 8px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 4px;
}

.chat__bubble{
  box-sizing: border-box;
  /* border-radius: 15px; */
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 13px;
  padding-right: 13px;
  border-radius: 15px;
  font-size: 0.94rem;
  word-wrap: break-word;
  max-width: 350px;
  text-align: left;
}
.chat__container{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.Al\(flex-end\){
  align-self: flex-end;
}

.Al\(flex-start\){
  align-self: flex-start;
}
.bubble__avatar{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
}
.bubble__middle__left{
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.bubble__top__right{
  border-bottom-right-radius: 5px;
}
.bubble__middle__right{
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.bubble__bottom_right{
  border-top-right-radius: 5px;
}
.time__bubble{
  font-family: ProximaNova,sans-serif;
  font-size: 13px;
  transition-property: opacity;
  transition-duration: 0.2s;
  opacity: 0;
  box-sizing: border-box;
  padding-left: 8px;
  padding-right: 8px;
}
.active{
  opacity: 1;
}
</style>