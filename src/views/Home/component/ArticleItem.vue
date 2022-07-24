<template>
  <div>
    <!-- 无图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 0"
      :title="articleInfo.title"
      :label="articleDesc"
      @click="toArticleDetail(articleInfo.art_id)"
    />
    <!-- 一张图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 1"
      :title="articleInfo.title"
      :label="articleDesc"
      @click="toArticleDetail(articleInfo.art_id)"
    >
      <!-- 默认插槽 -->
      <van-image
        width="3rem"
        height="2rem"
        :src="articleInfo.cover.images[0]"
      />
    </van-cell>
    <!-- 三张图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 3"
      :title="articleInfo.title"
      @click="toArticleDetail(articleInfo.art_id)"
    >
      <template #label>
        <!-- 图片 -->
        <div>
          <van-image
            v-for="(item, index) in articleInfo.cover.images"
            :key="index"
            width="2.8rem"
            height="2rem"
            :src="item"
            style="margin-right: 0.2rem"
          />
        </div>
        <!-- 文章描述 -->
        <span> {{ articleDesc }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  props: {
    articleInfo: {
      // type: [String, Number],
      required: true
    }
  },
  computed: {
    articleDesc () {
      const time = dayjs(this.articleInfo.pubdate).fromNow()
      return `${this.articleInfo.aut_name} ${this.articleInfo.comm_count}评论 ${time}`
    }
  },
  methods: {
    // 点击跳转到新闻详情
    toArticleDetail (id) {
      // console.log(111)
      this.$router.push({
        path: `/detail/${id}`
      })
      this.$store.commit('setCurrentArticleId', id)
    }
  }
}
</script>

<style></style>
