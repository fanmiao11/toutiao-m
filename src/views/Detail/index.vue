<template>
  <div>
    <van-nav-bar title="黑马头条" left-arrow @click-left="backPrePage" fixed />
    <div class="article-detail">
      <h1 class="article-title">{{ articleDetail.title }}</h1>
      <div class="user-info">
        <!-- 作者信息 -->
        <van-cell>
          <template #icon>
            <img :src="articleDetail.aut_photo" />
          </template>
          <template #title>
            <div class="user-name">
              {{ articleDetail.aut_name }}
            </div>
            <div class="publish-date">
              {{ articleDetail.pubdate }}
            </div>
          </template>
          <!-- 使用 right-icon 插槽来自定义右侧图标 -->
          <template #right-icon>
            <van-button
              round
              class="follow"
              v-if="!isFollowed"
              type="info"
              @click="isFollow"
            >
              <template #icon>
                <van-icon name="plus"></van-icon>
              </template>
              关注
            </van-button>
            <van-button round class="notfollow" v-else @click="isFollow">
              已关注
            </van-button>
          </template>
        </van-cell>
      </div>
      <!-- 文章内容 -->
      <div
        id="article-content"
        class="article-content markdown-body"
        v-html="articleDetail.content"
      ></div>
      <!-- 正文结束 -->
      <van-divider>正文结束</van-divider>
      <!-- 评论 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="commOnLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <commItem
          v-for="item in commList"
          :key="item.com_id"
          :comm="item"
        ></commItem>
      </van-list>

      <!-- 底部栏 -->
      <div class="article-bottom">
        <van-button round size="mini" @click="show = true">写评论</van-button>

        <van-popup v-model="show" position="bottom">
          <van-field
            v-model="comm"
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入留言"
            show-word-limit
            @keyup.enter="publishFn"
          />
          <div class="publish">
            <van-button :disabled="isDisabled" @click="publishFn"
              >发布</van-button
            >
          </div>
        </van-popup>
        <van-icon name="comment-o" :badge="articleDetail.comm_count" />
        <div @click="clickStar">
          <van-icon name="star" color="#f5de19" v-if="isCollected" />
          <van-icon name="star-o" v-else />
        </div>
        <div @click="clickGood">
          <van-icon name="good-job" v-if="attitude === 1" color="#f5de19" />
          <van-icon name="good-job-o" v-else />
        </div>
        <van-icon name="share" @click="showShare = true" />
        <van-share-sheet
          class="show-share"
          v-model="showShare"
          title="立即分享给好友"
          :options="options"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticleDetail,
  getComment,
  followUser,
  delfollowUser,
  likings,
  nolikings,
  collections,
  delcollections,
  postComment
} from '@/api'
import dayjs from '@/utils/dayjs'
import commItem from './components/commItem.vue'
import { ImagePreview } from 'vant'
// import 'markdown-it/dist/markdown-it.js'

