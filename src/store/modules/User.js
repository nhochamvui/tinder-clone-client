import axios from 'axios';
import { Buffer } from 'buffer';
const moduleUser = {
    namespaced: true,
    state: () => ({
        user: undefined,
        tokenName: 'TinderClone/token',
        token: '',
        isLoadingUser: false,
    }),
    mutations: {
        SET_TOKEN(state, payload) {
            state.token = payload;
        },
        ADD_NEW_USER(state, payload) {
            state.user = {...payload.userInfo, token: payload.token };
        },
        unLoadUser(state) {
            state.token = '';
        },
        SET_PROFILE_IMAGES(state, profileImages) {
            state.user.profileImages = profileImages;
            console.log('profile images is set!!!!!!');
        },
        ADD_PROFILE_IMAGE(state, params) {
            console.log('add: ', params.profileImage, ' , index: ', params.index);
            state.user.profileImages[params.index] = params.profileImage;
        },
        SET_GENDER(state, gender) {
            state.user.gender = gender;
        }
    },
    getters: {
        isLoadingUser(state) {
            return state.isLoadingUser;
        },
        isAuthenticated: (state) => {
            let isAuthenticated = false;
            if (state.token !== '') {
                const tokenContent = JSON.parse(Buffer.from((state.token.split('.')[1]), 'base64').toString('utf8').split(','));
                if (tokenContent.exp >= Date.now() / 1000) {
                    isAuthenticated = true;
                }
            }
            return isAuthenticated;
        },
        getUserToken: (state) => {
            if (state.token !== undefined && state.token !== '') {
                return state.token;
            }
            return undefined;
        },
        getToken: (state) => {
            return state.token;
        },
        getMe: (state) => {
            return state.user;
        }
    },
    actions: {
        setToken(context, payload) {
            context.commit('SET_TOKEN', payload);
        },
        addNewUser(context, payload) {
            context.commit('ADD_NEW_USER', payload);
        },
        async loadUser({ commit, dispatch, state }) {
            state.isLoadingUser = true;

            let token = state.token;
            if (token !== null && token !== '') {
                const tokenContent = JSON.parse(Buffer.from((token.split('.')[1]), 'base64').toString('utf8').split(','));
                if (tokenContent.exp >= (Date.now() / 1000)) {
                    try {
                        let response = await axios.get(process.env.VUE_APP_HOST_URL + '/api/profile/', {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            },
                        });
                        switch (response.status) {
                            case 200:
                                {
                                    let userInfo = response.data;
                                    commit('ADD_NEW_USER', { userInfo, token });
                                    console.log('loaded user: ', state.user);
                                    state.isLoadingUser = false;
                                    return 200;
                                }
                            case 404:
                                {
                                    console.log('Notfound: ', response);
                                    break;
                                }
                        }
                    } catch (err) {
                        console.log('loaduser error:', err);
                        if (err.response) {
                            console.log('user profile not found');
                            return 404;
                        }
                        return null;
                    }
                } else {
                    dispatch('unLoadUser');
                }
            }

            state.isLoadingUser = false;
            return false;
        },
        unLoadUser({ commit, state }) {
            console.log('unload user');
            commit('unLoadUser');
        },
        async setProfileImages(context) {
            try {
                let response = await axios.get(process.env.VUE_APP_HOST_URL + '/api/profile/profileImages/', {
                    headers: {
                        'Authorization': 'Bearer ' + context.getters.getUserToken,
                    },
                });
                let profileImages = response.data;
                context.commit('SET_PROFILE_IMAGES', profileImages);
            } catch (err) {
                console.log('error while fetching profile images: ', err);
            }
        },
        async setGender(context, genderCode) {
            try {
                let response = await axios.patch(process.env.VUE_APP_HOST_URL + '/api/users/setgender/', {
                    "gender": genderCode,
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + context.getters.getUserToken,
                    },
                });
                switch (response.status) {
                    case 200:
                        {
                            let gender = response.data.gender;
                            context.commit('SET_GENDER', gender);
                            break;
                        }
                    case 400:
                        {
                            console.log('Bad request: ', response);
                            break;
                        }
                }
            } catch (err) {
                console.log('error while set gender: ', err);
            }
        },
        async likePerson(context, personID) {
            try {
                let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/matches/likes/', {
                    "Id": personID,
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + context.getters.getUserToken,
                    },
                });
                return response.data;
            } catch (err) {
                console.log('error while fetching profile images: ', err);
                return false;
            }
        },
        async dislikePerson(context, personID) {
            try {
                let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/matches/dislike/', {
                    "Id": personID,
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + context.getters.getUserToken,
                    },
                });
                return response.data;
            } catch (err) {
                console.log('error while fetching profile images: ', err);
                return false;
            }
        },
        async uploadPhoto(context, request) {
            try {
                let bodyFormData = new FormData();
                bodyFormData.append("photo", request.photo);
                bodyFormData.append("index", request.index);
                let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/users/uploadphoto/', bodyFormData, {
                    headers: {
                        'Authorization': 'Bearer ' + context.getters.getUserToken,
                    },
                });
                switch (response.status) {
                    case 201:
                        {
                            let imageURL = response.headers.location;
                            let index = response.data.index;
                            context.commit('ADD_PROFILE_IMAGE', {
                                profileImage: imageURL,
                                index: index,
                            });
                            break;
                        }
                }
            } catch (err) {
                console.log('error while fetching profile images: ', err);
            }
        },
        async uploadIMGBB(context, request) {
            try {
                let bodyFormData = new FormData();
                bodyFormData.append("photo", request.photo);
                bodyFormData.append("index", request.index);
                let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/users/uploadimgbb/', bodyFormData, {
                    headers: {
                        'Authorization': 'Bearer ' + context.getters.getUserToken,
                    },
                });
                switch (response.status) {
                    case 201:
                        {
                            let imageURL = response.headers.location;
                            let index = response.data.index;
                            context.commit('ADD_PROFILE_IMAGE', {
                                profileImage: imageURL,
                                index: index,
                            });
                            break;
                        }
                }
            } catch (err) {
                console.log('error while fetching profile images: ', err);
            }
        },
        async removeProfileImage(context, imageIndex) {
            try {
                let response = await axios.patch(process.env.VUE_APP_HOST_URL + '/api/profile/profileImages', JSON.stringify(imageIndex), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                        'content-type': 'application/json',
                    },
                });
                switch (response.status) {
                    case 200:
                        return true;
                    case 404:
                        return false;
                    case 500:
                        if (response.data.messages) {
                            console.log(response.data.messages)
                        }
                        return false;
                }
            } catch (ex) {
                console.log(ex)
                return false;
            }
        },
        async updateInfo(context, info) {
            try {
                let response = await axios.patch(process.env.VUE_APP_HOST_URL + '/api/profile/', info, {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
                switch (response.status) {
                    case 200:
                        return true;
                    case 404:
                        return false;
                    case 500:
                        if (response.data.messages) {
                            console.log(response.data.messages)
                        }
                        return false;
                }
            } catch (ex) {
                console.log(ex)
                return false;
            }
        },
        async signup(context, info) {
            try {
                let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/profile/signup', info, {
                    headers: {
                        'Authorization': 'Bearer ' + this.getters['users/getUserToken'],
                    },
                });
                switch (response.status) {
                    case 201:
                        return true;
                    case 400:
                        return false;
                }
            } catch (ex) {
                console.log(ex)
                return false;
            }
        }
    },

}
export default moduleUser;