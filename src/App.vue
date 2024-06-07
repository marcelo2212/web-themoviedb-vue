<template>
  <div id="app">
    
    <div>
      <!-- Header -->
      <div class="bg-gray-800 text-white">
        <Header />
      </div>

      <!-- Content -->
      <div class="flex">
        <!-- Sidebar -->
        <div class="w-1/4 bg-gray-200">
          <AppSidebar @filter-changed="updateFilters" />
        </div>

        <div class="w-3/4">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';

export default {
  name: 'App',
  components: {
    Header,
    AppSidebar,
  },
  methods: {
    updateFilters(newFilters) {
      this.filters = newFilters;
    }
  }
};
</script>
