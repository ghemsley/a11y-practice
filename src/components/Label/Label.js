import React from 'react'
import PropTypes from 'prop-types'

const Label = React.memo(({ inputId, children, ...props }) => {
  return (
    <label id={`${inputId}-label`} htmlFor={inputId} {...props}>
      {children}
    </label>
  )
})

Label.displayName = 'Label'

Label.propTypes = {
  inputId: PropTypes.string,
  children: PropTypes.any
}

export default Label
