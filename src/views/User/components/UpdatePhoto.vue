<template>
  <div>
    <img :src="photo" alt="" ref="img" />
    <button class="btn" @click="confirm">完成</button>
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
    this.myCropper = new Cropper(img, {})
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
    }
  }
}
</script>

<style scoped>
.btn {
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>
