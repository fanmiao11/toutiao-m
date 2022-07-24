<template>
  <div>
    <!-- 11111 -->
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
        <van-button :disabled="isDisabled" @click="publishFn">发布</van-button>
      </div>
  </div>
</template>
<script>
import { postComment } from '@/api'
export default {
  data () {
    return {
      comm: '',
      isDisabled: false
    }
  },
  methods: {
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
        location.reload(true)
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}
</script>

<style lang="less" scoped>

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
</style>
