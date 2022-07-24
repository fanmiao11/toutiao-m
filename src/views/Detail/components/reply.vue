<template>
  <div>
    <!-- 本条评论 -->
    <van-cell
      :title="total_count === 0 ? '暂无回复' : total_count + '条回复'"
      style="text-align: center"
    />
    <van-cell>
      <template #icon>
        <img :src="comm.aut_photo" />
      </template>
      <template #title>
        <div class="aut_name">{{ comm.aut_name }}</div>
        <div class="comm_content">{{ comm.content }}</div>
        <div class="comm_bottom">
          <div class="comm_pubdate">{{ pubdate(comm.pubdate) }}</div>
          <div class="reply_btn">
            <van-button size="mini" round>
              回复 {{ comm.reply_count }}
            </van-button>
          </div>
        </div>
      </template>
      <template #right-icon v-if="comm.is_liking">
        <van-button class="good-btn" @click="likeComment(comm)">
          <van-icon name="good-job" />
          <span>
            {{ comm.like_count == 0 ? '赞' : comm.like_count }}
          </span>
        </van-button>
      </template>
      <template #right-icon v-else>
        <van-button class="good-btn" @click="likeComment(comm)">
          <van-icon name="good-job-o" />
          <span>
            {{ comm.like_count == 0 ? '赞' : comm.like_count }}
          </span>
        </van-button>
      </template>
    </van-cell>
    <!-- 本条评论下的回复 -->
    <van-cell-group>
      <van-cell title="全部回复" />
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="replyLoad"
      >
        <van-cell
          v-for="item in replyList"
          :key="item.com_id"
          :title="item.aut_name"
        >
          <template #icon>
            <img :src="item.aut_photo" />
          </template>
          <template #title>
            <div class="aut_name">{{ item.aut_name }}</div>
            <div class="comm_content">{{ item.content }}</div>
            <div class="comm_bottom">
              <div class="comm_pubdate">{{ pubdate(item.pubdate) }}</div>
              <div class="reply_btn">
                <van-button size="mini" round>
                  回复 {{ item.reply_count }}
                </van-button>
              </div>
            </div>
          </template>
          <template #right-icon v-if="item.is_liking">
            <van-button class="good-btn" @click="likeComment(item)">
              <van-icon name="good-job" />
              <span>
                {{ item.like_count == 0 ? '赞' : item.like_count }}
              </span>
            </van-button>
          </template>
          <template #right-icon v-else>
            <van-button class="good-btn" @click="likeComment(item)">
              <van-icon name="good-job-o" />
              <span>
                {{ item.like_count == 0 ? '赞' : item.like_count }}
              </span>
            </van-button>
          </template>
        </van-cell>
      </van-list>
    </van-cell-group>
    <!-- 评论按钮 -->
    <div class="reply-bottom">
      <van-button round size="small" @click="writeCommShow = true">
        评论
      </van-button>
      <van-popup position="bottom" v-model="writeCommShow">
        <!-- <writeComm></writeComm> -->
        <van-field
          v-model="commContent"
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
    </div>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import {
  getComment,
  postComment,
  likingsComment,
  nolikingsComment
} from '@/api'

import writeComm from './writeComm.vue'
export default {
  data () {
    return {
      loading: false,
      finished: false,
      replyList: [],
      offset: '',

      writeCommShow: false,
      commContent: ''
      //   isDisabled: true
    }
  },
  props: {
    comm: {
      type: Object
    },
    writeComm
  },
  created () {
    // console.log(this.replyList);
    // this.getComment()
  },
  methods: {
    // 获取评论回复
    async getComment () {
      try {
        const {
          data: { data }
        } = await getComment({
          type: 'c', // 评论类型 回复
          source: this.comm.com_id, // 文章id
          offset: this.offset,
          limit: 10
        })
        this.offset = data.last_id || ''
        console.log(data)
        // this.total_count = data.total_count
        this.replyList.push(...data.results.filter(() => Boolean))
        if (data.end_id === data.last_id) {
          this.finished = true
        }
      } catch (e) {
        console.log(e.message)
      } finally {
        this.loading = false
      }
    },
    // 发表回复
    async publishFn () {
      try {
        const res = await postComment({
          target: this.comm.com_id,
          content: this.commContent,
          art_id: this.$store.state.currentArticleId
        })
        console.log(res)
        this.commContent = ''
        this.writeCommShow = false
        this.replyList.unshift(res.data.data.new_obj)
        // location.reload(true)
      } catch (e) {
        console.log(e.message)
      }
    },
    replyLoad () {
      this.getComment()
    },
    pubdate (value) {
      return dayjs(value).fromNow()
    },

    async likeComment (item) {
      try {
        if (item.is_liking) {
          await nolikingsComment(item.com_id)
          // console.log(res);
          item.like_count--
        } else {
          await likingsComment(item.com_id)
          // console.log(res);
          item.like_count++
        }
        item.is_liking = !item.is_liking
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed: {
    // 评论发布按钮的禁用状态
    isDisabled () {
      if (this.commContent.length === 0) {
        return true
      } else {
        return false
      }
    },
    total_count () {
      return this.replyList.length
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell {
  img {
    width: 0.93333rem;
    height: 0.93333rem;
    margin-right: 0.22667rem;
    overflow: hidden;
    border-radius: 50%;
  }
  .aut_name {
    color: #406599;
    font-size: 0.34667rem;
  }
  .comm_content {
    font-size: 0.42667rem;
    color: #222;
    margin: 16px 0;
  }
  .comm_bottom {
    display: flex;
    margin-top: 0.10667rem;
    color: #969799;
    font-size: 0.32rem;
    line-height: 0.48rem;
    align-items: center;

    .comm_pubdate {
      font-size: 0.25333rem;
      color: #222;
      margin-right: 0.33333rem;
      line-height: 0.48rem;
    }
    .reply_btn {
      .van-button {
        width: 1.8rem;
        height: 0.64rem;
        line-height: 0.64rem;
        font-size: 0.28rem;
        color: #222;
      }
    }
  }
  .good-btn {
    border: unset;
  }
}
[class*='van-hairline']::after {
  border: unset;
}

.reply-bottom {
  width: 100%;
  height: 1.33333rem;
  position: fixed;
  bottom: 0;
  border-top: 0.01333rem solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff69b4;
  .van-button {
    width: 8.53333rem;
    height: 1.06667rem;
    .van-button__content {
      font-size: 0.37333rem;
    }
  }
  //   评论按钮
  /deep/ .van-popup {
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
}
</style>
