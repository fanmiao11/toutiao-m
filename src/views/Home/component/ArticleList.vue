<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功~" :error.sync="error">
      <!-- 每一篇文章结构 -->
      <van-list
        v-model="loading"
        @load="loadNext"
        offset="0"
        :finished="finished"
        finished-text="没有了~"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <!-- offset=0  距离底部多少是触发load事件 -->
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getAriticleList } from '@/api'
import ArticleItem from './ArticleItem.vue'
export default {
  components: {
    ArticleItem
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      articles: [],
      pre_timestamp: '',
      loading: false,
      finished: false,
      error: false,
      refreshing: false
    }
  },
  created () {
    this.getAriticleList()
  },
  methods: {
    async getAriticleList () {
      try {
        const {
          data: { data }
        } = await getAriticleList(this.id, +new Date())
        // console.log(new Date()); //Mon Jul 18 2022 09:24:33 GMT+0800 (中国标准时间)
        // console.log(+new Date()); //1658107473066
        // console.log(data)
        this.articles = data.results
        // 保存第一页
        this.pre_timestamp = data.pre_timestamp

        // console.log(this.pre_timestamp)
      } catch (e) {
        // 1、获取状态码
        const status = e.response.status
        if (status === 400) {
          // console.log('请求参数有问题')
          // message 提示 给程序员
          // 可以new Error(e.response.data.message)创建错误对象 throw抛出错误
          throw new Error(e.response.data.message)
        } else {
          this.$toast.fail('获取文章列表失败，请重新刷新')
        }
      }
    },
    // 加载下一页频道数据
    async loadNext () {
      try {
        if (Math.random() < 0.7) {
          throw new Error('出错了')
        }

        const { data } = await getAriticleList(this.id, this.pre_timestamp)
        console.log(data)

        if (this.refreshing) {
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        // console.log(data.data.pre_timestamp)
        // 更新页码
        this.pre_timestamp = data.data.pre_timestamp

        // loading 设置为false 重新变成可以加载的事件
        // this.loading = false

        if (!this.pre_timestamp) {
          this.finished = true
        }
      } catch (e) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshing = false
      }

      // 数组直接push数组会形成二维数组，所以要用展开运算符push拿到的每一项
    },
    // 下拉刷新
    onRefresh () {
      this.finished = false
      this.loading = true
      this.loadNext()
    }

  }
}
</script>

<style></style>
