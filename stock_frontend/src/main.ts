import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import './assets/main.css';

// PUBLIC_INTERFACE
/**
 * Entry point: sets up Vue app, applies Pinia and router, mounts to #app.
 */
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
