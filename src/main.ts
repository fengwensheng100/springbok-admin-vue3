import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./router/index";
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/dark/css-vars.css'
import '@/assets/global.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
//element-plus图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const pinia = createPinia()
pinia.use(piniaPluginPersist)
app.use(pinia)
app.mount('#app')
