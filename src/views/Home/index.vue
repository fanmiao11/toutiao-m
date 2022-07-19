<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button round>
          <van-icon name="search" />
          搜索
        </van-button>
      </template>
    </van-nav-bar>
    <!-- tabs 选项卡 -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in myChannels" :key="item.id" :title="item.name">
        <ArticleList :id="item.id"></ArticleList>
      </van-tab>

      <!-- 更多的按钮 -->
      <span @click="showPopup" class="toutiao toutiao-gengduo"></span>
    </van-tabs>

    <!-- 弹框 -->
    <EditChannelPopupVue
      ref="popup"
      :myChannels="myChannels"
      @del-mychannel="delMychannel"
      @change-active="changeActive"
      @add-mychannel="addMyChannel"
    ></EditChannelPopupVue>
  </div>
</template>

<script>
import {
  getMyChannels,
  getMyChannelsByLocal,
  setMyChannelsToLocal,
  delMyChannel,
  addMyChannel
} from '@/api'
import ArticleList from './component/ArticleList.vue'
import EditChannelPopupVue from './component/EditChannelPopup.vue'

export default {
  data () {
    return {
      active: 0,
      myChannels: getMyChannelsByLocal() || []
      // isShow: true
    }
  },
  components: {
    ArticleList,
    EditChannelPopupVue
  },
  computed: {
    // 标识是否登录
    isLogin () {
      // !!转为布尔值
      return !!this.$store.state.user.token
    }
  },
  methods: {
    async getMyChannels () {
      try {
        if (!this.isLogin) {
          // 如果是离线状态 且本地存储有数据 从本地取
          const myChannels = getMyChannelsByLocal()
          if (myChannels) {
            this.myChannels = myChannels
          } else {
            const { data } = await getMyChannels()
            this.myChannels = data.data.channels
          }
        } else {
          // 如果是登录状态 从服务器取数据
          const { data } = await getMyChannels()
          this.myChannels = data.data.channels
        }
        // console.log(this.myChannels);
      } catch (e) {
        this.$toast.fail('请重新获取频道列表')
      }
    },
    showPopup () {
      // console.log(111);
      // this.isShow=true;
      this.$refs.popup.isShow = true
    },
    async delMychannel (id) {
      this.myChannels = this.myChannels.filter((item) => item.id !== id)
      // 如果是离线状态 数据存在本地
      if (!this.isLogin) {
        setMyChannelsToLocal(this.myChannels)
      } else {
        try {
          await delMyChannel(id)
        } catch (e) {
          this.$toast.fail('删除用户频道失败')
        }
      }
      this.$toast.success('删除用户数据成功')
    },
    changeActive (index) {
      this.active = index
    },
    async addMyChannel (channel) {
      this.myChannels.push(channel)
      // 如果是离线状态 数据存在本地
      if (!this.isLogin) {
        setMyChannelsToLocal(this.myChannels)
      } else {
        // 登录状态 发送接口 添加频道
        try {
          await addMyChannel(channel.id, this.myChannels.length)
          console.log(this.myChannels.length)
        } catch (e) {
          return this.$toast.fail('添加频道失败')
        }
      }
      this.$toast.success('添加频道成功')
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}

//tabs选项卡
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  z-index: 111;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('@/assets/gradient-gray-line.png');
  }
}

// 头部固定
// 头部固定的样式
.navbar {
  position: sticky;
  top: 0;
  left: 0;
}
:deep(.van-tabs__wrap) {
  position: sticky;
  top: 92px;
  left: 0;
  z-index: 99;
}
.toutiao-gengduo {
  position: fixed;
  top: 92px;
}

:deep(.van-tabs__content) {
  max-height: calc(100vh - 92px - 82px - 100px);
  overflow: auto;
}
</style>
