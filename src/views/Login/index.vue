<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar
      class="navbar"
      title="登录"
      left-arrow
      @click-left="backToPrePage"
    >
      <template #left> <van-icon name="cross" /> </template>
    </van-nav-bar>
    <!-- 手机号、验证码表单 -->

    <van-form @submit="login" class="form" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #left-icon>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        type="text"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #left-icon>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <template #right-icon>
          <!-- 验证码倒计时 -->
          <van-count-down
            v-if="isShowCountDown"
            :time="10 * 1000"
            @finish="isShowCountDown = false"
            format="ss"
          />
          <van-button
            v-else
            class="code-btn"
            block
            round
            size="mini"
            @click="sendCodeFn"
            >发送验证码</van-button
          >
        </template>
      </van-field>
    <!-- 登录按钮 -->
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <!-- <div>
      {{ $store.state.number }}
      <button @click="increment">点击+1</button>
    </div> -->

  </div>
</template>

<script>
import { login, sendCode } from '@/api/user.js'
import { mobileRules, codeRules } from '@/views/Login/rules.js'

export default {
  data () {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCountDown: false
    }
  },

  methods: {
    // increment(){
    //   this.$store.commit('setNumber', payload)
    // },
    backToPrePage () {
      this.$router.back()
    },
    async sendCodeFn () {
      try {
        await this.$refs.form.validate('mobile')
        // 发送请求，获取验证码
        await sendCode(this.mobile)
        // 显示倒计时
        this.isShowCountDown = true
      } catch (e) {
        // this.$toast.fail('手机号错误！')
        // 1、表单校验失败
        if (!e.response) {
          this.$toast.fail('手机号格式不正确')
        } else {
          // 2、请求失败
          // 404
          // 429
          const status = e.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(e.response.data.message)
          }
        }
      }
    },
    async login () {
      // loading
      this.$toast.loading({
        message: '加载中...',
        // loading时，点击页面没有反应
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        console.log(res)
        // 存储token
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功')

        this.$router.push('/profile')
      } catch (error) {
        // console.log(e);
        // this.$toast.fail('登录失败')
        // 拿到状态码
        const status = error.response.status
        let message = '登录错误，请刷新~'
        if (status === 400) message = error.response.data.message
        this.$toast.fail(message)
        // switch (status) {
        //   case 400:
        //     // 400提示
        //     this.$toast.fail(error.response.data.message)
        //     break
        //   case 507:
        //     // 服务端错误
        //     this.$toast.fail('登录错误，请刷新~')
        //     break
        //   default:
        //     this.$toast.fail('登录错误，请刷新~')
        //     break

        // }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon-cross {
    color: #fff;
  }
}
.form {
  :deep(.van-field__left-icon) {
    flex: 1;
  }
  :deep(.van-cell__value) {
    flex: 18;
  }
  .toutiao {
    font-size: 37px;
  }
  .code-btn {
    background-color: #eee;
    color: #666;
    padding: 0 10px;
  }
}
</style>
