const facebookAppId = process.env.VUE_APP_FACEBOOK_APP_ID;
import axios from 'axios';
const doFbAuth = async function(fbToken) {
    try {
        let response = await axios.post(process.env.VUE_APP_HOST_URL + '/api/users/fbauth', fbToken);
        switch (response.status) {
            case 200:
                console.log('response:', response)
                return response.data;
        }
    } catch (ex) {
        console.log('authorize with Facebook failed: ', ex);
        return null;
    }
}
export function initFacebookSdk() {
    return new Promise(resolve => {
        // wait for facebook sdk to initialize before starting the vue app
        window.fbAsyncInit = function() {
            FB.init({
                appId: facebookAppId,
                cookie: true,
                xfbml: true,
                version: 'v13.0'
            });

            FB.getLoginStatus(async({ authResponse }) => {
                console.log('cookie', authResponse);
                if (authResponse && authResponse.accessToken) {
                    let res = await doFbAuth({ accessToken: authResponse.accessToken })
                    if (res !== null && res !== "") {
                        if (res.accessToken) {
                            resolve(res.accessToken);
                        }
                    } else {
                        FB.api("/me/permissions", "delete", null, () => FB.logout());
                    }
                }
                resolve();
            });
        };

        // load facebook sdk script
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
}