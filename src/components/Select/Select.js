import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './Select.css'

const Select = ({id, className, name, label, defaultValue, pattern, formatter, patternMismatchMessage, required, announce, children, ...props}) => {
  const labelId = `${id}-label`
  const errorId = `${id}-error`
  const role = announce === 'immediate' ? 'alert' : 'status'
  const errorPrefix = `Error on ${label}: `
  const [ value, setValue ] = useState(defaultValue)
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
    if (formatter) setValue(prevState => {
      const { result, valid } = formatter(e.target.value, prevState, e)
      if (!valid) validateInput(e)
      return result
    })
    else setValue(prevState => defaultFormatter(e.target.value, prevState, e))
  }

  const handleInvalid = (e) => {
    e.preventDefault()
    e.target.focus()
    validateInput(e)
  }

  return (
    <div className={`select-container${className ? ' '.concat(className) : ''}`}>
      <label id={labelId} htmlFor={id}>
        {`${label}${required ? ' (Required)' : ''}`}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={ handleChange }
        onBlur={ validateInput }
        onInvalid={ handleInvalid }
        aria-errormessage={errorId}
        required={required}
        {...props}
      >
        {children}
      </select>
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

Select.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.any.isRequired,
  className: PropTypes.string,
  announce: PropTypes.oneOf(['immediate', 'polite']),
  pattern: PropTypes.string,
  formatter: PropTypes.func,
  patternMismatchMessage: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element)
}

export default Select
