<template>
  <van-popup
    closeable
    close-icon-position="top-left"
    v-model="isShow"
    position="bottom"
    :style="{ height: '100%' }"
  >
    <div class="popupMain">
      <div class="my-channel">
        <!-- 我的频道标题 -->
        <van-cell title="我的频道">
          <van-button
            class="edit-button"
            size="small"
            round
            @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑' }}</van-button
          >
        </van-cell>
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="(item, index) in myChannels"
            :key="item.id"
            :text="item.name"
            :class="{ 'active-channel': item.name === '推荐' }"
            @click="onClicjMyChannel(item, index)"
          >
            <template #icon>
              <van-icon v-show="isEdit && item.name !== '推荐'" name="cross" />
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="recommend-channel">
        <!-- 推荐频道标题 -->
        <van-cell title="推荐频道"> </van-cell>
        <!-- 推荐频道 -->
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="item in recommendChannels"
            :key="item.id"
            :text="item.name"
            icon="plus"
            @click="addMyChannel(item)"
          ></van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels } from '@/api'
export default {
  data () {
    return {
      isShow: false,
      allChannels: [],
      isEdit: false
    }
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels () {
      const { data } = await getAllChannels()
      //   console.log(data);
      this.allChannels = data.data.channels
    },
    onClicjMyChannel (item, index) {
      if (this.isEdit && item.name !== '推荐') {
        return this.$emit('del-mychannel', item.id)
      }

      if (!this.isEdit) {
        this.isShow = false
        this.$emit('change-active', index)
      }
    },
    addMyChannel (myChannel) {
      this.$emit('add-mychannel', { ...myChannel })
    }
  },
  computed: {
    recommendChannels () {
      return this.allChannels.filter((item) => {
        return !this.myChannels.find((i) => {
          return i.id === item.id
        })

        // const result = this.myChannels.find((i) => {return i.id === item.id})
        // if(result){
        //     return false
        // }else{
        //     return true
        // }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.active-channel {
  :deep(.van-grid-item__text) {
    color: red;
  }
}
.popupMain {
  padding-top: 100px;
  .edit-button {
    color: red;
    padding: 0 30px;
    height: 48px;
    border: 0.02667rem solid red;
  }

  .my-channel {
    :deep(.van-grid-item__content) {
      position: relative;
      background-color: #eee;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;

        .van-icon-cross {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(20%, -35%);
          border: 1px solid #000;
          border-radius: 50%;
          text-align: center;
          //   height: 25px;
          //   line-height: 25px;
          font-size: 16px;
          padding: 3px;
        }
      }
    }
  }

  // 推荐频道的样式
  .recommend-channel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      flex-direction: row;
      background-color: #eee;

      .van-grid-item__icon {
        font-size: 0.5rem;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
}
</style>
