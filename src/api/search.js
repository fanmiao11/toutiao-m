import request from '@/utils/request'

/**
 *获取搜索建议
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

/**
 * 获取搜索结果
 * @param {Object} params page页数,per_page每页数量,q关键词
 * @returns Promise
 */
export const getSearchResult = (params) => {
  return request({
    url: '/v1_0/search',
    params
  })
}
