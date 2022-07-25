<template>
  <div class="edit">
    <van-nav-bar title="个人信息" left-arrow @click-left="backPrePage" fixed />
    <van-cell-group class="main">
      <!-- 用户头像 -->
      <van-cell is-link title="头像" @click="$refs.file.click()">
        <!-- accept限制上传文件类型 -->
        <input type="file" ref="file" hidden accept=".png,.jpg" />
        <van-image width="30" height="30" round :src="userInfo.photo" />
      </van-cell>
      <!-- 裁剪头像 -->
      <van-popup v-model="showavator" id="cutImg">
        <!-- 用组件进行图片裁剪 -->
        <UpdatePhoto :photo="photo" @updateAvator="updateAvator"></UpdatePhoto>

        <!-- <img :src="photo" alt="" ref="img" /> -->
      </van-popup>

      <!-- 更新用户昵称 -->
      <van-cell is-link title="昵称" @click="shownickname = true">
        {{ userInfo.name }}
      </van-cell>
      <van-popup
        position="bottom"
        v-model="shownickname"
        :style="{ height: '100%' }"
      >
        <van-nav-bar
          title="更新昵称"
          left-text="取消"
          right-text="保存"
          @click-left="shownickname = false"
          @click-right="saveFn"
        />

        <van-field
          v-model.trim="nickname"
          rows="5"
          autosize
          type="textarea"
          maxlength="7"
          :placeholder="userInfo.name"
          show-word-limit
        >
        </van-field>
      </van-popup>
      <!-- 用户性别 -->
      <van-cell is-link title="性别" @click="showsex = true">
        {{ { 0: '男', 1: '女' }[userInfo.gender] }}
      </van-cell>
      <van-popup v-model="showsex" position="bottom">
        <van-picker
          title="更新性别"
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="showsex = false"
        />
      </van-popup>
      <!-- 生日 -->
      <van-cell is-link title="生日" @click="showbir = true">
        {{ userInfo.birthday }}
      </van-cell>
      <van-popup v-model="showbir" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="checkbir"
          @cancel="showbir = false"
        />
      </van-popup>
    </van-cell-group>
  </div>
</template>

<script>
import { getUser, editUser } from '@/api'
import dayjs from '@/utils/dayjs'
// import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import UpdatePhoto from './components/UpdatePhoto.vue'
export default {
  components: {
    UpdatePhoto
  },
  data () {
    return {
      userInfo: {}, // 用户资料

      showavator: false,
      shownickname: false,
      showsex: false,
      showbir: false,

      // 头像
      photo: '',
      myCropper: '',

      //   昵称
      nickname: '',

      //   性别
      columns: ['男', '女'],

      //   生日
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17)
    }
  },
  async created () {
    // 获取用户个人资料
    const res = await getUser()
    console.log(res)
    this.userInfo = res.data.data
  },
  mounted () {
    // 监听input的change事件  拿到用户选择的图片
    this.$refs.file.addEventListener('change', (e) => {
      // e.target 触发事件的元素
      const file = e.target.files[0]
      // file = URL.createObjectURL(file)
      // this.photo = file

      // this.showavator = true

      // console.log(this.$refs)
      // console.log(this.$refs.img)

      const fr = new FileReader()
      fr.readAsDataURL(file)
      // 读取完成后，result属性将返回一个 Data URL 格式（Base64编码）的字符串，代表文件内容

      fr.onload = (e) => {
        // load事件（读取操作完成）的监听函数，通常在这个函数里面使用result属性，拿到文件内容。
        // console.log(e.target.result);
        this.showavator = true
        this.photo = e.target.result
        // 拿到图片base64编码格式 打开剪切头像的弹出层  photo作为弹出层显示图片的路径
        // console.log(this.$refs.img)
        // const img = document.getElementById('cutImg')
        // console.log(img);
        // this.myCropper = new Cropper(img, {})
      }
    })
  },
  methods: {
    backPrePage () {
      this.$router.back()
    },
    updateAvator (photo) {
      this.showavator = false
      console.log(photo)
      this.userInfo.photo = photo
    },

    async onConfirm (value, index) {
      // 选择性别
      try {
        if (this.userInfo.gender !== index) {
          const res = await editUser({ gender: index })
          console.log(res)
          this.userInfo.gender = index
        }
        this.showsex = false
      } catch (e) {
        console.log(e.message)
      }
    },
    async saveFn () {
      // 保存昵称
      try {
        if (this.nickname !== this.userInfo.name && this.nickname !== '') {
          const res = await editUser({ name: this.nickname })
          console.log(res)
          this.userInfo.name =
            this.nickname === '' ? this.userInfo.name : this.nickname
        }
        this.shownickname = false
      } catch (e) {
        console.log(e.message)
      }
    },
    async checkbir (value) {
      // 选择生日
      // console.log(dayjs(value).format('YYYY-MM-DD'));
      try {
        if (dayjs(value).format('YYYY-MM-DD') !== this.userInfo.birthday) {
          const res = await editUser({
            birthday: dayjs(value).format('YYYY-MM-DD')
          })
          console.log(res)
          this.userInfo.birthday = dayjs(value).format('YYYY-MM-DD')
          this.showbir = false
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.edit {
  background-color: #f5f7f9;
  height: calc(100vh - 100px);
}
/deep/.van-nav-bar {
  background-color: #3296fa;
  .van-icon,
  .van-nav-bar__title {
    color: #fff;
  }
}
.main {
  margin-top: 1.22667rem;
  /deep/ .van-nav-bar {
    background-color: #fff;
    .van-nav-bar__title {
      color: black;
    }
  }
}
</style>
