import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueGapi from 'vue-gapi'
import store from './store'
import { CLIENT_ID, SCOPE, DISCOVERY_DOCS } from '@/assets/TS/google_api'

const app = createApp(App).use(store).use(router).use(VueGapi, {
  clientId: CLIENT_ID,
  scope: SCOPE,
  discoveryDocs: DISCOVERY_DOCS
})

app.mount('#app')
