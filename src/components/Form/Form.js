import React from 'react'
import Input from '../Input/Input'
import PropTypes from 'prop-types'
import './Form.css'
import Select from '../Select/Select'

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
  return newNumber
}

const formatZipcode = (zipcode) => {
  let newZipcode = zipcode
  if (typeof zipcode !== 'string') newZipcode = newZipcode.toString()
  newZipcode = newZipcode.replace(/\D/g, '')
  if (newZipcode.length > 5) newZipcode = newZipcode.slice(0, 5)
  return newZipcode
}

const Form = ({title, description, ...props}) => {
  const handleSubmit = ( e ) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
      const data = {}
      const elements = e.currentTarget.querySelectorAll('input, select')
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
          errorMessage={ 'Your first name should consist of English alphabet characters' }
          placeholder={ 'Enter your first name' }
          required
        />
        <Input 
          id="last-name"
          name='last-name'
          label='Last name'
          type='text'
          pattern='^[a-zA-Z]*$'
          defaultValue=''
          errorMessage={ 'Your last name should consist of English alphabet characters' }
          placeholder={ 'Enter your last name' }
          required
        />
        <Input 
          id="date-of-birth"
          name='date-of-birth'
          label='Date of birth'
          type='date'
          pattern='^\d{0,4}-?(\d{0,2}-?){0,2}$'
          defaultValue=''
          errorMessage='Your date of birth should consist of a 2 digit month, a 2 digit day, and a 4 digit year'
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
          errorMessage='Your phone number should have ten digits'
        />
        <Input 
          id="email-address"
          name='email-address'
          label='Email address'
          type="email" 
          placeholder='Enter your email address'
          defaultValue=''
          errorMessage='Your email should match the following format: user@example.com'
        />
        <Input 
          id="zipcode"
          name='zipcode'
          label='Zipcode'
          type="tel" 
          pattern='\d{5}'
          defaultValue=''
          placeholder='Enter your zipcode'
          formatter={ formatZipcode }
          errorMessage='Your zipcode should be a five-digit number'
        />
        <Select 
          id="preferred-language" 
          name='preffered-language' 
          label='Preferred language' 
          defaultValue='English' 
          errorMessage='What on earth went wrong?'
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
          errorMessage='You must accept the agreement to submit this form'
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
