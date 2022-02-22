import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../Error/Error'
import styles from './Select.module.scss'

const Select = React.memo(
  ({
    id,
    style,
    className,
    name,
    label,
    value,
    withLabel,
    withErrors,
    required,
    children,
    ...props
  }) => {
    let startingValue = ''
    if (typeof value !== 'undefined') startingValue = value
    const labelId = `${id}-label`
    const errorId = `${id}-error`
    const errorPrefix = `Error on ${label ? label : name}: `
    const [currentValue, setCurrentValue] = useState(startingValue)
    const [shouldDispatchValue, setShouldDispatchValue] = useState(true)
    const [shouldDispatchError, setShouldDispatchError] = useState(false)
    const [errorPayload, setErrorPayload] = useState(null)
    const errorVisible = useSelector((state) => state.errors[errorId]?.display)
    const dispatch = useDispatch()

    useEffect(() => {
      let runEffect = true
      if (runEffect && shouldDispatchValue) {
        dispatch({
          type: 'UPDATE_VALUE',
          payload: {
            [id]: {
              name,
              value: currentValue
            }
          }
        })
        setShouldDispatchValue(false)
      }
      return () => {
        runEffect = false
      }
    }, [
      id,
      name,
      value,
      startingValue,
      currentValue,
      shouldDispatchValue,
      dispatch
    ])

    useEffect(() => {
      let runEffect = true
      if (runEffect && shouldDispatchError && errorPayload)
        dispatch(errorPayload)
      else if (runEffect && shouldDispatchError) setShouldDispatchError(false)
      return () => {
        runEffect = false
      }
    }, [shouldDispatchError, errorPayload, dispatch])

    const validateInput = (e) => {
      const { validity, willValidate, validationMessage } = e.target
      if (willValidate && !validity?.valid) {
        let errorMessage = ''
        if (validationMessage) {
          errorMessage = validationMessage
        }
        setErrorPayload({
          type: 'UPDATE_ITEM',
          payload: {
            id: errorId,
            item: {
              message: errorMessage,
              prefix: errorPrefix,
              key: `${errorId}-key-${Math.random()}`,
              display: true
            }
          }
        })
        setShouldDispatchError(true)
      } else if (errorVisible) {
        setErrorPayload({
          type: 'UPDATE_ITEM',
          payload: {
            id: errorId,
            item: {
              message: '',
              prefix: errorPrefix,
              key: `${errorId}-key`,
              display: false
            }
          }
        })
        setShouldDispatchError(true)
      }
      return willValidate && validity?.valid
    }

    const defaultFormatter = (input, previousValue, e) => {
      switch (typeof input) {
        case 'string':
          if (e && validateInput(e)) return input
          else return previousValue

        default:
          return input
      }
    }

    const handleChange = (e) => {
      setCurrentValue((prevState) => {
        const result = defaultFormatter(e.target.value, prevState, e)
        return result
      })
      setShouldDispatchValue(true)
    }

    const handleInvalid = (e) => {
      e.preventDefault()
      e.target.focus()
      validateInput(e)
    }

    const conditionalInputProps = useMemo(() => {
      const object = {}
      if (required) object.required = true
      if (typeof currentValue !== 'undefined') object.value = currentValue
      if (errorVisible) {
        object['aria-invalid'] = true
        object['aria-errormessage'] = errorId
        // object['aria-describedby'] = errorId
      }
      return object
    }, [currentValue, errorId, errorVisible, required])

    return (
      <div
        className={`${styles.container}${
          className ? ' '.concat(className) : ''
        }`}
        style={style}>
        {withLabel && (
          <label id={labelId} htmlFor={id}>
            {`${label}${required ? ' (Required)' : ''}`}
          </label>
        )}
        <select
          id={id}
          name={name}
          onChange={handleChange}
          onBlur={validateInput}
          onInvalid={handleInvalid}
          {...conditionalInputProps}
          {...props}>
          {children}
        </select>
        {withErrors && <Error inputId={id} />}
      </div>
    )
  }
)

Select.displayName = 'Select'

Select.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  announce: PropTypes.oneOf(['immediate', 'polite']),
  withLabel: PropTypes.bool,
  withErrors: PropTypes.bool,
  required: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.object)
}

export default Select
