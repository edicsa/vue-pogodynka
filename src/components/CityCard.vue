<template>
  <div
    class="flex py-6 px-3 bg-weather-secondary rounded-md shadow-md cursor-pointer"
    @mouseover="onMouseover($event)"
    @mouseout="onMouseout($event)"
  >
    <div class="flex flex-col flex-1">
      <h2 class="text-3xl">{{ city.city }}</h2>
      <h3>{{ city.state }}</h3>
    </div>

    <div class="flex flex-row">
      <div class="flex flex-col gap-2">
        <p class="text-3xl self-end">{{ Math.round(city.weather.main.temp) }}&deg;</p>
        <div class="flex gap-2">
          <span class="text-xs"
            >Max: {{ Math.round(city.weather.main.temp_max) }}&deg;</span
          >
          <span class="text-xs"
            >Min: {{ Math.round(city.weather.main.temp_min) }}&deg;</span
          >
        </div>
      </div>
      <div v-if="isMouseOver && editMode" class="flex pl-8 pr-2">
        <i class="fa-solid fa-grip-lines place-self-center scale-150" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  city: {
    type: Object,
    default: () => {},
  },
  editMode: {
    type: Boolean,
    default: false,
  },
});

const isMouseOver = ref(false);

const onMouseover = (event) => {
  isMouseOver.value = true;
  // console.log(event.target);
  // event.preventDefault();
};
const onMouseout = (event) => {
  // console.log(event.target);
  isMouseOver.value = false;
};
</script>
