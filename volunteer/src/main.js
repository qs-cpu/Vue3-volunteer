import { createApp } from 'vue'
import App from './App.vue'
import { Button, List, Tag, Field, CellGroup, Uploader, Popup, Picker, DatePicker } from 'vant'
import 'vant/lib/index.css'
import router from './router'

const app = createApp(App)
app.use(Button)
  .use(List)
  .use(Tag)
  .use(Field)
  .use(CellGroup)
  .use(Uploader)
  .use(Popup)
  .use(Picker)
  .use(DatePicker)
  .use(router)

app.mount('#app')
