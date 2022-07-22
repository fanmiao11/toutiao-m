
import request from '@/utils/request'

/**
 * 获取评论
 * @param {Object} params {type(a对文章，c对评论), source(文章或评论id), offset(此评论id向后取数据), limit(获取评论个数)}
 * @returns Promise
 */
export const getComment = (params) => {
  return request({
    url: '/v1_0/comments',
    params
  })
}

// 对文章进行评论
export const postComment = (data) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data
  })
}

