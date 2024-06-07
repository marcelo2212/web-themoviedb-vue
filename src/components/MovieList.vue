<template>
  <div>
    
    <div v-if="loading" class="text-center mt-4">Carregando...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="movie in movies" :key="movie.id" @click="viewDetails(movie.id)"
        class="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
          
        <img :src="movie && movie.backdrop_path  ? `https://image.tmdb.org/t/p/w220_and_h330_face/${movie.backdrop_path}` : `/noimage.jpg`" alt="Movie Image" 
          class="w-full h-48 object-cover" />

        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-800" v-if="movie.title">{{ movie.title }}</h2>
          <p class="text-gray-600" v-if="movie.release_date">{{ formatDate(movie.release_date) }}</p>
        </div>
      </div>
    </div>
    <button @click="loadMore" class="mt-6 p-2 w-full bg-blue-500 text-white rounded-md">Ver Mais</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MovieList',
  props: ['filters'],
  data() {
    return {
      movies: [],
      page: 1,
      loading: false
    };
  },
  watch: {
    filters: {
      handler() {
        this.page = 1;
        this.movies = [];
        this.fetchMovies();
      },
      deep: true
    }
  },
  created() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      this.loading = true;
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/discover/movie`, {
          params: {
            include_adult: false,
            include_video: false,
            language: 'pt-BR',
            page: this.page,
            sort_by: this.filters.sortBy,
            with_original_language: this.filters.language !== 'all' ? this.filters.language : undefined,
            with_keywords: this.filters.keywords,
            'release_date.gte': this.filters.release_date_init,
            'release_date.lte': this.filters.release_date_final,
            watch_region:'BR',
            certification: this.filters.certification,
            with_genres: this.filters.with_genres
          },
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_API_TOKEN}` 
          }
        });

        this.movies = [...this.movies, ...response.data.results];
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      } finally {
        this.loading = false;
      }
    },
    handleSortChanged(newSortBy) {
      this.sortBy = newSortBy;
      this.page = 1;
      this.movies = [];
      this.fetchMovies();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    },
    loadMore() {
      this.page += 1;
      this.fetchMovies();
    },
    viewDetails(id) {
      this.$router.push({ name: 'movieDetail', params: { id } });
    },
  },
};
</script>