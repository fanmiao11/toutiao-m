<template>
  <div class="my">
    <!-- 头部 -->
    <header>
      <!-- 登录的盒子 -->
      <div class="user-info banner" v-if="isLogin">
        <!-- 占位 -->
        <van-row></van-row>
        <!-- 展示用户信息 -->
        <van-row class="row-2">
          <van-col span="12">
            <van-row type="flex" align="center" justify="space-around">
              <van-image
                round
                width="1.76rem"
                height="1.76rem"
                :src="userInfo.photo"
              />
              <!-- 手机号 -->
              <span class="mobile">{{ userInfo.name }}</span>
            </van-row>
          </van-col>
          <van-col span="11">
            <van-row
              style="height: 100%"
              type="flex"
              align="center"
              justify="end"
            >
              <van-button class="edit-btn"> 编辑资料 </van-button>
            </van-row>
          </van-col>
        </van-row>
        <!-- 用户数据 -->
        <van-row>
          <van-grid class="grid" :border="false">
            <van-grid-item text="头条">
              <!-- 使用插槽 -->
              <template #icon>{{ userInfo.art_count }}</template>
            </van-grid-item>
            <van-grid-item text="粉丝">
              <!-- 使用插槽 -->
              <template #icon>{{ userInfo.fans_count }}</template>
            </van-grid-item>
            <van-grid-item text="关注">
              <!-- 使用插槽 -->
              <template #icon>{{ userInfo.follow_count }}</template>
            </van-grid-item>
            <van-grid-item text="获赞">
              <!-- 使用插槽 -->
              <template #icon>{{ userInfo.like_count }}</template>
            </van-grid-item>
          </van-grid>
        </van-row>
      </div>
      <!-- 未登录 -->
      <div class="login-register banner" v-else>
        <div class="wrap" @click="loginFn">
          <img src="../../assets/mobile.png" />
          <span>登录 / 注册</span>
        </div>
      </div>
    </header>
    <!-- 主体 -->
    <main>
      <!-- 历史 搜索 -->
      <div>
        <van-grid column-num="2" class="grid" clickable>
          <van-grid-item text="收藏">
            <template #icon>
              <span class="toutiao toutiao-shoucang"></span>
            </template>
          </van-grid-item>
          <van-grid-item text="历史">
            <template #icon>
              <span class="toutiao toutiao-lishi"></span>
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 消息通知/小智同学 -->
      <div class="link">
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </div>
    </main>
    <!-- 底部退出按钮 -->
    <van-button v-if="isLogin" block class="login-btn" @click="logout"
      >退出按钮</van-button
    >
  </div>
</template>

<script>
import { getUserInfo } from '@/api'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.getUserInfo()
  },
  computed: {
    // 标识是否登录
    isLogin () {
      // !!转为布尔值
      return !!this.$store.state.user.token
    }
  },
  methods: {
    logout () {
      this.$dialog
        .confirm({
          title: '黑马头条',
          message: '是否确认退出该账号'
        })
        .then(() => {
          // on confirm
          // console.log('1');
          this.$store.commit('setUser', {})
        })
        .catch(() => {
          // console.log(2);
          // on cancel
        })
    },
    loginFn () {
      this.$router.push('/login')
    },
    async getUserInfo () {
      if (this.isLogin) {
        // const res = await getUserInfo()
        // console.log(res)

        try {
          const {
            data: { data }
          } = await getUserInfo()
          this.userInfo = data
          console.log(data)
        } catch (e) {
          this.$toast.fail('请重新登录~')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.my {
  background-color: #f5f7f9;
  height: calc(100vh - 100px);
}
// banner背景图
.banner {
  width: 100%;
  height: 400px;
  background: url('../../assets/banner.png') no-repeat 0 0 / cover;
}
.user-info {
  display: flex;
  flex-direction: column;
  > .van-row {
    flex: 1;
  }
  .row-2 {
    .van-col {
      height: 100%;
    }
  }
  .mobile {
    font-size: 0.4rem;
    color: #fff;
  }
  .edit-btn {
    width: 1.53333rem;
    height: 0.42667rem;
    background: #fff;
    border-radius: 0.21333rem;
    font-size: 0.26667rem;
    color: #666;
    padding: 0;
  }
  // .code-row {
  //   height: 100%;
  // }

  .grid {
    :deep(.van-grid-item__content) {
      background-color: unset;
    }
  }
  .van-grid-item {
    :deep(.van-grid-item__icon-wrapper) {
      font-size: 0.34667rem;
      margin-bottom: 0.10667rem;
    }

    color: #fff;
    :deep(.van-grid-item__text) {
      color: #fff;
    }
  }
}

// 主体区域
main {
  .grid {
    color: #646566;
    // 字体图标
    .toutiao {
      font-size: 0.6rem;

      &.toutiao-lishi {
        color: #ffb31d;
      }
      &.toutiao-shoucang {
        color: #ed5253;
      }
    }
  }
  .link {
    margin: 10px 0;
  }
}

.login-btn {
  :deep(.van-button__text) {
    color: red;
  }
}

.login-register {
  display: flex;
  justify-content: center;
  align-items: center;
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    img {
      margin-bottom: 10px;
    }
  }
}
</style>
