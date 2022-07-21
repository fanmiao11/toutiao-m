// 存本地搜索历史
import storage from './storage'

const TOKEN_KEY = 'HEIMA_TOUTIAO_SEARCHHISTORY'

export const getHistory = () => storage.get(TOKEN_KEY)

export const setHistory = (token) => storage.set(TOKEN_KEY, token)

export const removeHistory = () => storage.remove(TOKEN_KEY)
