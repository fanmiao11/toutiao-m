<template>
  <div class="photo">
    <img :src="photo" alt="" ref="img" />
    <button class="cancelBtn" @click="cancel">取消</button>
    <button class="saveBtn" @click="confirm">完成</button>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { updatePhoto } from '@/api'

export default {
  props: ['photo'],
  data () {
    return {
      url: ''
    }
  },
  mounted () {
    const img = this.$refs.img
    this.myCropper = new Cropper(img, { viewMode: 1, aspectRatio: 1 / 1 })
  },
  methods: {
    /*
      multipart/form-data
    */
    confirm () {
      const fm = new FormData()
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        fm.append('photo', blob)
        const res = await updatePhoto(fm)
        // 返回数据拿到图片地址返回给父组件进行页面渲染
        this.$emit('updateAvator', res.data.data.photo)
      })
    },
    cancel () {
      this.$emit('cancelAvator')
    }
  }
}
</script>

<style lang="less" scoped>
.photo {
  height: 100%;
  width: 100%;
  /deep/.cropper-bg {
    background: #000;
  }
  .cancelBtn {
    position: fixed;
    bottom: 0.13333rem;
    left: 0;
    background: unset;
    color: #fff;
    border: unset;
    font-size: 0.37333rem;
  }
  .saveBtn {
    position: fixed;
    bottom: 0.13333rem;
    right: 0;
    background: unset;
    color: #fff;
    border: unset;
    font-size: 0.37333rem;
  }
}
</style>
