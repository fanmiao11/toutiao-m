import request from '@/utils/request'
import storage from '@/utils/storage'

export const getMyChannels = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}

// 获取所有频道
export const getAllChannels = () => {
  return request({
    url: '/v1_0/channels'
  })
}

// 在本地存储中存取我的频道数据
const HEIMA_TOUTIAO_CHANNELS = 'HEIMA_TOUTIAO_CHANNELS'
export const getMyChannelsByLocal = () => storage.get(HEIMA_TOUTIAO_CHANNELS)
export const setMyChannelsToLocal = (channel) =>
  storage.set(HEIMA_TOUTIAO_CHANNELS, channel)

// 删除用户频道
export const delMyChannel = (target) => {
  return request({
    url: `/v1_0/user/channels/${target}`,
    method: 'DELETE'
  })
}

/**
 * 添加我的频道
 * @param {Number} id 频道的id
 * @param {Number} seq 添加频道的索引下标
 * @returns
 */
export const addMyChannel = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [{ id, seq }]
    }
  })
}
