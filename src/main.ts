import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueGapi from "vue-gapi";
import { CLIENT_ID, SCOPE, DISCOVERY_DOCS } from "@/assets/TS/google_api"

const app = createApp(App);

app.use(VueGapi, {
  clientId: CLIENT_ID,
  scope: SCOPE,
  discoveryDocs: DISCOVERY_DOCS
});

app.use(router);
app.mount("#app");
