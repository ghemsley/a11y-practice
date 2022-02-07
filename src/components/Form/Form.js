import React, { useState } from 'react'
import './Form.css'

export const formatPhoneNumber = ( number, previousNumber ) => {
  let newNumber = number
  let deleteParens = false
  if ( typeof newNumber !== 'string' ) {
    newNumber = newNumber.toString()
  }
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

const Form = () => {
  const [ reset, setReset ] = useState( false )
  const [ firstName, setFirstName ] = useState( '' )
  const [ lastName, setLastName ] = useState( '' )
  const [ dateOfBirth, setDateOfBirth ] = useState( '' )
  const [ phoneNumber, setPhoneNumber ] = useState( '' )
  const [ emailAddress, setEmailAddress ] = useState( '' )
  const [ zipcode, setZipcode ] = useState( '' )
  const [ preferredLanguage, setPreferredLanguage ] = useState( 'English' )
  const [ agreementChecked, setAgreementChecked ] = useState( false )

  const values = { firstName, lastName, dateOfBirth, phoneNumber, emailAddress, zipcode, preferredLanguage, agreementChecked }

  const handleSubmit = ( e ) => {
    e.preventDefault()
    console.log( values )
  }

  const handleReset = () => {
    setFirstName( '' )
    setLastName( '' )
    setDateOfBirth( '' )
    setPhoneNumber( '' )
    setEmailAddress( '' )
    setZipcode( '' )
    setPreferredLanguage( 'English' )
    setAgreementChecked( false )
    setReset(false)
  }

  const onChangePhoneNumber = ( e ) => {
    setPhoneNumber( formatPhoneNumber( e.target.value, phoneNumber ) )
  }

  return (
    <form onSubmit={ handleSubmit } onReset={ () => setReset( true ) }>
      <fieldset>
        Your personal details
        <label htmlFor="first-name">
          First Name (Required)
        </label>
        <input id="first-name" type="text" required value={ firstName } onChange={ ( e ) => setFirstName( e.target.value ) } />
        <label htmlFor="last-name">
          * Last Name
        </label>
        <input id="last-name" type="text" required value={ lastName } onChange={ ( e ) => setLastName( e.target.value ) } />
        <label htmlFor="date-of-birth">
          Date of Birth
        </label>
        <input id="date-of-birth" type="date" required value={ dateOfBirth } onChange={ ( e ) => setDateOfBirth( e.target.value ) } />
      </fieldset>
      <br />
      <fieldset>
        Your contact info
        <label htmlFor="phone-number">
          Phone Number *
        </label>
        <input id="phone-number" type="tel" onChange={ onChangePhoneNumber } value={ phoneNumber } />
        <label htmlFor="email-address">
          Email address
        </label>
        <input id="email-address" type="email" value={ emailAddress } onChange={ ( e ) => setEmailAddress( e.target.value ) } />
        <label htmlFor="zipcode">
          Zipcode
        </label>
        <input
          id="zipcode"
          type="text"
          pattern='\d{5}'
          title='Your zipcode should be a five-digit number'
          aria-describedby='zipcode-help'
          value={ zipcode }
          onChange={ ( e ) => setZipcode( e.target.value.toString() ) }
        />
        <p id='zipcode-help'>Your zipcode should be a five-digit number.</p>
        <label htmlFor="preferred-language">
          Preferred Language
        </label>
        <select id="preferred-language" value={ preferredLanguage } onChange={ ( e ) => setPreferredLanguage( e.target.value ) }>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </select>
      </fieldset>
      <br />
      <fieldset>Agreement
        <label htmlFor="agreement">
          I agree
        </label>
        <input id="agreement"
          type="checkbox"
          aria-describedby='agreement-help'
          required
          checked={ agreementChecked }
          onChange={ () => setAgreementChecked( prev => !prev ) }
        />
        <p id='agreement-help'>You must accept the agreement to submit this form.</p>
      </fieldset>
      <br />
      <span>
        { reset ? (
          <>
            <input type='button' value='Cancel form reset' autoFocus onClick={ () => setReset( false ) }  key='cancelreset' />
            <input type='button' value='Confirm form reset' onClick={ handleReset } key='confirmreset' />
          </>
        ) : (
          <>
            <input id="submit" type="submit" key='submit' aria-label='Submit your form' />
            <input id='reset' type='reset' key='reset' aria-label='Reset your form' />
          </>
        ) }
      </span>
    </form>
  )
}

export default Form
