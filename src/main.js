import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载动态设置 REM 基准值
import 'amfe-flexible'

// 加载全局样式
import '@/styles/index.less'

// 引入字体图标
import '@/assets/fonts/iconfont.css'

// 引入markdown样式
import '@/css/news.css'

// 加载Vant核心组件
import Vant from 'vant'
// 加载Vant全局样式
import 'vant/lib/index.css'
// 注册使用Vant组件库
Vue.use(Vant)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
