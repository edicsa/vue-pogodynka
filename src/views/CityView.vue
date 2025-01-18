<template>
  <div>
    <Suspense>
      <AsyncCityView />
      <template #fallback>
        <div class="p-4 bg-weather-secondary w-full text-center">
          <p class="text-white">Loading...</p>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import AsyncCityView from "../components/AsyncCityView.vue";
</script>
