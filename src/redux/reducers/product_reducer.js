import { ADDPRODUCTLIST } from '../action_type'
const initState = []
export default (preState = initState, action) => {
  const { type, data } = action
  let newState
  switch (type) {
    case ADDPRODUCTLIST:
      newState = data
      return newState
    default:
      return preState
  }
}
