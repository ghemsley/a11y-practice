import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../Error/Error'
import styles from './Input.module.scss'

const Input = React.memo(
  ({
    id,
    style,
    className,
    name,
    label,
    type,
    value,
    checked,
    placeholder,
    pattern,
    formatter,
    patternMismatchMessage,
    withLabel,
    withErrors,
    required,
    children,
    ...props
  }) => {
    let startingValue = ''
    if (type === 'checkbox') startingValue = !!checked
    else if (value) startingValue = value
    const labelId = `${id}-label`
    const errorId = `${id}-error`
    const detailId = `${id}-detail`
    const errorPrefix = `Error on ${label ? label : name}: `
    const [currentValue, setCurrentValue] = useState(startingValue)
    const [currentlyChecked, setCurrentlyChecked] = useState(startingValue)
    const [shouldDispatchValue, setShouldDispatchValue] = useState(true)
    const [shouldDispatchError, setShouldDispatchError] = useState(false)
    const [errorPayload, setErrorPayload] = useState(null)
    const errorVisible = useSelector((state) => state.errors[errorId]?.display)
    // const detailVisible = useSelector((state) => state.details[id])
    const dispatch = useDispatch()

    useEffect(() => {
      let runEffect = true
      if (runEffect && shouldDispatchValue) {
        dispatch({
          type: 'UPDATE_VALUE',
          payload: {
            [id]: {
              name,
              value:
                type === 'checkbox'
                  ? typeof value !== 'undefined' && currentlyChecked
                    ? value
                    : currentlyChecked
                  : currentValue
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
      type,
      value,
      startingValue,
      detailId,
      currentValue,
      currentlyChecked,
      shouldDispatchValue,
      dispatch
    ])

    useEffect(() => {
      let runEffect = true
      if (runEffect && shouldDispatchError && errorPayload) {
        dispatch(errorPayload)
        setShouldDispatchError(false)
      } else if (runEffect && shouldDispatchError) setShouldDispatchError(false)
      return () => {
        runEffect = false
      }
    }, [shouldDispatchError, errorPayload, dispatch])

    const validateInput = (e) => {
      const { validity, willValidate, validationMessage } = e.target
      if (willValidate && !validity?.valid) {
        let errorMessage = ''
        if (patternMismatchMessage && validity.patternMismatch) {
          errorMessage = patternMismatchMessage
        } else if (validationMessage) {
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
    }

    const defaultFormatter = (input, previousValue, e) => {
      switch (typeof input) {
        case 'string':
          if (pattern && new RegExp(pattern).test(input)) return input
          else if (pattern) {
            if (e) validateInput(e)
            return previousValue
          } else return input

        default:
          return input
      }
    }

    const handleChange = (e) => {
      switch (type) {
        case 'checkbox':
          setCurrentlyChecked((prevState) => {
            return !prevState
          })
          setShouldDispatchValue(true)
          break

        default:
          if (formatter) {
            setCurrentValue((prevState) => {
              const { result, valid } = formatter(e.target.value, prevState, e)
              if (!valid) validateInput(e)
              return result
            })
            setShouldDispatchValue(true)
          } else {
            setCurrentValue((prevState) => {
              return defaultFormatter(e.target.value, prevState, e)
            })
            setShouldDispatchValue(true)
          }
          break
      }
    }

    const handleInvalid = (e) => {
      e.preventDefault()
      e.target.focus()
      validateInput(e)
    }

    const conditionalInputProps = {}
    if (pattern) conditionalInputProps.pattern = pattern
    if (placeholder) conditionalInputProps.placeholder = placeholder
    if (required) conditionalInputProps.required = true
    if (errorVisible) {
      conditionalInputProps['aria-invalid'] = true
      conditionalInputProps['aria-errormessage'] = errorId
    }
    // if (detailVisible) conditionalInputProps['aria-describedby'] = detailId

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
        <input
          id={id}
          name={name}
          type={type}
          value={currentValue}
          checked={type === 'checkbox' ? checked : false}
          onChange={handleChange}
          onBlur={validateInput}
          onInvalid={handleInvalid}
          formNoValidate
          {...conditionalInputProps}
          {...props}
        />
        {children}
        {withErrors && <Error inputId={id} />}
      </div>
    )
  }
)

Input.displayName = 'Input'

Input.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'button',
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week'
  ]).isRequired,
  value: PropTypes.any,
  checked: PropTypes.bool,
  placeholder: PropTypes.string,
  announce: PropTypes.oneOf(['immediate', 'polite']),
  pattern: PropTypes.string,
  formatter: PropTypes.func,
  patternMismatchMessage: PropTypes.string,
  withLabel: PropTypes.bool,
  withErrors: PropTypes.bool,
  required: PropTypes.bool,
  children: PropTypes.object
}

export default Input
