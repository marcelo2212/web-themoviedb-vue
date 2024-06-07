<template>
  <div class="leading-normal tracking-normal" id="main-body">
    <div class="flex flex-wrap">
      <div class="w-full min-h-screen max-h-[80vh] overflow-y-auto custom-scrollbar" id="main-content">
        <div class="p-6 mb-20">
          <MovieList :filters="filters"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { eventBus } from '@/utils/eventBus.js';
import MovieList from '@/components/MovieList.vue';

export default {
  components: {
    MovieList,
  },
  data() {
    return {
      filters: {
        sortBy: 'popularity.desc',
        language: '',
        keywords: '',
        release_date_init:'',
        release_date_final:'',
        with_genres: '',
        certification: ''
      }
    };
  },
  methods: {
    handleFiltersUpdate(newFilters) {
      this.filters = newFilters;
    }
  },
  mounted() {
    eventBus.on('filters-updated', this.handleFiltersUpdate);
  },
  beforeUnmount() {
    eventBus.off('filters-updated', this.handleFiltersUpdate);
  }
};
</script>
