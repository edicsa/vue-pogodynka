<template>
  <div v-if="weatherData" class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div
      v-if="route.query.preview"
      class="text-white p-4 bg-weather-secondary w-full text-center"
    >
      <p>
        {{ $t("city_view.note") }}
      </p>
    </div>
    <!-- Weather Overview -->
    <div
      class="flex flex-col items-center text-white py-12 bg-cover bg-center w-full"
      :style="{
        background: `url(${getWeatherImage()})` + ` no-repeat center  center/cover`,
      }"
    >
      <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData.currentTime).toLocaleDateString(localeLowerCase, {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString(localeLowerCase, {
            timeStyle: "short",
          })
        }}
      </p>
      <p class="text-8xl mb-8">{{ Math.round(weatherData.current.temp) }}&deg;</p>
      <p>
        {{ $t("city_view.feels_like") }}
        {{ Math.round(weatherData.current.feels_like) }} &deg;
      </p>
      <p class="capitalize">
        {{ weatherData.current.weather[0].description }}
      </p>
      <!-- <div>
                    <img
                      class="w-[150px] h-auto"
                      :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
                      alt=""
                    />
                  </div> -->
    </div>

    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Hourly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">{{ $t("city_view.hourly_weather") }}</h2>
        <div class="flex gap-10 overflow-x-scroll no-scrollbar">
          <div
            v-for="hourData in weatherData.hourly"
            :key="hourData.dt"
            class="flex flex-col gap-4 items-center"
          >
            <p class="whitespace-nowrap text-md">
              {{
                new Date(hourData.currentTime).toLocaleTimeString(localeLowerCase, {
                  hour: "numeric",
                })
              }}
            </p>
            <img
              class="w-auto h-[50px] object-cover"
              :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
              alt=""
            />
            <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Weekly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">{{ $t("city_view.7_day_forecast") }}</h2>
        <div v-for="(day, index) in weatherData.daily" :key="day.dt">
          <div
            @click="showHideHourlyWheather('hourlyWheatherID_' + index)"
            class="flex items-center"
          >
            <p class="flex-1">
              {{
                capitalize(
                  new Date(day.dt * 1000).toLocaleDateString(localeLowerCase, {
                    weekday: "long",
                  })
                )
              }}
            </p>
            <img
              class="w-[50px] h-[50px] object-cover"
              :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
              alt=""
            />
            <div class="flex gap-2 flex-1 justify-end">
              <p>Max.: {{ Math.round(day.temp.max) }}</p>
              <p>Min.: {{ Math.round(day.temp.min) }}</p>
            </div>
          </div>
          <div
            :id="'hourlyWheatherID_' + index"
            style="display: none"
            class="flex gap-10 overflow-x-scroll no-scrollbar"
          >
            <div
              v-for="hourData in weatherData.hourly"
              :key="hourData.dt"
              class="flex flex-col gap-4 items-center"
            >
              <p class="whitespace-nowrap text-md">
                {{
                  new Date(hourData.currentTime).toLocaleTimeString(localeLowerCase, {
                    hour: "numeric",
                  })
                }}
              </p>
              <img
                class="w-auto h-[50px] object-cover"
                :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
                alt=""
              />
              <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>{{ $t("city_view.remove_city") }}</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { gsap } from "gsap";
import { useI18n } from "vue-i18n";
import { useNotification } from "@kyvg/vue3-notification";
import { getData, getParsedData, setdata } from "./LocalStorage";

const { t, locale } = useI18n();
const { notify } = useNotification();

const localeLowerCase = locale.value.toLowerCase();
const route = useRoute();
const router = useRouter();

const getWeatherImage = () => {
  let __image = weatherData.current.weather[0].main;
  __image = "../images/" + __image.toLowerCase() + "_01.jpg";

  return __image;
};

const getWeatherData = async () => {
  let __error = null;
  const weatherData = await axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${
        route.query.lng
      }&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=metric&lang=${locale.value.substring(
        0,
        2
      )}`
    )
    .catch((error) => {
      console.log("error", error);

      __error = error;
    });

  if (!__error) {
    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.current.dt * 1000 + localOffset;
    weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone_offset;

    // cal hourly weather offset
    weatherData.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
    });

    // reduce to 24 hrs
    weatherData.data.hourly = weatherData.data.hourly.splice(0, 24);

    return weatherData.data;
  } else {
    return null;
  }
};

const weatherData = await getWeatherData();

if (weatherData == null) {
  router.push({
    name: "home",
  });

  notify({ type: "error", text: t("notification.error_400") });
}

const removeCity = () => {
  console.log("removecity", route.query.id);
  const cities = getParsedData("savedCities");
  const updatedCities = cities.filter((city) => city.id !== route.query.id);
  setdata("savedCities", updatedCities);

  router.push({
    name: "home",
  });

  notify({
    text: t("notification.info_removed", { city: route.params.city }),
  });
};

const showHourlyLastWheatherID = ref(null);

const showHideHourlyWheather = (id) => {
  const element = document.getElementById(id);
  //console.log(showHourlyLastWheatherID.value);

  if (showHourlyLastWheatherID.value && showHourlyLastWheatherID.value == id) {
    hideLastHourltWeather();

    showHourlyLastWheatherID.value = null;

    return;
  }

  if (showHourlyLastWheatherID.value) {
    hideLastHourltWeather();
  }

  element.style.display = element.style.display == "none" ? "flex" : "none";

  gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration: 0.5, delay: 0.1, ease: "power2.in" }
  );

  showHourlyLastWheatherID.value = id;
};

const hideLastHourltWeather = () => {
  const tmpLastShowHourlyWheatherID = document.getElementById(
    showHourlyLastWheatherID.value
  );

  gsap.fromTo(
    tmpLastShowHourlyWheatherID,
    { opacity: 1 },
    {
      opacity: 0,
      duration: 0.5,
      delay: 0,
      ease: "power2.out",
      onComplete: () => {
        tmpLastShowHourlyWheatherID.style.display = "none";
      },
    }
  );
};

const capitalize = (value) => {
  //console.log("capitalize", value);
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
};
</script>
