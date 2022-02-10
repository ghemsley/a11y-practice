import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './Input.css'

const Input = ({ id, className, name, label, type, defaultValue, placeholder, pattern, formatter, patternMismatchMessage, required, announce, ...props }) => {
  const labelId = `${id}-label`
  const errorId = `${id}-error`
  const role = announce === 'immediate' ? 'alert' : 'status'
  const errorPrefix = `Error on ${label}: `
  const [ value, setValue ] = useState(defaultValue)
  const [ checked, setChecked ] = useState(false)
  const [ errorMessage, setErrorMessage ] = useState('')
  const [ errorHidden, setErrorHidden ] = useState(true)
  const [ errorKey, setErrorKey ] = useState(`${id}-error-key`)

  const validateInput = (e) => {
    const { validity, willValidate, validationMessage } = e.target
    if (willValidate && !validity?.valid) {
      if (patternMismatchMessage && validity.patternMismatch) setErrorMessage(`${patternMismatchMessage}`)
      else {
        setErrorMessage(`${validationMessage}`)
      }
      setErrorHidden(false)
      setErrorKey(`${id}-error-key-${Math.random()}`)
    } else {
      setErrorHidden(true)
    }
  }

  const defaultFormatter = (input, previousValue, e) => {
    switch (typeof input) {
    case 'string':
      if (pattern && new RegExp(pattern).test(input)) return input
      else if (pattern) {
        if (e) validateInput(e)
        return previousValue
      }
      else return input

    default: 
      return input
    }
  }

  const handleChange = (e) => {
    switch (type) {
    case 'checkbox': 
      setChecked(prevState => {
        setValue(!prevState)
        return !prevState
      })
      break

    default:
      if (formatter) setValue(prevState => {
        const { result, valid } = formatter(e.target.value, prevState, e)
        if (!valid) validateInput(e)
        return result
      })
      else setValue(prevState => defaultFormatter(e.target.value, prevState, e))
      break
    }
  }

  const handleInvalid = (e) => {
    e.preventDefault()
    e.target.focus()
    validateInput(e)
  }

  return (
    <div className={`input-container${className ? ' '.concat(className) : ''}`}>
      <label id={labelId} htmlFor={id}>
        {`${label}${required ? ' (Required)' : ''}`}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        pattern={pattern}
        checked={ type === 'checkbox' ? checked : undefined }
        onChange={ handleChange }
        onBlur={ validateInput }
        onInvalid={ handleInvalid }
        aria-errormessage={errorId}
        placeholder={placeholder}
        required={required}
        formNoValidate
        {...props}
      />
      <p
        id={errorId}
        className='error'
        hidden={errorHidden}
        role={
          errorHidden
            ? undefined
            : role
        }
        aria-label={errorPrefix}
        key={errorKey}
      >{errorMessage}</p>
    </div>
  )
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
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
  defaultValue: PropTypes.any.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  announce: PropTypes.oneOf(['immediate', 'polite']),
  pattern: PropTypes.string,
  formatter: PropTypes.func,
  patternMismatchMessage: PropTypes.string,
  required: PropTypes.bool
}

export default Input
