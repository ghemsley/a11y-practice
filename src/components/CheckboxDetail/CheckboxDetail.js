import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './CheckboxDetail.module.scss'

const CheckboxDetail = React.memo(({ inputId }) => {
  const name = useSelector((state) => state.values[inputId]?.name)
  const value = useSelector((state) => state.values[inputId]?.value)
  const dispatch = useDispatch()

  useEffect(() => {
    if (value)
      dispatch({
        type: 'UPDATE_DETAIL',
        payload: {
          [inputId]: true
        }
      })
    else dispatch({ type: 'UPDATE_DETAIL', payload: { [inputId]: false } })
  }, [inputId, value, dispatch])

  return value ? (
    <>
      <span
        id={`${inputId}-detail`}
        className={styles['checkbox-detail']}
        role='status'
        aria-label={`You've indicated the following people have a history of ${name}:`}>
        {value?.toString()}
      </span>
    </>
  ) : null
})

CheckboxDetail.displayName = 'CheckboxDetail'

CheckboxDetail.propTypes = {
  inputId: PropTypes.string.isRequired
}

export default CheckboxDetail
