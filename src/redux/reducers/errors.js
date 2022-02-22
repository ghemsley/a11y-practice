const errors = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { message, key, ...item } = action.payload.item // eslint-disable-line no-unused-vars
      if (message === state[action.payload.id]?.item?.message)
        return {
          ...state,
          [action.payload.id]: {
            ...item,
            message,
            key: state[action.payload.id].item.key
          }
        }
      else return { ...state, [action.payload.id]: action.payload.item }
    }

    default: {
      return state
    }
  }
}

export default errors
