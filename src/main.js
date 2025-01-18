import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import pl from "./locales/pl.json"
import en from "./locales/en.json"
import { createI18n } from "vue-i18n";
import Notifications from '@kyvg/vue3-notification'


const i18n = createI18n( {
    locale: navigator.language,
    fallbackLocale: "en",
    messages: { pl, en },
    legacy: false,
    globalInjection: true
} )

const app = createApp( App );
app.use( router );
app.use( i18n )
app.use(Notifications)
app.mount( "#app" );


