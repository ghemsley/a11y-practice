const values = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_VALUE': {
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

export default values
