<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <div class="flex w-full flex-row relative">
        <input
          type="text"
          v-model="searchQuery"
          @input="getSearchResults"
          :placeholder="$t('home.search_by_city_name')"
          class="w-1/2 white py-2 px-2 bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#716f61]"
        />
        &nbsp;&nbsp;&nbsp;
        <div class="absolute right-0 pt-2 w-100 ">
          <VueToggle
            title="Edit mode"
            name="VueToggle"
            activeColor="#716f61"
            @toggle="editModeChangeHandler"
          />
        </div>
      </div>
      <ul
        v-if="mapboxSearchResults"
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
      >
        <p class="py-2 px-2" v-if="searchError">
          {{ $t("home.search_error") }}
        </p>
        <p class="py-2 px-2" v-if="!searchError && mapboxSearchResults.length === 0">
          {{ $t("home.no_results") }}
        </p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            :key="searchResult.id"
            class="py-2 px-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList :edit-mode="editMode" />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import CityList from "../components/CityList.vue";
import CityCardSkeleton from "../components/CityCardSkeleton.vue";
import VueToggle from "vue-toggle-component";

const { t, locale } = useI18n({ useScope: "global", globalInjection: true });
// watch(locale, (val) => {
//   setI18nLanguage(val);
// });
const editMode = ref(false);

//locale.value = "en-us";

//console.log("----------", t('notification.info_added', {city:"dupa"}));

const editModeChangeHandler = (value) => {
  console.log(value);

  editMode.value = value;
};

const router = useRouter();
const previewCity = (searchResult) => {
  const [city, state] = searchResult.place_name.split(",");
  router.push({
    name: "cityView",
    params: { state: state.replaceAll(" ", ""), city: city },
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true,
    },
  });
};

const mapboxAPIKey =
  "pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q";
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);
const searchError = ref(null);

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);

  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
        );
        mapboxSearchResults.value = result.data.features;
      } catch {
        searchError.value = true;
      }

      return;
    }
    mapboxSearchResults.value = null;
  }, 300);
};
</script>

<style scoped>
::-webkit-input-placeholder {
  color: #716f61;
}

::placeholder {
  color: #716f61;
}
</style>
