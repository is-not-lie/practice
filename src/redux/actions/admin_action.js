import { COLLAPSED, UPTITLE } from '../action_type'
// 控制侧边栏收缩
export const setCollapsed = (v) => ({ type: COLLAPSED, data: v })
// 更新列表标题
export const upTitle = (v) => ({ type: UPTITLE, data: v })
