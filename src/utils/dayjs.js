import dayjs from 'dayjs'
// 封装 ===> new Date()
// 配置相对时间
const relativetime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativetime)

// 配置中文包
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')

export default dayjs

