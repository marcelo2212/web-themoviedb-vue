import { createApp } from 'vue';
import App from './App.vue';
import './assets/tailwind.css';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import MovieDetailView from './views/MovieDetailView.vue';
import { Autocomplete } from '@trevoreyre/autocomplete-vue';
import '@trevoreyre/autocomplete-vue/dist/style.css';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/movie/:id', name: 'movieDetail', component: MovieDetailView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const vuetify = createVuetify({
  components,
  directives,
})


createApp(App).use(Autocomplete).use(vuetify).use(router).mount('#app');
