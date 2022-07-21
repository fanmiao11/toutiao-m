<template>
  <div>
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoadNextPape"
    >
      <van-cell v-for="(item, index) in searchResultList" :key="index">
        <template #title>
          <span v-html="item.title"></span>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api'
export default {
  data () {
    return {
      searchResultList: [],
      page: 1,
      loading: false,
      error: false,
      finished: false
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },

  created () {
    this.getSearchResult()
  },
  methods: {
    async getSearchResult () {
      try {
        const {
          data: { data }
        } = await getSearchResult({
          q: this.keywords,
          page: this.page
        })
        console.log(data)
        this.searchResultList = data.results
        // this.searchSuggestionList = res.data.data.options.filter(Boolean)
        if (this.searchResultList.length === 0) {
          this.$toast.fail('没有搜索结果')
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    // 加载下一页搜索结果
    async onLoadNextPape () {
      try {
        // 页数+1
        this.page++
        // console.log(this.page);
        // 请求下一页数据
        const {
          data: { data }
        } = await getSearchResult({
          q: this.keywords,
          page: this.page
        })
        // 如果下一页数据为空 加载完毕
        if (data.results.length === 0) {
          this.finished = true
        }
        // 把请求到的新一页的数据解构出来追加到searchResultList
        this.searchResultList.push(...data.results)
      } catch (e) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
