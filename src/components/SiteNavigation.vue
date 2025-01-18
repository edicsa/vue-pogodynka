<template>
  <header class="sticky top-0 bg-weather-primary shadow-lg">
    <nav class="container flex flex-row items-center gap-4 text-white py-6">
      <RouterLink :to="{ name: 'home' }">
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-sun text-2xl"></i>
          <p class="text-2xl">Pogodynka</p>
        </div>
      </RouterLink>
      <div class="flex gap-3 flex-1 justify-end" style="align-items: center">
        <!-- <i
          class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"
          @click="toggleModal"
        ></i> -->

        <!-- <p class="text-l">&nbsp;|&nbsp;</p> -->
        <div
          class="text-l flex hover:text-weather-secondary duration-150 cursor-pointer align-bottom"
          style="justify-content: center; align-items: center"
          @click="changeLanguage"
        >
          <p v-if="locale.indexOf('pl') != -1">En</p>
          <p v-else>Pl</p>
        </div>
        <i
          class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"
          @click="addCity"
          v-if="route.query && !isSaved"
        ></i>
      </div>

      <BaseModal :modalActive="modalActive" @close-modal="toggleModal">
        <div class="text-black">
          <h1 class="text-2xl mb-1">About:</h1>
          <p class="mb-4">
            The Local Weather allows you to track the current and future weather of cities
            of your choosing.
          </p>
          <h2 class="text-2xl">How it works:</h2>
          <ol class="list-decimal list-inside mb-4">
            <li>Search for your city by entering the name into the search bar.</li>
            <li>
              Select a city within the results, this will take you to the current weather
              for your selection.
            </li>
            <li>
              Track the city by clicking on the "+" icon in the top right. This will save
              the city to view at a later time on the home page.
            </li>
          </ol>

          <h2 class="text-2xl">Removing a city</h2>
          <p>
            If you no longer wish to track a city, simply select the city within the home
            page. At the bottom of the page, there will be am option to delete the city.
          </p>
        </div>
      </BaseModal>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { uid } from "uid";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { onMounted, onUpdated } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import BaseModal from "./BaseModal.vue";
import { getData, getParsedData, setdata } from "./LocalStorage";
import CityList from "./CityList.vue";

const savedCities = ref([]);
const isSaved = ref(true);
const route = useRoute();
const router = useRouter();
const { notify } = useNotification();
const { t, locale } = useI18n();

// console.log("----", $te);
//console.log("----------", t("notification.info_added", { city: "dupa" }));
console.log("CityList.props:", CityList.$props);

const changeLanguage = () => {
  locale.value = locale.value.indexOf("pl") != -1 ? "en-us" : "pl-pl";

  setdata("locale", locale.value);
};

const addCity = () => {
  savedCities.value = getSavedCities();

  //console.log("savedCities: ", savedCities);

  const locationObj = {
    id: uid(),
    state: route.params.state,
    city: route.params.city,
    coords: {
      lat: route.query.lat,
      lng: route.query.lng,
    },
  };

  //console.log(locationObj);

  savedCities.value.push(locationObj);
  //savedCities.value =[]
  setdata("savedCities", savedCities.value);

  let query = Object.assign({}, route.query);
  delete query.preview;
  query.id = locationObj.id;
  router.replace({ query });

  isSaved.value = true;

  notify({
    text: t("notification.info_added", { city: route.params.city }),
  });
};

// const isSaved = ref(false);
function checkIfCityIsSaved() {
  savedCities.value = getSavedCities();

  // savedCities.value = []
  // localStorage.setItem("savedCities", JSON.stringify(savedCities.value));

  console.log("savedCities isSaved: ", savedCities, route, route.query, route.query.lng);
  //console.log(route.query.lat, route.query.lng);
  // console.log("locationObj:", locationObj);
  let __isSaved = false;

  if (route.query.lng == undefined) {
    __isSaved = true;
  }

  savedCities.value.forEach((city) => {
    // console.log(city.coords, route.query.lat, route.query.lng);

    if (city.coords.lat == route.query.lat && city.coords.lng == route.query.lng) {
      __isSaved = true;
    }
  });

  isSaved.value = __isSaved;
}

const getSavedCities = () => {
  if (getData("savedCities")) {
    return getParsedData("savedCities");
  }

  return [];
};

const getLocale = () => {
  console.log("localStorage", getData("locale"), getParsedData("locale"));

  if (getData("locale")) {
    return getParsedData("locale");
  }

  return locale.value;
};

const modalActive = ref(null);
const toggleModal = () => {
  modalActive.value = !modalActive.value;
};

onUpdated(async () => {
  await router.isReady();
  checkIfCityIsSaved();
});

onMounted(async () => {
  await router.isReady();

  //savedCities.value = [];
  //localStorage.setItem("savedCities", JSON.stringify(savedCities.value));

  checkIfCityIsSaved();
  locale.value = getLocale();
});
</script>
