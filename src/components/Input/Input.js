import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './Input.css'

const Input = ({id, className, name, label, type, defaultValue, placeholder, pattern, formatter, errorMessage, required, announce, ...props}) => {
  const [ value, setValue ] = useState(defaultValue)
  const [ checked, setChecked ] = useState(false)
  const [ message, setMessage ] = useState(errorMessage ? `Error: ${errorMessage}` : '')
  const [ errorHidden, setErrorHidden ] = useState(true)
  const [ errorKey, setErrorKey ] = useState(`${id}-error-key`)
  const labelId = `${id}-label`
  const errorId = `${id}-error`

  const defaultFormatter = (input, previousValue) => {
    switch (typeof input) {
    case 'string':
      if (pattern) return new RegExp(pattern).test(input) ? input : previousValue
      else return input

    default: 
      return input
    }
  }

  const handleChange = ( e ) => {
    switch (type) {
    case 'checkbox': 
      setChecked(prevState => {
        setValue(!prevState)
        return !prevState
      })
      break

    default:
      if (formatter) setValue(prevState => formatter(e.target.value, prevState))
      else setValue(prevState => defaultFormatter(e.target.value, prevState))
      break
    }
  }

  const validateInput = (e) => {
    const { validity, willValidate, validationMessage } = e.currentTarget
    if (willValidate && !validity?.valid) {
      if (!errorMessage) setMessage(validationMessage)
      else {
        setMessage(`Error: ${errorMessage}`)
        // e.currentTarget.setCustomValidity(errorMessage)
      }
      setErrorHidden(false)
      setErrorKey(`${id}-error-key-${Math.random()}`)
    } else {
      // e.currentTarget.setCustomValidity('')
      setErrorHidden(true)
    }
  }

  const handleInvalid = (e) => {
    e.preventDefault()
    e.currentTarget.focus()
    setErrorHidden(false)
    setErrorKey(`${id}-error-key-${Math.random()}`)
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
            : announce === 'immediate'
              ? 'alert'
              : 'status'
        }
        key={errorKey}
      >{message}</p>
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
  errorMessage: PropTypes.string,
  required: PropTypes.bool
}

/*
  <select 
          id="preferred-language" 
          name='preffered-language'
          value={ preferredLanguage }
          onChange={ ( e ) => setPreferredLanguage( e.target.value ) } 
          onBlur={validateInput}
        >
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </select>
*/

export default Input
