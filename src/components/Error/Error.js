import React from 'react'
import PropTypes from 'prop-types'
import styles from './Error.module.scss'
import { useSelector } from 'react-redux'

const Error = React.memo(
  ({
    inputId,
    className,
    announce,
    prefix,
    message,
    shown,
    setKey,
    children,
    ...props
  }) => {
    const id = `${inputId}-error`
    const itemClassName = useSelector((state) => state.errors[id]?.className)
    const finalClassName = `${styles.error}${
      className ? ' '.concat(className) : ''
    }${itemClassName ? ' '.concat(itemClassName) : ''}`
    const itemPrefix = useSelector((state) => state.errors[id]?.prefix)
    const finalPrefix = prefix ? prefix : itemPrefix ? itemPrefix : ''
    const itemKey = useSelector((state) => state.errors[id]?.key)
    const finalKey = setKey ? setKey : itemKey ? itemKey : `${id}-key`
    const itemMessage = useSelector((state) => state.errors[id]?.message)
    const finalMessage = message ? message : itemMessage ? itemMessage : ''
    const itemDisplay = useSelector((state) => state.errors[id]?.display)
    const finalDisplay = shown ? shown : itemDisplay ? itemDisplay : false

    return (
      finalDisplay && (
        <p
          id={id}
          className={finalClassName}
          role={announce === 'immediate' ? 'alert' : 'status'}
          aria-label={finalPrefix}
          key={finalKey}
          {...props}>
          {finalMessage}
          {children}
        </p>
      )
    )
  }
  // (prevProps, nextProps) => checkObjectEquality(prevProps, nextProps)
)

Error.displayName = 'Error'

Error.propTypes = {
  inputId: PropTypes.string.isRequired,
  className: PropTypes.string,
  key: PropTypes.any,
  announce: PropTypes.string,
  prefix: PropTypes.string,
  message: PropTypes.string,
  shown: PropTypes.bool,
  setKey: PropTypes.any,
  children: PropTypes.arrayOf(PropTypes.element)
}

export default Error
