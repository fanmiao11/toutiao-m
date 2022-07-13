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

    <van-form @submit="login" class="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '请填写手机号' }]"
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
        :rules="[{ required: true, message: '请填写验证码', trigger:'onChange'}]"
      >
        <template #left-icon>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <template #right-icon>
          <van-button class="code-btn" block round size="mini" >发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>

    <!-- 登录按钮 -->
  </div>
</template>

<script>

import { login } from '@/api/user.js'

export default {
  data () {
    return {
      mobile: '',
      code: ''
    }
  },

  methods: {
    backToPrePage () {
      this.$router.back()
    },
    async login () {
      // console.log('submit', values)
      const res = await login(this.mobile, this.code)
      console.log(res)
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
.form{
  :deep(.van-field__left-icon){
    flex:1
  }
  :deep(.van-cell__value){
    flex:18
  }
  .toutiao{
    font-size: 37px
  }
  .code-btn{
    background-color: #eee;
    color: #666;
    padding: 0 10px;
  }
}
</style>
