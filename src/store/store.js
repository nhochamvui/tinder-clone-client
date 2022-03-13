import { createStore } from 'vuex';
import moduleUser from './modules/User';
import axios from 'axios';
import { Console } from 'console';
import { userInfo } from 'os';
const signalR = require('@microsoft/signalr');
window.addEventListener('resize', () => {
    store.dispatch('setWindowWidth');
});

const store = createStore({
    state: {
        // makeFriends: this.$route.
        image: '/img/ppl1.jpg',
        suggestedPeople: [],
        baseUrl: process.env.BASE_URL,
        hostURL: process.env.VUE_APP_HOST_URL,
        hostPhotosURL: 'photos/',
        matches: [],
        settings: null,
        messages: [
            /* {
            //     id: 1,
            //     from: 1,
            //     to: 2,
            //     time: '1700',
            //     content: 'hello',
            // },
            // {
            //     id: 2,
            //     from: 1,
            //     to: 2,
            //     time: '1701',
            //     content: 'whats your name?'
            // },
            // {
            //     id: 3,
            //     from: 2,
            //     to: 1,
            //     time: '1702',
            //     content: 'huynh thai'
            // },
            // {
            //     id: 4,
            //     from: 2,
            //     to: 1,
            //     time: '1701',
            //     content: 'whats your name?'
            // },
            // {
            //     id: 5,
            //     from: 1,
            //     to: 2,
            //     time: '1701',
            //     content: 'my bae'
            // }*/
        ],
        latestMessages: [],
        connection: null,
        document: null,
        windowWidth: window.innerWidth,
    },
    mutations: {
        SET_DOCUMENT(state, element) {
            state.document = element;
        },
        SET_SUGGESTED_PEOPLE(state, people) {
            state.suggestedPeople = people;
        },
        SET_MATCHES(state, matches) {
            console.log('set matches: ', matches);
            state.matches = matches;
        },
        ADD_NEW_MATCH(state, match) {
            console.log('set new match: ', match);
            state.matches.unshift(match);
        },
        SET_SETTINGS(state, settings) {
            state.settings = settings;
            console.log('set setting: ', state.settings);
        },
        SET_MESSAGES(state, messages) {
            state.messages = messages;
        },
        SET_LATEST_MESSAGES(state, latestMessages) {
            state.latestMessages = latestMessages;
        },
        SET_DISTANCEPREF(state, value) {
            state.settings.distancePreference = value;
        },
        SET_DISTANCEPREF_CHECK(state, toogleValue) {
            state.settings.distancePreferenceCheck = toogleValue;
        },
        SET_GENDER(state, gender) {
            state.settings.lookingForGender = gender;
        },
        SET_ELEMENT_LATEST_MESSAGES(state, value) {
            if (value.index !== undefined &&
                value.fromID !== undefined &&
                value.toID !== undefined &&
                value.content !== undefined &&
                value.timestamp !== undefined) {
                state.latestMessages[value.index].fromID = value.fromID;
                state.latestMessages[value.index].toID = value.toID;
                state.latestMessages[value.index].content = value.content;
                state.latestMessages[value.index].timeStamp = value.timestamp;
                console.log('before: ', state.latestMessages);
                state.latestMessages.sort((m1, m2) => {
                    return m2.timeStamp - m1.timeStamp
                });
                console.log('after: ', state.latestMessages)
            }
        },
        SET_CONNECTION(state, connection) {
            state.connection = connection;
        }
    },
    getters: {
        // deprecated
        isLoadedRequirements(state, getters) {
            let isLoaded = true;
            if (getters.getSettings == null) {
                isLoaded = false;
            }
            if (!getters['users/isAuthenticated']) {
                isLoaded = false;
            }

            return isLoaded;
        },
        authenticated() {
            return true;
        },
        getSuggestedPeople(state) {
            return state.suggestedPeople;
        },
        getMatches(state) {
            return state.matches;
        },
        getSettings(state) {
            return state.settings;
        },
        getMessages(state) {
            return state.messages;
        },
        getLatestMessages(state) {
            return state.latestMessages;
        },
        getConnection(state) {
            return state.connection;
        },
        getDocument(state) {
            return state.document;
        },
        getHostURL(state) {
            return state.hostURL;
        },
        getHostPhotosURL(state) {
            return state.hostURL + state.hostPhotosURL;
        },
        getWindowWidth(state) {
            return state.windowWidth;
        },
    },
    actions: {
        setWindowWidth(context) {
            this.state.windowWidth = window.innerWidth;
        },
        setDocument(context, element) {
            context.commit('SET_DOCUMENT', element);
        },
        test(context, loginInfo) {
            console.log("test: ", loginInfo);
            console.log("users module: ", this.state.users);
        },
        connect: async function() {
            try {
                await this.getters['getConnection'].start();
                console.log('connected to the hub!');
            } catch (err) {
                console.log('error while connect: ', err);
                //   setTimeout(this.connect, 5000);
            }
        },
        async getNewSuggestedPeople(context) {
            try {
                let settings = this.getters['getSettings'];
                let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/matches/discover/', {
                    "Gender": settings.lookingForGender,
                    "MinAge": settings.agePreferenceCheck ? settings.minAge : 0,
                    "MaxAge": settings.agePreferenceCheck ? settings.maxAge : 0,
                    "Location": settings.location,
                    "Distance": settings.distancePreferenceCheck ? settings.distancePreference : 0,
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
                let people = response.data;
                context.commit('SET_SUGGESTED_PEOPLE', people);
            } catch (err) {
                console.log('error while get new suggested person: ', err);
            }
        },
        async fetchMatches(context) {
            try {
                let response = await axios.get(process.env.VUE_APP_HOST_URL + '/api/matches/', {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
                let matches = response.data;
                context.commit('SET_MATCHES', matches);
            } catch (err) {
                console.log('error while get matches: ', err);
            }
        },
        setNewMatch(context, payload) {
            context.commit('ADD_NEW_MATCH', payload);
        },
        async fetchSettings(context) {
            try {
                let response = await axios.get(process.env.VUE_APP_HOST_URL + '/api/users/discoverysettings', {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
                let settings = response.data;
                console.log('fetched setting: ', settings);
                context.commit('SET_SETTINGS', settings);
            } catch (err) {
                console.log('error while fetch settings: ', err);
            }
        },
        async fetchMessagesByID(context, params) {
            try {
                console.log('fetching messages')
                let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/messages/', {
                    "PageIndex": params.pageIndex,
                    "PageSize": params.pageSize,
                    "RecieverID": params.matchID
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
                let messages = response.data;
                context.commit('SET_MESSAGES', messages);
                return messages.length;
            } catch (err) {
                console.log('error while fetch settings: ', err);
                return 0;
            }
        },
        async fetchLatestMessages(context) {
            try {
                let response = await axios.get(process.env.VUE_APP_HOST_URL + '/api/messages/getlatestmessages', {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
                let messages = response.data;
                context.commit('SET_LATEST_MESSAGES', messages);
            } catch (err) {
                console.log('error while fetch settings: ', err);
            }
        },
        setDistancePref(context, value) {
            context.commit('SET_DISTANCEPREF', value);
        },
        setDistancePrefCheck(context, toogleValue) {
            if (toogleValue || !toogleValue) {
                context.commit('SET_DISTANCEPREF_CHECK', toogleValue);
            }
        },
        setGender(context, gender) {
            if (typeof gender == 'number' && gender >= 0 && gender <= 2) {
                context.commit('SET_GENDER', gender);
            }
        },
        saveSettings() {
            try {
                let settings = this.getters['getSettings'];
                console.log('settings gonna be saved: ', settings);
                axios.post(process.env.VUE_APP_HOST_URL + '/api/users/savesettings', settings, {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
            } catch (ex) {
                console.log('error when save settings: ', ex);
            }
        },
        setSettings(context, settings) {
            context.commit('SET_SETTINGS', settings);
        },
        setElementLatestMessages(context, value) {
            context.commit('SET_ELEMENT_LATEST_MESSAGES', value);
        },
        createConnection(context) {
            let connection = new signalR.HubConnectionBuilder()
                .withUrl(process.env.VUE_APP_HOST_URL + "/chat", { accessTokenFactory: () => this.getters['users/getUserToken'] })
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect()
                .build();
            context.commit('SET_CONNECTION', connection);
        },
        async doFbAuth(context, fbToken) {
            try {
                let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/users/fbauth', fbToken);
                switch (response.status) {
                    case 200:
                        console.log('response auth:', response)
                            // context.dispatch("users/setToken", response.data, { root: true });
                        return response.data;
                }
            } catch (ex) {
                console.log('authorize with Facebook failed: ', ex);
                return null;
            }
        },
        async doSignup(context, data) {
            try {
                let bodyFormData = new FormData();
                for (const property in data) {
                    bodyFormData.append(property.toString(), data[property]);
                }
                let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/users/fbsignup', bodyFormData);
                switch (response.status) {
                    case 200:
                        console.log('response signup:', response)
                            // localStorage.setItem("TinderClone/token", response.data);
                            // context.dispatch("users/setToken", response.data, { root: true });
                        return response.data;
                }
            } catch (ex) {
                console.log('authorize with Facebook failed: ', ex);
                return null;
            }
        },
        async doPost(context, params) {
            console.log(params.body);
            let response = null;
            try {
                response = await axios.post(params.url, params.body, {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
                return response;
            } catch (ex) {
                return response;
            }
        },
        async doGet(context, params) {
            console.log("wtf", params.url);
            let response = null;
            try {
                response = await axios.get(params.url, params.body, {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
                console.log('go', response)
                return 'response';
            } catch (ex) {
                return ex;
            }
        }
    },
    modules: {
        users: moduleUser,
    }
});
export default store;