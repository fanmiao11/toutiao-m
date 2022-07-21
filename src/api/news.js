import request from '@/utils/request'

/**
 *
 * @param {*} channel_id 频道id
 * @param {*} timestamp 获取第一页文章的时间戳
 * @returns Promise
 */

export const getAriticleList = (id, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: id,
      timestamp
    }
  })
}

export const getArticleDetail = (articleId) => {
  return request({
    url: `/v1_0/articles/${articleId}`
  })
}
