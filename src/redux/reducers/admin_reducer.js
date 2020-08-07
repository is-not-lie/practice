import { COLLAPSED } from '../action_type'

const initState = false

export default (preState = initState, action) => {
  const { type, data } = action
  let newState
  switch (type) {
    case COLLAPSED:
      newState = data
      return newState
    default:
      return preState
  }
}