export default {
  components: {
    commItem
  },
  data () {
    return {
      currentArticleId: this.$store.state.currentArticleId, // 当前文章的id
      articleDetail: {}, // 文章详情

      loading: false, // 触发评论加载事件
      finished: false, // 数据是否加载结束
      error: false, // 加载评论失败

      commList: [], // 对文章的评论列表

      show: false, // 写评论的弹出框是否弹出
      comm: '', // 写评论中的评论内容

      offset: '', // 当前页评论的last_id
      end_id: '', // 所有评论数据的最后一个id

      isFollowed: false, // 是否关注了该作者
      isCollected: false, // 是否收藏了该文章
      attitude: -1, // 用户对文章的态度 -1无态度 0不喜欢 1点赞
      aut_id: '', // 文章作者id

      imgList: [],

      showShare: false, // 分享面板展示状态
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          {
            name: '二维码',
            icon: 'qrcode'
          },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ] // 分享选项
    }
  },

  computed: {
    // 评论发布按钮的禁用状态
    isDisabled () {
      if (this.comm.length === 0) {
        return true
      } else {
        return false
      }
    }
  },

  async created () {
    await this.getArticleDetail()
  },
  methods: {
    backPrePage () {
      this.$router.back()
    },
    // 获取文章详情
    async getArticleDetail () {
      try {
        // 请求文章详情的数据
        const {
          data: { data }
        } = await getArticleDetail(this.currentArticleId)
        // console.log(data)
        this.articleDetail = data
        // 处理显示文章发布时间
        this.articleDetail.pubdate = dayjs(this.articleDetail.pubdate).fromNow()
        // 是否关注了该作者
        this.isFollowed = this.articleDetail.is_followed
        // 是否收藏了该文章
        this.isCollected = this.articleDetail.is_collected
        // 用户对文章的态度
        this.attitude = this.articleDetail.attitude
        // 作者id
        this.aut_id = this.articleDetail.aut_id
        // 文章预览图片
        this.$nextTick(() => {
          this.imgList = document
            .getElementById('article-content')
            .querySelectorAll('img')
          const imgSrc = []
          this.imgList.forEach((item, index) => {
            imgSrc.push(item.src)
            item.onclick = () => {
              ImagePreview({
                images: imgSrc,
                startPosition: index,
                closeable: true
              })
            }
          })
        })
      } catch (error) {
        console.log(error.message)
      }
    },
    // 关注作者
    async isFollow () {
      // if(!isFollowed)  +关注
      // if(isFollowed)  取消关注
      try {
        if (!this.isFollowed) {
          await followUser(this.aut_id)
          this.$toast.success('关注成功')
        } else {
          await delfollowUser(this.aut_id)
          this.$toast('已取关')
        }
        this.isFollowed = !this.isFollowed
      } catch (e) {
        console.log(e.message)
        this.$toast.fail('操作失败')
      }
    },
    // 加载评论
    async commOnLoad () {
      try {
        const res = await getComment({
          type: 'a', // 评论类型 文章
          source: this.currentArticleId, // 文章id
          offset: this.offset,
          limit: 10
        })
        console.log(res)
        if (res.data.data.end_id === res.data.data.last_id) {
          this.finished = true
        }
        // 更新offset
        this.offset = res.data.data.last_id || ''
        this.commList.push(...res.data.data.results.filter(() => Boolean))

        if (!res.data.data.last_id) {
          this.finished = true
        }
      } catch (e) {
        console.log(e.message)
        this.error = true
      } finally {
        // 加载状态改为false
        this.loading = false
      }
    },
    // 发布评论
    async publishFn () {
      try {
        const res = await postComment({
          target: this.currentArticleId,
          content: this.comm
        })
        console.log(res)
        this.comm = ''
        this.show = false
        // this.getArticleDetail()
        // this.commOnLoad()
        // location.reload(true)
        this.commList.unshift(res.data.data.new_obj)
      } catch (e) {
        console.log(e.message)
      }
    },
    // 收藏文章
    async clickStar () {
      try {
        if (!this.isCollected) {
          await collections(this.currentArticleId)
          this.$toast.success('文章收藏成功')
        } else {
          await delcollections(this.currentArticleId)
          this.$toast('已取消收藏文章')
        }
        this.isCollected = !this.isCollected
      } catch (e) {
        console.log(e)
        this.$toast.fail('操作失败')
      }
    },
    // 给文章点赞
    async clickGood () {
      try {
        if (this.attitude !== 1) {
          await likings(this.currentArticleId)
          this.attitude = 1
        } else {
          await nolikings(this.currentArticleId)
          this.attitude = -1
        }
      } catch (e) {
        console.log(e.message)
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  background-color: #3296fa;
  .van-icon,
  .van-nav-bar__title {
    color: #fff;
  }
}
// 文章详情
.article-detail {
  margin-top: 98px;
  margin-bottom: 94px;
  // 文章标题
  .article-title {
    font-size: 0.53333rem;
    padding: 0.66667rem 0.42667rem;
    margin: 0;
    color: #3a3a3a;
  }
  .user-info {
    // 图片
    img {
      width: 0.93333rem;
      height: 0.93333rem;
      margin-right: 0.22667rem;
      overflow: hidden;
      border-radius: 50%;
    }
    .van-cell__title {
      // 作者名
      .user-name {
        font-size: 0.32rem;
        color: #3a3a3a;
      }
      // 发布时间
      .publish-date {
        font-size: 0.30667rem;
        color: #b7b7b7;
      }
    }

    // 关注按钮
    .van-button {
      width: 2.26667rem;
      height: 0.77333rem;
    }
    .van-button .follow {
      color: white;
      background: rgb(50, 150, 250);
      border-color: rgb(50, 150, 250);
    }
  }
  // 文章内容
  .article-content {
    padding: 0.73333rem 0.42667rem;
  }

  // 底部栏
  .article-bottom {
    height: 94px;
    width: 100%;
    position: fixed;
    bottom: 0;
    border-top: 0.01333rem solid #d8d8d8;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;

    // 按钮  3.76re
    .van-button {
      width: 3.76rem;
      font-size: 0.4rem;

      .van-button__content {
        color: #a7a7a7;
      }
    }
    /deep/.show-share {
      flex-direction: column;
      padding: unset !important;
    }

    /deep/.van-popup {
      padding: 0.42667rem 0 0.42667rem 0.42667rem;
      display: flex;
      align-items: center;
      .van-cell {
        padding: unset;
      }
      .van-field__value {
        background-color: #f5f7f9;
        padding: 0.26667rem 0.42667rem;
      }
      // 发布按钮
      .publish {
        height: 100%;
        width: 2rem;
        .van-button {
          border: 0;
          width: 2rem;
          height: 100%;
          border: 0;
          padding: 0;

          .van-button__content {
            color: #6ba3d8;
            font-size: 0.37333rem;
            position: absolute;
            left: 30px;
            top: -10px;
          }
        }
      }
    }
    .van-icon {
      font-size: 0.53333rem;
      color: rgb(119, 119, 119);
    }
  }
}
</style>
