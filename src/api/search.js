import request from '@/utils/request'

/**
 *
 * @param {String} q 关键词
 * @returns Promise
 */
export const getSearchSuggestion = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
