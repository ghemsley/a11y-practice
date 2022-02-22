const details = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_DETAIL': {
      return {
        ...state,
        ...action.payload
      }
    }

    default: {
      return state
    }
  }
}

export default details
