import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueGapi from "vue-gapi";
import store from "./store";
import {
  YOUTUBE_CLIENT_ID,
  YOUTUBE_SCOPE,
  YOUTUBE_DISCOVERY_DOCS,
} from "@/assets/TS/credentials";

const app = createApp(App).use(store).use(router).use(VueGapi, {
  clientId: YOUTUBE_CLIENT_ID,
  scope: YOUTUBE_SCOPE,
  discoveryDocs: YOUTUBE_DISCOVERY_DOCS,
});

app.mount("#app");
