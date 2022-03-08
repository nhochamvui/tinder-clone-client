import { User } from './User.js';

function onSubmitLoginForm() {
    var loginForm = document.forms["LoginForm"];
    if (loginForm["userName"].value == "" || loginForm["password"].value == "") {
        return false;
    } else {
        const XHR = new XMLHttpRequest();
        XHR.addEventListener('load', function(event) {
            const response = XHR.responseText;
            window.localStorage.setItem("jwtToken", response);
            var userInfo = GetUserInfo(response);
            var user = new User(userInfo);
            console.log("sent and response");
        });
        XHR.addEventListener('error', function(event) {
            console.log("error");
        });
        XHR.open('POST', 'https://localhost:5001/api/users/login');
        XHR.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        XHR.send(JSON.stringify({ "userName": loginForm["userName"].value, "password": loginForm["password"].value }))
    }
}

function GetUserInfo(token) {
    var jsonString = token.split('.')[1];
    return JSON.parse(atob(jsonString).split(','));
}