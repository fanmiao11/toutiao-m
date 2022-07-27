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
      <van-popup v-model="showavator" class="cutImg">
        <!-- 用组件进行图片裁剪 -->
        <UpdatePhoto
          v-if="showavator"
          :photo="photo"
          @updateAvator="updateAvator"
          @cancelAvator="cancalAvator"
        ></UpdatePhoto>
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
          @cancel="onCancel"
          :default-index="userInfo.gender"
          ref="picker"
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
import UpdatePhoto from './components/UpdatePhoto.vue'
export default {
  components: {
    UpdatePhoto
  },
  data () {
    return {
      userInfo: {}, // 用户资料
      showavator: false, // 头像弹出层
      shownickname: false, // 昵称弹出层
      showsex: false, // 性别弹出层
      showbir: false, // 生日弹出层
      photo: '', // 头像
      nickname: '', // 昵称
      columns: ['男', '女'], // 性别
      minDate: new Date(1990, 1, 1), // 生日范围
      maxDate: new Date(),
      currentDate: new Date() // 当前日期
    }
  },
  async created () {
    // 获取用户个人资料
    const res = await getUser()
    console.log(res)
    this.userInfo = res.data.data
    this.nickname = this.userInfo.name
    this.currentDate = new Date(this.userInfo.birthday)
  },
  mounted () {
    // 监听input的change事件  拿到用户选择的图片
    this.$refs.file.addEventListener('change', (e) => {
      // e.target 触发事件的元素
      const file = e.target.files[0]
      // file = URL.createObjectURL(file)
      // this.photo = file
      const fr = new FileReader()
      fr.readAsDataURL(file)
      // 读取完成后，result属性将返回一个 Data URL 格式（Base64编码）的字符串，代表文件内容
      fr.onload = (e) => {
        // load事件（读取操作完成）的监听函数，通常在这个函数里面使用result属性，拿到文件内容。
        // console.log(e.target.result);
        this.photo = e.target.result
        // 拿到图片base64编码格式 打开剪切头像的弹出层  photo作为弹出层显示图片的路径
        this.showavator = true
      }
      this.$refs.file.value = ''
    })
  },

  methods: {
    backPrePage () {
      this.$router.back()
    },
    // 修改头像
    updateAvator (photo) {
      // console.log(photo)
      this.showavator = false
      this.userInfo.photo = photo
    },
    // 取消修改头像
    cancalAvator () {
      this.showavator = false
    },
    async onConfirm (value, index) {
      // 选择性别
      try {
        if (this.userInfo.gender !== index) {
          await editUser({ gender: index })
          this.userInfo.gender = index
        }
        this.showsex = false
      } catch (e) {
        console.log(e.message)
      }
    },
    onCancel (value, index) {
      console.log(value, index)
      this.showsex = false
      // 取消选择的时候修改当前选中值
      this.$refs.picker.setColumnIndex(0, this.userInfo.gender)
    },
    async saveFn () {
      // 保存昵称
      try {
        if (this.nickname !== this.userInfo.name && this.nickname !== '') {
          await editUser({ name: this.nickname })
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
      try {
        const birthday = dayjs(value).format('YYYY-MM-DD')
        if (birthday !== this.userInfo.birthday) {
          await editUser({ birthday })
          this.userInfo.birthday = birthday
        }
        this.showbir = false
      } catch (e) {
        console.log(e.message)
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
.cutImg {
  height: 100%;
  width: 100%;
}
</style>
