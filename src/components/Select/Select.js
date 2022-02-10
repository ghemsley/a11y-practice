import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './Select.css'

const Select = ({id, className, name, label, defaultValue, errorMessage, required, announce, children, ...props}) => {
  const [ value, setValue ] = useState(defaultValue)
  const [ message, setMessage ] = useState(errorMessage ? `Error: ${errorMessage}` : '')
  const [ errorHidden, setErrorHidden ] = useState(true)
  const [ errorKey, setErrorKey ] = useState(`${id}-error-key`)
  const labelId = `${id}-label`
  const errorId = `${id}-error`

  const handleChange = ( e ) => {
    setValue(e.target.value)
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
            : announce === 'immediate'
              ? 'alert'
              : 'status'
        }
        key={errorKey}
      >{message}</p>
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
  errorMessage: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element)
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

export default Select
