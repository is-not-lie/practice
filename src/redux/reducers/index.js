import { combineReducers } from 'redux'
import login from './login_reducer'
import collapsed from './admin_reducer'
import uptitle from './upTitle_reduct'
import categoryList from './category_reducer'
import productList from './product_reducer'
export default combineReducers({
  userInfo: login,
  collapsed,
  uptitle,
  categoryList,
  productList,
})
