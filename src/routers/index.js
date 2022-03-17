import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import store from '../store/store.js' // your vuex store 
// const isNotAuthenticated = (to, from, next) => {
//     console.log('router');
//     store.dispatch('users/loadUser');
//     if(!store.getters['users/isAuthenticated']){
//         next();
//         return;
//     }
// };
const isAuthenticated = (to, from, next) => {
    if (store.getters['users/isAuthenticated']) {
        next();
        return;
    }
    next('/authenticate/login');
};
const redirectRoute = (to, from, next) => {
    console.log('redirecting')
    if (isAuthenticated) {
        next('/app/makefriends');
    } else {
        next('/authenticate/login');
    }
};
const routes = [{
        name: "App",
        path: "/app",
        alias: "/",
        component: () =>
            import ( /*webpackChunkName: "Loading"*/ "../components/Loading.vue"),
        children: []
    },
    {
        name: 'Authenticate',
        path: '/authenticate/:action?',
        component: Login,
        children: [{
            name: "SignupProfile",
            path: '/authenticate/signup/:action?',
            components: {
                replace: () =>
                    import ( /* webpackChungName: "SignupProfile" */ "../components/SignupProfile.vue")
            }
        }, ]
    },
    {
        name: 'Home',
        path: '/home',
        component: Home,
    },
    {
        name: 'MakeFriends',
        path: '/app/makefriends',
        components: {
            default: () =>
                import ( /* webpackChunkName: "MakeFriends" */ "../components/MakeFriends.vue"),
            side: () =>
                import ( /* webpackChunkName: "MakeFriends" */ "../components/Matches.vue"),
        },
        children: []
    },

    {
        name: 'Messages',
        path: '/app/messages/:matchID?',
        components: {
            default: () =>
                import ( /* webpackChunkName: "Messages" */ "../components/Messages.vue"),
            side: () =>
                import ( /* webpackChunkName: "Messages" */ "../components/MessageList.vue"),
        },
        children: [{
            name: 'MessageList',
            path: '/app/messages/:matchID?',
            components: {
                child: () =>
                    import ( /* webpackChunkName: "MessagesChild" */ "../components/MessageList.vue"),
            },
        }],
        props: true,
    },
    {
        name: 'Settings',
        path: '/app/settings',
        components: {
            default: () =>
                import ( /* webpackChunkName: "SettingMom" */ "../components/Profile.vue"),
        },
        children: [{
            name: 'SetGender',
            path: '/app/settings/gender',
            components: {
                child: () =>
                    import ( /* webpackChunkName: "SettingMom2" */ "../components/SetGender.vue"),
            },
            beforeEnter: (to, from) => {
                if (window.innerWidth >= 750) {
                    return {
                        name: "Profile",
                        replace: true,
                    }
                }
            },
        }, ],
        beforeEnter: (to, from) => {
            if (window.innerWidth >= 750) {
                return {
                    name: "Profile",
                    replace: true,
                }
            }
        },
    },
    {
        name: 'Profile',
        path: '/app/profile',
        components: {
            default: () =>
                import ( /* webpackChunkName: "MyProfile" */ "../components/MyProfile.vue"),
            side: () =>
                import ( /* webpackChunkName: "MyProfile" */ "../components/Profile.vue"),
        },
        children: [{
                name: 'ProfileEdit',
                path: '/app/profile/edit',
                components: {
                    default: () =>
                        import ( /* webpackChunkName: "ProfileEdit" */ "../components/ProfileEdit.vue"),
                },
                children: [{
                    name: 'ProfileEditGender',
                    path: '/app/profile/edit/gender',
                    components: {
                        modals: () =>
                            import ( /* webpackChunkName: "ProfileEdit" */ "../components/ModalForm.vue"),
                    }
                }, ]
            },

        ]
    },
    {
        name: 'SetGenderSide',
        path: '/app/settings/gender',
        components: {
            default: () =>
                import ( /* webpackChunkName: "MyProfile" */ "../components/MyProfile.vue"),
            side: (e) =>
                import ( /* webpackChunkName: "SetGender" */ "../components/SetGender.vue")
        }
    },
    {
        name: 'SetLocation',
        path: '/app/settings/location',
        components: {
            default: () =>
                import ( /* webpackChunkName: "MyProfile" */ "../components/MyProfile.vue"),
            side: (e) =>
                import ( /* webpackChunkName: "SetGender" */ "../components/SetLocation.vue")
        }
    },
    {
        name: 'Privacy',
        path: '/privacy',
        components: {
            default: () =>
                import ( /* webpackChunkName: "MyProfile" */ "../components/Privacy.vue"),
        }
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: () =>
            import ( /* webpackChunkName: "404" */ "../components/NotFound.vue"),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router