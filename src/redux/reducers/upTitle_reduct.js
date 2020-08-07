import { UPTITLE } from '../action_type'

const initState = ''

export default (preState = initState, action) => {
  const { type, data } = action
  let newState
  switch (type) {
    case UPTITLE:
      newState = data
      return newState
    default:
      return preState
  }
}
