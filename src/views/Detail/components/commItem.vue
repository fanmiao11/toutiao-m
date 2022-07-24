<template>
  <div>
    <!-- 评论 -->
    <van-cell>
      <template #icon>
        <img :src="comm.aut_photo" />
      </template>
      <template #title>
        <div class="aut_name">{{ comm.aut_name }}</div>
        <div class="comm_content">{{ comm.content }}</div>
        <div class="comm_bottom">
          <div class="comm_pubdate">{{ pubdate }}</div>
          <div class="reply_btn">
            <van-button size="mini" round @click="showReplay">
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
    <!-- 回复 -->
    <van-popup
      v-model="isShowReplay"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
    >
      <reply :comm="comm"></reply>
    </van-popup>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import reply from './reply.vue'
import { likingsComment, nolikingsComment } from '@/api'
export default {
  data () {
    return {
      isShowReplay: false
    }
  },
  components: {
    reply
  },
  props: {
    comm: {
      type: Object
    }
  },
  methods: {
    showReplay () {
      this.isShowReplay = true
    },
    // 评论点赞

    async likeComment (item) {
      try {
        if (this.comm.is_liking) {
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
    pubdate () {
      return dayjs(this.comm.pubdate).fromNow()
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
</style>
