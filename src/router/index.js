import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CityView from "../views/CityView.vue";
import PageNotFound from "../views/PageNotFound.vue";

const router = createRouter( {
  history: createWebHistory( import.meta.env.BASE_URL ),
  routes: [
    {
      path: "/vue/weather",
      name: "home",
      component: HomeView,
      meta: {
        title: "Home"
      }
    },
    {
      path: "/vue/weather/:state/:city",
      name: "cityView",
      component: CityView,
      meta: {
        title: "City",
      },
    },
    {
      path: "/vue/weather/:catchAll(.*)",
      name: "PageNotFound",
      component: PageNotFound,
      meta: {
        title: "Page not found",
      },
    },
  ],
} );

router.beforeEach( ( to, from, next ) =>
{
  document.title = `${ to.params.state
    ? `${ to.params.city }, ${ to.params.state }`
    : to.meta.title
    } | Pogodynka`;
  next();
} );

export default router;
