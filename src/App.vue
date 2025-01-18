<template>
  <div class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
    <SiteNavigation style="z-index: 10000" />
    <RouterView class="flex-1" v-slot="{ Component }">
      <Transition name="page">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <div class="w-full text-white p-10 bg-weather-primary" style="text-align: center">
        @Wojciech Komorowski  &nbsp;&nbsp;|&nbsp;&nbsp; 
      <a style="text-decoration: underline;" href="edi@toastermedia.net">edi@toastermedia.net</a>
    </div>
    <notifications
      position="bottom center justify-self-center"
      classes="vue-notification"
    />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import SiteNavigation from "./components/SiteNavigation.vue";
</script>

<style scoped>
.vue-notification {
  margin: 0 7px 7px;
  padding: 15px;
  font-size: 17px;
  color: #ffffff;

  background: rgb(14, 128, 195);
  border-left: 5px solid rgb(14, 128, 195);
  border-radius: 5px;
  border: 20px, solid, #ffffff;
}

.page-enter-active {
  transition: 600ms ease all;
}

.page-enter-from {
  opacity: 0;
}
</style>
