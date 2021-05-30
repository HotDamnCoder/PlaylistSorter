import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueGapi from "vue-gapi";

const app = createApp(App);

app.use(VueGapi, {
  clientId:
    "1044735142013-4bbuv3kuv7lmk5bietrlrcpnca9vtq5m.apps.googleusercontent.com",
  scope: "https://www.googleapis.com/auth/youtube",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  ],

});
app.use(router);
app.mount("#app");
