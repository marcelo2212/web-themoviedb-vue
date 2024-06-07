<template>
  <div v-if="movie" class="p-4">
    <div class="flex md:flex-nowrap">
      
      <img :src="`https://image.tmdb.org/t/p/w220_and_h330_face/${movie.backdrop_path}`" alt="Movie Image"
      class="w-64 h-fit-content mb-4 md:mb-0"  />

      <div class="ml-4 flex-grow">
        <h1 class="text-2xl font-bold mb-2" v-if="movie.title">{{ movie.title }}</h1>
        <p class="text-gray-600 mb-2">{{ formatDate(movie.release_date) }}</p>
        <div class="flex items-center mb-2" v-if="movie.vote_average && movie.vote_count">
          
            <v-progress-circular
              :model-value="movie.vote_average * 10"
              :size="100"
              :width="15"
              color="lime" class="mr-2">
              {{ movie.vote_average * 10 }}%
            </v-progress-circular>

          <span> {{ movie.vote_count }} votos</span>
        </div>

        <h2 class="text-xl font-semibold mt-4" v-if="movie.overview">Sinopse</h2>
        <p class="text-gray-700 mb-4" v-if="movie.overview">{{ movie.overview }}</p>
        
        <h2 class="text-xl font-semibold mt-4">Gêneros</h2>
        <div class="flex flex-wrap mb-4" v-if="movie.genres">
          <span v-for="genre in movie.genres" :key="genre.id"
            class="bg-blue-500 text-white py-1 px-2 rounded-full text-sm mr-2 mb-2">
            {{ genre.name }}
          </span>
        </div>
        <h2 class="text-xl font-semibold mt-4">Orçamento</h2>
        <p class="text-gray-700 mb-4">{{ formatCurrency(movie.budget) }}</p>
        <h2 class="text-xl font-semibold mt-4">Bilheteria</h2>
        <p class="text-gray-700 mb-4">{{ formatCurrency(movie.revenue) }}</p>
        <button @click="goBack" class="w-full mt-4 p-4 bg-blue-500 text-white rounded-lg">Voltar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  components: {
    
  },
  data() {
    return {
      movie: null,
    };
  },
  created() {
    this.fetchMovie();
  },
  methods: {
    async fetchMovie() {
      this.loading = true;
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/movie/${this.$route.params.id}`, {
          params: {
            language: 'pt-BR'
          },
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_API_TOKEN}`
          }
        });
        this.movie = response.data;
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.push({ name: 'home' });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }
  },
};
</script>

<style>
  .h-fit-content {
    height: fit-content;
  }
</style>