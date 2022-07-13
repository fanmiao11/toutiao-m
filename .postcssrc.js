// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // rootValue 设计稿1rem的大小 // vant组件库是根据37.5设置的
      rootValue: 37.5,
      // 适配的属性
      propList: ['*']
    }
  }
}
