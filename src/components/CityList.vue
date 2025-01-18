<template>
  <!-- <div @drop="onDrop($event, 1)" @dragenter.prevent @dragover.prevent>
        <div class="py-2" v-for="city in savedCities" :key="city.id">
          <CityCard
            :city="city"
            @click="goToCityView(city)"
            draggable="true"
            @dragstart="dragStart($event, city)"
          />
        </div>
      </div> -->

  <draggable
    v-model="savedCities"
    item-key="element.id"
    auto-scroll="true"
    :disabled="!props.editMode"
    @end="endHandler($event, savedCities)"
  >
    <template #item="{ element }">
      <div class="py-2">
        <CityCard :city="element" :editMode="editMode" @click="goToCityView(element)" />
      </div>
    </template>
  </draggable>

  <p v-if="savedCities.length === 0">
    {{ $t("city_list.no_items_note") }}
  </p>
</template>

<script setup>
import axios from "axios";
import { ref, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
import CityCard from "./CityCard.vue";
import draggable from "vuedraggable";
import { setdata } from "./LocalStorage";

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false,
  },
});

// onMounted = (event) =>
// {
//   //console.log("editMode:", editMode.value);
// }
// const dragStart = (event, item) => {
//   console.log(item.id);

//   event.dataTransfer.dropEffect = "move";
//   event.dataTransfer.effectAllowed = "move";
//   event.dataTransfer.setData("itemID", item.id);
// };

// const onDrop = (event, list) => {
//   console.log(event, savedCities);

//   const itemID = event.dataTransfer.getData("itemID");
//   const item = savedCities.value.find((item) => item.id == itemID);
//   item.list = list;

//   console.log(item, savedCities);
// };

function endHandler(event) {
  // console.log(event); // { id: 1, name: 'Item 1' }
  // console.log("--- ", savedCities.value);

  if (event.oldIndex != event.newIndex) {
    setdata("savedCities", savedCities.value);
  }

  // console.log("---2 ", savedCities.value);
}

// const onDropHandler = (event) => {
//   console.log("event------ ", event.moved, savedCities.value);

//   setdata("savedCities", savedCities.value);
// };

const savedCities = ref([]);

const getCities = async () => {
  if (localStorage.getItem("savedCities")) {
    savedCities.value = JSON.parse(localStorage.getItem("savedCities"));

    const requests = [];
    savedCities.value.forEach((city) => {
      // console.log(city);

      try {
        requests.push(
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=metric&lang=pl`
          )
        );
      } catch (error) {}
    });

    const weatherData = await Promise.all(requests);

    await new Promise((res) => setTimeout(res, 1000));

    weatherData.forEach((value, index) => {
      savedCities.value[index].weather = value.data;
    });
  }
};
await getCities();

const router = useRouter();
const goToCityView = (city) => {
  console.log("goToCityView");

  router.push({
    name: "cityView",
    params: { state: city.state, city: city.city },
    query: {
      id: city.id,
      lat: city.coords.lat,
      lng: city.coords.lng,
    },
  });
};
</script>
