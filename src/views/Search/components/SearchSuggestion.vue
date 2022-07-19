<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      :title="item"
      icon="search"
    >
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api'
export default {
  data () {
    return {
      searchSuggestionList: []
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  watch: {
    // 监视属性绑定的函数，如果是methods里面的函数，支持字符串写法
    keywords: {
      immediate: true,
      handler () {
        this.getSearchSuggestion()
      }
    }
  },
  // created(){
  //     this.getSearchSuggestion()
  // },
  methods: {
    async getSearchSuggestion () {
      try {
        const res = await getSearchSuggestion(this.keywords)
        // console.log(res);
        console.log(res.data.data.options)
        this.searchSuggestionList = res.data.data.options.filter(Boolean)
        if (this.searchSuggestionList.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        // console.log(this.searchSuggestionList);
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed: {
    highlightData () {
      // 将搜索建议的每一项处理
      const reg = new RegExp(this.keywords, 'ig')
      return this.searchSuggestionList.map((str) => {
        return str.replace(
          reg,
          (match) => `<span style="color:red">${match}</span>`
        )
      })
    }
  }
}
</script>

<style></style>
