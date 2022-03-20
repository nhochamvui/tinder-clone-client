import { initFacebookSdk } from './_helpers';
import { createApp } from 'vue';
import App from './App.vue';
import router from './routers/index.js';
import store from './store/store.js';

function startApp(res) {
    const app = createApp(App)
        .use(router).use(store).mount('#app');
}
initFacebookSdk().then((res) => {
    startApp(res);
});