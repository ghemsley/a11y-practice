import React, { useCallback } from 'react'
import Input from '../Input/Input'
import PropTypes from 'prop-types'
import Select from '../Select/Select'
import styles from './Form.module.scss'
import { useSelector } from 'react-redux'

const Form = React.memo(({ id, className, title, description, ...props }) => {
  const values = useSelector((state) => state.values)

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (e.target.checkValidity()) {
        let elementIds = []
        let formState = {}
        for (const element of e.target.querySelectorAll('input, select')) {
          if (element?.type !== 'submit') elementIds.push(element?.id)
        }
        for (const [key, value] of Object.entries(values)) {
          if (
            elementIds.includes(key) &&
            typeof value?.value !== 'undefined' &&
            value?.value !== ''
          )
            formState[key] = value.value
        }
        console.log('form state', formState)
      } else console.log('invalid')
    },
    [values]
  )

  const formatPhoneNumber = useCallback((number, previousNumber) => {
    let newNumber = number
    let deleteParens = false
    if (typeof newNumber !== 'string') newNumber = newNumber.toString()
    let digits = newNumber.replace(/\D/g, '')
    if (newNumber.length < previousNumber.length && digits.length < 4) {
      deleteParens = true
    }
    newNumber = digits
    if (digits.length > 0 && digits.length < 4) {
      newNumber = `(${newNumber})`
    } else if (digits.length > 3 && digits.length < 7) {
      newNumber = `(${newNumber.slice(0, 3)}) ${newNumber.slice(3)}`
    } else if (digits.length > 6 && digits.length < 11) {
      newNumber = newNumber.split('')
      newNumber.splice(6, 0, '-')
      newNumber = newNumber.join('')
      newNumber = `(${newNumber.slice(0, 3)}) ${newNumber.slice(3)}`
    } else if (digits.length > 10) {
      newNumber = newNumber.split('')
      newNumber = newNumber.slice(0, 10)
      newNumber.splice(6, 0, '-')
      newNumber = newNumber.join('')
      newNumber = `(${newNumber.slice(0, 3)}) ${newNumber.slice(3)}`
    }
    if (deleteParens) {
      newNumber = digits
    }
    return {
      result: newNumber,
      valid:
        newNumber !== previousNumber ||
        (number === newNumber && newNumber === '' && previousNumber === '')
    }
  }, [])

  const formatZipcode = useCallback((zipcode, previousZipcode) => {
    let newZipcode = zipcode
    if (typeof zipcode !== 'string') newZipcode = newZipcode.toString()
    let digits = newZipcode.replace(/\D/g, '')
    newZipcode = digits.slice(0, Math.min(digits.length, 5))
    return {
      result: newZipcode,
      valid:
        newZipcode !== previousZipcode ||
        (zipcode === newZipcode && newZipcode === '' && previousZipcode === '')
    }
  }, [])

  return (
    <form
      id={id}
      className={`${styles.form}${className ? ' '.concat(className) : ''}`}
      onSubmit={handleSubmit}
      noValidate
      {...props}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <h4 className='form-info'>{description}</h4>}
      <fieldset>
        <legend>Your personal details</legend>
        <Input
          id='first-name'
          name='first-name'
          label='First name'
          type='text'
          pattern='^[a-zA-Z]*$'
          patternMismatchMessage='Your first name should consist of English alphabet characters'
          placeholder='Enter your first name'
          withLabel
          withErrors
          required
        />
        <Input
          id='last-name'
          name='last-name'
          label='Last name'
          type='text'
          pattern='^[a-zA-Z]*$'
          patternMismatchMessage='Your last name should consist of English alphabet characters'
          placeholder='Enter your last name'
          withLabel
          withErrors
          required
        />
        <Input
          id='date-of-birth'
          name='date-of-birth'
          label='Date of birth'
          type='date'
          pattern='^\d{0,4}-?(\d{0,2}-?){0,2}$'
          patternMismatchMessage='Your date of birth should consist of a 2 digit month, followed by a 2 digit day, and a 4 digit year'
          withLabel
          withErrors
          required
        />
      </fieldset>
      <fieldset>
        <legend>Your contact info</legend>
        <Input
          id='phone-number'
          name='phone-number'
          label='Phone number'
          type='tel'
          pattern='^\(\d{3}\) \d{3}-\d{4}$'
          formatter={formatPhoneNumber}
          placeholder='Enter your phone number'
          patternMismatchMessage='Your phone number should be a ten-digit number'
          withLabel
          withErrors
        />
        <Input
          id='email-address'
          name='email-address'
          label='Email address'
          type='email'
          placeholder='Enter your email address'
          patternMismatchMessage='Your email should resemble following format: user@example.com'
          withLabel
          withErrors
        />
        <Input
          id='zipcode'
          name='zipcode'
          label='Zipcode'
          type='tel'
          pattern='^\d{5}$'
          formatter={formatZipcode}
          placeholder='Enter your zipcode'
          patternMismatchMessage='Your zipcode should be a five-digit number'
          withLabel
          withErrors
        />
        <Select
          id='preferred-language'
          name='preffered-language'
          label='Preferred language'
          value='English'
          withLabel
          withErrors>
          <option value='English'>English</option>
          <option value='French'>French</option>
          <option value='German'>German</option>
        </Select>
      </fieldset>
      <fieldset>
        <legend>Agreement</legend>
        <Input
          id='agreement'
          name='agreement'
          label='I agree'
          type='checkbox'
          value={'I agree'}
          withLabel
          withErrors
          required
        />
      </fieldset>
      <input id='submit' type='submit' aria-label='Submit this form' />
    </form>
  )
})

Form.displayName = 'Form'

Form.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string
}

Form.defaultProps = {
  title: 'Form'
}

export default Form
