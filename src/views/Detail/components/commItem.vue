<template>
  <div>
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
            <van-button size="mini" round
              >回复 {{ comm.reply_count }}</van-button
            >
          </div>
        </div>
      </template>
      <template #right-icon>
        <van-button class="good-btn">
          <van-icon name="good-job-o" />
          <span>
            {{ comm.like_count==0 ? '赞' : comm.like_count }}
          </span>
        </van-button>
      </template>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  props: {
    comm: {
      type: Object
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
  .good-btn{
    border: unset;
  }

}
</style>
