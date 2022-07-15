import Vue from 'vue'
import Vuex from 'vuex'
// import storage from '@/utils/storage'
import { getToken, setToken } from '@/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // number:0
    // 声明token
    // user: JSON.parse(localStorage.getItem('HEIMA_TOUTIAO_TOKEN')) || {}
    // user: storage.get('HEIMA_TOUTIAO_TOKEN') || {}
    // 如果不加空对象null.token会报错 加空对象{}.token 返回undefined不报错
    user: getToken() || {}
  },

  // 修改数据的地方
  mutations: {
    // setNumber(state,payload){
    //   console.log('payload',payload);
    //   state.number++
    // },
    // 修改token
    setUser (state, payload) {
      state.user = payload
      // localStorage.setItem('HEIMA_TOUTIAO_TOKEN',JSON.stringify(payload))
      // storage.set('HEIMA_TOUTIAO_TOKEN',payload)
      setToken(payload)
    }

  }

})
