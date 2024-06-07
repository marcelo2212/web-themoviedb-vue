<template>
  
  <div class="relative md:top-0 md:left-0 h-screen lg:block bg-gray-100 border-r z-30" id="main-nav">
    
    <div class="w-full h-20 flex px-4 items-center mb-4">
      <p class="font-semibold text-3xl text-black-400 pl-4">Filmes populares</p>
    </div>

    <!-- Order Section -->
    <div class="mb-4 px-4">
      <button @click="toggleAccordionOrder"
        class="w-full p-4 bg-white shadow-md hover:bg-gray-300 rounded-lg focus:outline-none">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold border-b">Ordenar</h3>
          <svg :class="{ 'transform rotate-180': accordionOpenOrder }" class="w-5 h-5 transition-transform duration-300"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>
      <div v-show="accordionOpenOrder"
        class="transition-all duration-300 ease-in-out overflow-hidden bg-white shadow-lg rounded-lg p-4 mt-2">
        <div class="filter">
          <h3 class="text-lg font-semibold mb-2 border-b">Ordenar Resultados Por</h3>
          <div class="relative">
            <select v-model="filters.sortBy" @change="updateFilters"
              class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
              <option value="popularity.desc">Popularidade Descendente</option>
              <option value="popularity.asc">Popularidade Ascendente</option>
              <option value="vote_average.desc">Classificação Descendente</option>
              <option value="vote_average.asc">Classificação Ascendente</option>
              <option value="primary_release_date.desc">Data de lançamento descendente</option>
              <option value="primary_release_date.asc">Data de lançamento ascendente</option>
              <option value="title.asc">Título (A-Z)</option>
              <option value="title.desc">Título (Z-A)</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END | Order Section -->

    <!-- Filter Selection -->
    <div class="mb-4 px-4">
      <button @click="toggleAccordionFilter"
        class="w-full p-4 bg-white shadow-md hover:bg-gray-300 rounded-lg focus:outline-none">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold border-b">Filtro</h3>
          <svg :class="{ 'transform rotate-180': accordionOpenFilter }"
            class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>
      <div v-show="accordionOpenFilter"
        class="transition-all duration-300 ease-in-out overflow-hidden bg-white shadow-lg rounded-lg p-4 mt-2">
        <div class="filter">

          <!-- Date -->
          <h4 class="text-md mb-2 border-b">Pesquisar por data de lançamento</h4>
          <div class="relative">
            <label for="fromDate" class="block text-sm font-medium text-gray-700 mt-2">De</label>
            <input id="fromDate" type="date" v-model="filters.release_date_init"
              class="block w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">

            <label for="toDate" class="block text-sm font-medium text-gray-700 mt-2">Até</label>
            <input id="toDate" type="date" v-model="filters.release_date_final"
              class="block w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <!-- END | Date -->

          <!-- Genders -->
          <h4 class="text-md mb-2 border-b mt-4">Gênero</h4>
          <div class="relative">
            <div v-if="genresLoaded" class="ruby">
              <div v-for="(genre, index) in genres" :key="index" class="mb-2">
                <span @click="toggleGenreSelection(genre.id)" 
                :class="{'bg-blue-500 text-white': isGenreSelected(genre.id), 'bg-gray-300': !isGenreSelected(genre.id)}"
                class="py-1 px-2 rounded-full text-mb badge">{{ genre.name }}</span>
              </div>
            </div>
            <div v-else-if="errorMessages.genres">
              <p class="text-red-500">{{ errorMessages.genres }}</p>
            </div>
            <div v-else>
              <p>Carregando gêneros...</p>
            </div>
          </div>
          <!-- END | Genders -->

          <!-- Certification -->
          <h4 class="text-md mb-2 border-b mt-4">Certificação Etária</h4>
          <div class="relative">
            <div v-if="classificationLoaded" class="ruby">
              <div v-for="(cert, index) in listCertification" :key="index" class="mb-2">
                <span 
                  @click="selectCertification(cert.certification)"
                  :class="{'bg-blue-500 text-white': filters.certification === cert.certification, 'bg-gray-300': filters.certification !== cert.certification}"
                  class="py-1 px-2 rounded-full text-mb badge">
                  {{ cert.certification}}
                </span>
              </div>
            </div>
            <div v-else-if="errorMessages.certification">
              <p class="text-red-500">{{ errorMessages.certification }}</p>
            </div>
            <div v-else>
              <p>Carregando Certificação Etária...</p>
            </div>
          </div>
          <!-- END | Certification -->

          <!-- Language -->
          <h4 class="text-md mb-2 border-b mt-4 flex">Idioma
            <div class="ml-2 relative flex items-center">
              <div @mouseover="showTooltip" @mouseleave="hideTooltip"
                class="w-6 h-6 bg-gray-300 text-center rounded-full cursor-pointer flex items-center justify-center">
                <span class="text-black">?</span>
              </div>
              <div v-show="tooltipVisible"
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-40 p-2 bg-black text-white text-xs rounded-md shadow-lg z-10">
                Selecione o idioma para filtrar os resultados.
              </div>
            </div>
          </h4>

          <div class="relative">
            <div v-if="LanguageLoaded">
              <select v-model="filters.language"
                class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value="all">Todos os Idiomas</option>
                <option v-for="language in languages" :key="language.iso_639_1" :value="language.iso_639_1">
                  {{ language.name }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </div>
            </div>
            <div v-else-if="errorMessages.language">
              <p class="text-red-500">{{ errorMessages.language }}</p>
            </div>
            <div v-else>
              <p>Carregando Idiomas...</p>
            </div>
          </div>
          <!-- END | Language -->

          <!-- Keyword -->
          <h4 class="text-md mb-2 border-b mt-4">Palavras-Chave</h4>
          <div class="relative mb-2">
              <Autocomplete
              v-model="selectedKeyword"
              :get-result-value="getResultValue"
              :search="searchKeywords"
              @select="onKeywordSelect"
                placeholder="Search for a keyword"
                class="block w-full bg-white border border-gray-300 px-4 py-2 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          <!-- END | Keyword -->

        </div>
        <button @click="updateFilters" class="mt-6 p-2 w-full bg-blue-500 text-white rounded-md">Pesquisar</button>
      </div>
    </div>
    <!-- END | Filter Selection -->


  </div>
</template>


<script>

import { eventBus } from '@/utils/eventBus.js'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
import axios from 'axios'


export default {
  name: 'AppSidebar',
  components: {
    Autocomplete,
  },
  data() {
    return {
      accordionOpenOrder: false,
      accordionOpenFilter: false,
      genres: [],
      genresLoaded: false,
      classificationLoaded: false,
      listCertification: [],
      LanguageLoaded: false,
      languages: [],
      selectedLanguage: 'all',
      tooltipVisible: false,
      selectedKeyword: '',
      keywordResults: [],
      selectedGenres: [],
      errorMessages: {
        genres: '',
        certification: '',
        language: '',
      },
      filters: {
        sortBy: 'popularity.desc',
        language: '',
        keywords: '',
        release_date_init: '',
        release_date_final: '',
        with_genres: '',
        certification: ''
      },
    };
  },
  mounted() {
    this.fetchGenres();
    this.fetchCertifications();
    this.fetchLanguages();
  },
  methods: {
    toggleAccordionOrder() {
      this.accordionOpenOrder = !this.accordionOpenOrder;
    },
    toggleAccordionFilter() {
      this.accordionOpenFilter = !this.accordionOpenFilter;
    },
    async fetchGenres() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/genre/movie/list?language=pt`, {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_API_TOKEN}`
          }
        });
        const data = await response.json();
        this.genres = data.genres;
        this.genresLoaded = true;
      } catch (error) {
        this.errorMessages.genres = 'Erro ao carregar gêneros. Por favor, tente novamente mais tarde.';
        console.error('Erro ao carregar gêneros:', error);
      }
    },
    async fetchCertifications() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/certification/movie/list`, {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_API_TOKEN}`
          }
        });
        const data = await response.json();
        this.listCertification = data.certifications.BR?.sort((a, b) => a.order - b.order);
        this.classificationLoaded = true;
      } catch (error) {
        this.errorMessages.certification = 'Erro ao buscar as classificações etárias. Por favor, tente novamente mais tarde.';
        console.error("Erro ao buscar as classificações etárias:", error);
      }
    },
    async fetchLanguages() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/configuration/languages`, {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_API_TOKEN}`
          }
        });
        const data = await response.json();
        this.languages = data.filter(language => language.name);
        this.LanguageLoaded = true;
      } catch (error) {
        this.errorMessages.language = 'Erro ao buscar os idiomas. Por favor, tente novamente mais tarde.';
        console.error("Erro ao buscar os idiomas:", error);
      }
    },
    showTooltip() {
      this.tooltipVisible = true;
    },
    hideTooltip() {
      this.tooltipVisible = false;
    },
    updateFilters() {
      eventBus.emit('filters-updated', this.filters);
    },
    getResultValue(result) {
      this.filters.keywords = result.id
      return result.name
    },
    async searchKeywords(input) {
      try {
        if (input.length < 3) {
          this.keywordResults = [];
          return [];
        }
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/search/keyword`, {
          params: {
            query: input
          },
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_API_TOKEN}`
          }
        });
        this.keywordResults = response.data.results;
        return this.keywordResults;
      } catch (error) {
        console.error('Erro ao buscar palavras-chave:', error);
        throw new Error('Erro ao buscar palavras-chave. Por favor, tente novamente mais tarde.');
      }
    },    
    updateResults(results) {
      this.keywordResults = results
    },
    onKeywordSelect(result) {
      this.selectedKeyword = result.name;
    },
    toggleGenreSelection(genreId) {
      const index = this.selectedGenres.indexOf(genreId);
      if (index > -1) {
        this.selectedGenres.splice(index, 1);
      } else {
        this.selectedGenres.push(genreId);
      }
      this.filters.with_genres = this.selectedGenres.join(',');
    },
    isGenreSelected(genreId) {
      return this.selectedGenres.includes(genreId);
    },
    selectCertification(certification) {
      if (this.filters.certification === certification) {
        this.filters.certification = '';
      } else {
        this.filters.certification = certification;
      }
    },

  },
  watch: {
    selectedKeyword(newKeyword) {
      this.filters.keywords = newKeyword;
    }
  },
};
</script>

<style>
  .badge {
    margin-right: 5px;
  }

  .ruby {
    display: ruby;
  }

  .text-red-500 {
    color: red;
  }

</style>
