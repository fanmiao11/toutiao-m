// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // rootValue 设计稿1rem的大小 
      // vant组件库是根据37.5设置的
      // rootValue: 37.5,
      // 动态设置rootValue的大小
      rootValue: (module) => {
        // 如果是vant组件 就返回37.5
        // 不是就返回 75
        // 只能转换样式表内的px  不能转换行内样式
        if(/vant/gi.test(module.file)){
          return 37.5
        }else{
          return 75
        }
        // console.log(module);
        // return 37.5
      },
      // 适配的属性
      propList: ['*']
    }
  }
}
