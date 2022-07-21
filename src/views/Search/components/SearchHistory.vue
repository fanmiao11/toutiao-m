<template>
  <div>
    <van-cell title="搜索历史">
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template v-if="!deleteItem" #right-icon >
        <van-icon name="delete-o"  class="delete" @click="deleteItem = true" />
      </template>
      <!-- 点击删除按钮 显示 （全部删除 完成） -->
      <template v-else #default>
        <span @click="deleteAllSearchHistory">全部删除 </span>
        <!-- 点击完成 显示删除 -->
        <span @click="deleteItem = false">完成</span>

      </template>
    </van-cell>

    <van-cell v-for="item in searchHistoryList" :key="item" >
    <template #title>
      <span @click="clickSearchHistory(item)">{{item}}</span>
    </template>
    <template v-if="deleteItem" #right-icon>
      <van-icon name="close" @click="deleteHistoryItem(item)"/>
    </template>
    </van-cell>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // searchHistoryList:this.$store.state.searchHistory,
      deleteItem: false
    }
  },
  computed: {
    searchHistoryList () {
      console.log(this.$store.state.searchHistory)
      return this.$store.state.searchHistory || []
    }
  },
  methods: {
    clickSearchHistory (value) {
      this.$emit('clicksuggestionitem', value)
    },
    deleteHistoryItem (value) {
      // 删除单条搜索历史
    //   console.log(value);
    //  const newList = this.$store.state.searchHistory.filter( item => item !== value)
    //  console.log(newList);
      this.$store.commit('deleteSearchHistory', value)
    },
    // 删除全部搜索历史
    deleteAllSearchHistory () {
      this.$store.commit('deleteAllSearchHistory')
    }
  }
}
</script>

<style></style>
