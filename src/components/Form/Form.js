import React from 'react'
import Input from '../Input/Input'
import PropTypes from 'prop-types'
import Select from '../Select/Select'
import './Form.css'

export const formatPhoneNumber = ( number, previousNumber ) => {
  let newNumber = number
  let deleteParens = false
  if ( typeof newNumber !== 'string' ) newNumber = newNumber.toString()
  let digits = newNumber.replace( /\D/g, '' )
  if ( newNumber.length < previousNumber.length && digits.length < 4 ) {
    deleteParens = true
  }
  newNumber = digits
  if ( digits.length > 0 && digits.length < 4 ) {
    newNumber = `(${ newNumber })`
  } else if ( digits.length > 3 && digits.length < 7 ) {
    newNumber = `(${ newNumber.slice( 0, 3 ) }) ${ newNumber.slice( 3 ) }`
  } else if ( digits.length > 6 && digits.length < 11 ) {
    newNumber = newNumber.split( '' )
    newNumber.splice( 6, 0, '-' )
    newNumber = newNumber.join( '' )
    newNumber = `(${ newNumber.slice( 0, 3 ) }) ${ newNumber.slice( 3 ) }`
  } else if ( digits.length > 10 ) {
    newNumber = newNumber.split( '' )
    newNumber = newNumber.slice( 0, 10 )
    newNumber.splice( 6, 0, '-' )
    newNumber = newNumber.join( '' )
    newNumber = `(${ newNumber.slice( 0, 3 ) }) ${ newNumber.slice( 3 ) }`
  }
  if ( deleteParens ) {
    newNumber = digits
  }
  return {
    result: newNumber,
    valid: newNumber !== previousNumber || (number === newNumber && newNumber === '' && previousNumber === '' )
  }
}

const formatZipcode = (zipcode, previousZipcode) => {
  let newZipcode = zipcode
  if (typeof zipcode !== 'string') newZipcode = newZipcode.toString()
  let digits = newZipcode.replace(/\D/g, '')
  newZipcode = digits.slice(0, Math.min(digits.length, 5))
  return {
    result: newZipcode,
    valid: newZipcode !== previousZipcode || (zipcode === newZipcode && newZipcode === '' && previousZipcode === '')
  }
}

const Form = ({title, description, ...props}) => {
  const handleSubmit = ( e ) => {
    e.preventDefault()
    if (e.target.checkValidity()) {
      const data = {}
      const elements = e.target.querySelectorAll('input, select')
      for (const element of elements) {
        if (element?.type === 'checkbox') data[element.name] = element?.value ? element.value : element.checked
        else if (element?.type !== 'submit' || element instanceof HTMLSelectElement) data[element.name] = element.value
      }
      console.log('submission', data)
    } else console.log('invalid')
  }

  return (
    <form onSubmit={ handleSubmit } noValidate {...props}>
      {title && <h3 className='form-title'>{title}</h3>}
      {description && <h4 className='form-info'>{description}</h4>}
      <fieldset>
        <legend>Your personal details</legend>
        <Input 
          id="first-name"
          name='first-name'
          label='First name'
          type='text'
          pattern='^[a-zA-Z]*$'
          defaultValue=''
          patternMismatchMessage='Your first name should consist of English alphabet characters'
          placeholder='Enter your first name'
          required
        />
        <Input 
          id="last-name"
          name='last-name'
          label='Last name'
          type='text'
          pattern='^[a-zA-Z]*$'
          defaultValue=''
          patternMismatchMessage='Your last name should consist of English alphabet characters'
          placeholder='Enter your last name'
          required
        />
        <Input 
          id="date-of-birth"
          name='date-of-birth'
          label='Date of birth'
          type='date'
          pattern='^\d{0,4}-?(\d{0,2}-?){0,2}$'
          defaultValue=''
          patternMismatchMessage='Your date of birth should consist of a 2 digit month, followed by a 2 digit day, and a 4 digit year'
          required
        />
      </fieldset>
      <fieldset>
        <legend>Your contact info</legend>
        <Input 
          id="phone-number"
          name='phone-number'
          label='Phone number'
          type="tel" 
          pattern='^\(\d{3}\) \d{3}-\d{4}$'
          defaultValue=''
          formatter={ formatPhoneNumber }
          placeholder='Enter your phone number'
          patternMismatchMessage='Your phone number should be a ten-digit number'
        />
        <Input 
          id="email-address"
          name='email-address'
          label='Email address'
          type="email" 
          placeholder='Enter your email address'
          defaultValue=''
          patternMismatchMessage='Your email should resemble following format: user@example.com'
        />
        <Input 
          id="zipcode"
          name='zipcode'
          label='Zipcode'
          type="tel" 
          pattern='^\d{5}$'
          formatter={formatZipcode}
          defaultValue=''
          placeholder='Enter your zipcode'
          patternMismatchMessage='Your zipcode should be a five-digit number'
        />
        <Select 
          id="preferred-language" 
          name='preffered-language' 
          label='Preferred language' 
          defaultValue='English' 
          patternMismatchMessage='What on earth went wrong here?'
        >
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </Select>
      </fieldset>
      <fieldset>
        <legend>Agreement</legend>
        <Input 
          id="agreement"
          name='agreement'
          label='I agree'
          type="checkbox" 
          defaultValue={ false }
          required
        />
      </fieldset>
      <div>
        <input id="submit" type="submit" aria-label='Submit your form' />
      </div>
    </form>
  )
}

Form.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

Form.defaultProps = {
  title: 'Form'
}

export default Form
