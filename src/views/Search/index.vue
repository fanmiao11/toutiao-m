<template>
  <div>
    <!-- 头部搜索框 -->
    <form action="/">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @focus="visibleSearchSuggestion"
        @cancel="backToPrePage"
      />
    </form>
    <!-- 搜索结果/历史/建议 -->
    <!-- <SearchHistory></SearchHistory>
    <SearchResult></SearchResult>
    <SearchSuggestion></SearchSuggestion> -->
    <component :is="componentName" :keywords="keywords"></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
export default {
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  data () {
    return {
      keywords: '',
      isShowResult: false
    }
  },
  computed: {
    componentName () {
      // 动态渲染组件
      if (this.keywords.trim() === '') {
        // 搜索框关键词为空字符串时，显示搜索历史
        return 'SearchHistory'
      }
      if (this.isShowResult) {
        return 'SearchResult'
      }
      return 'SearchSuggestion'
    }

  },
  methods: {
    onSearch () {
      // console.log('正在搜索')
      this.isShowResult = true
    },
    backToPrePage () {
      this.$router.go(-1)
    },
    visibleSearchSuggestion () {
      // console.log(222);
      this.isShowResult = false
    }
  }
}
</script>

<style></style>
