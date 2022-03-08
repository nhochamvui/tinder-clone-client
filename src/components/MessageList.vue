<template>
    <div
        v-for="message of messageList"
        v-bind:key="(matchInfo = getMatchInfo(message.fromID, message.toID))"
        class="messagelist__container"
    >
        <a
            class="message__container"
            v-on:click="
                (e) => {
                    openConversationHistory(
                        message.fromID == me.id ? message.toID : message.fromID
                    );
                    onClickMessage(e);
                }
            "
            v-bind:ref="'message__container-' + message.id"
            v-bind:class="{
                'messagelist__container--active':
                    matchId == message.fromID || matchId == message.toID,
            }"
        >
            <div class="message__avatar--holder">
                <Image
                    class="message__avatar--img"
                    v-bind:imgSrc="matchInfo.img"
                    v-bind:altString="'mini_profile_picture'"
                />
            </div>
            <div class="message__info">
                <div class="message__sender">
                    <h3>{{ matchInfo.name }}</h3>
                </div>
                <div class="message__content">
                    <Image
                        style="height: 15px; width: 15px; object-fit: cover"
                        v-bind:imgSrc="getMessageNotiIcon(message.fromID)"
                        v-bind:altString="'icon_message'"
                    />
                    <div
                        v-text="message.content"
                        style="
                            width: calc(100% - 15px);
                            margin-left: 8px;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        "
                    ></div>
                </div>
            </div>
            <div
                class="indicator"
                v-bind:class="{
                    'indicator--active':
                        matchId == message.fromID || matchId == message.toID,
                }"
            ></div>
        </a>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Image from "./Image.vue";
export default {
    name: "MessageList",
    inheritAttrs: false,
    emits: ["navIndexChange"],
    data() {
        return {
            currentActiveBlock: null,
            currentActiveIndicator: null,
            currentHoverElement: null,
        };
    },
    components: {
        Image: Image,
    },
    computed: {
        messageList: {
            get() {
                // console.log("get messagelist");
                let list = this.getLatestMessages();
                return list;
            },
        },
        me: {
            get() {
                return this.getMe();
            },
        },
        matchId: {
            get() {
                return this.$route.params.matchID;
            },
        },
    },
    watch: {
        messageList: function (newValue, oldValue) {
            // console.log("messagelist changed: ", newValue, oldValue);
        },
    },
    methods: {
        ...mapGetters({
            getLatestMessages: "getLatestMessages",
            getMatches: "getMatches",
            getMe: "users/getMe",
            getConnection: "getConnection",
            getHostPhotosURL: "getHostPhotosURL",
        }),
        ...mapActions({
            fetchLatestMessages: "fetchLatestMessages",
            setElementLatestMessages: "setElementLatestMessages",
        }),
        getMessageNotiIcon(fromID) {
            return fromID == this.me.id ? "/reply-arrow.svg" : "/inbox.svg";
        },
        getMatchInfo(fromID, toID) {
            let matches = this.getMatches();
            let matchID = fromID == this.me.id ? toID : fromID;
            let img = "";
            let name = "";
            let id;
            matches.forEach((element) => {
                if (element.id == matchID) {
                    img = this.getHostPhotosURL() + element.profileImages[0];
                    name = element.name;
                    id = element.id;
                    return;
                }
            });
            return { name, img, id };
        },
        openConversationHistory(matchID) {
            this.$router.push({
                name: "Messages",
                params: { matchID: matchID },
            });
        },
        registerEvent: function () {
            this.getConnection().on("Inbox", (message) => {
                this.messageList.forEach((element, index) => {
                    let senderID = message.fromID;
                    let targetID = message.toID;
                    if (
                        (senderID == element.fromID &&
                            targetID == element.toID) ||
                        (senderID == element.toID && targetID == element.fromID)
                    ) {
                        this.setElementLatestMessages({
                            index: index,
                            fromID: senderID,
                            toID: targetID,
                            content: message.content,
                            timestamp: message.timeStamp,
                        });
                    }
                });
                this.inbox = message;
            });
        },
        onClickMessage: function (e) {
            // if (
            //     this.currentActiveBlock !== null &&
            //     this.currentActiveIndicator !== null
            // ) {
            //     this.currentActiveBlock.className.replace(
            //         "messagelist__container--active",
            //         ""
            //     );
            //     this.currentActiveIndicator.className.replace(
            //         "indicator--active",
            //         ""
            //     );
            // }
            // let chatContainer = e.target.parentNode;
            // while (!chatContainer.classList.contains("message__container")) {
            //     chatContainer = chatContainer.parentNode;
            // }
            // chatContainer.classList.add("messagelist__container--active");
            // this.currentActiveBlock = chatContainer;
            // if (chatContainer.hasChildNodes(".indicator")) {
            //     chatContainer.children.forEach((element) => {
            //         if (element.classList.contains("indicator")) {
            //             element.classList.add("indicator--active");
            //             this.currentActiveIndicator = element;
            //         }
            //     });
            // }
        },
    },
    mounted: function () {
        console.log("mounted messagelist");
        this.$emit("navIndexChange", 2);
        this.fetchLatestMessages();
        this.registerEvent();
    },
    updated: function () {
    },
};
</script>

<style scoped>
.messagelist__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100px;
    cursor: pointer;
    background-color: var(--color--empty-background2);
}
.messagelist__container--active {
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 28%);
    background-color: white;
}

.message__container {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    transition-duration: 0.2s;
}
.message__avatar--holder {
    box-sizing: border-box;
    width: 100px;
    height: 100%;
    padding: 15px;
}
.message__avatar--img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}
.message__info {
    width: calc(100% - 100px - 5px);
    height: 100%;
    display: flex;
    flex-direction: column;
}
.message__sender {
    width: 100%;
    height: 50%;
    display: flex;
    align-items: flex-end;
}
.message__content {
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    color: var(--secondaryColor);
}
.indicator {
    width: 5px;
    height: 100%;
    opacity: 0;
}
.indicator--active {
    background-color: var(--brandColor);
    opacity: 1;
}
h3 {
    display: block;
    font-size: 1.17em;
    font-weight: 600;
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    color: var(--primaryColor);
}
</style>