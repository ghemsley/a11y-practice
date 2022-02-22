import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Input from '../Input/Input'
import CheckboxDetail from '../CheckboxDetail/CheckboxDetail'
import Label from '../Label/Label'
import Error from '../Error/Error'
import styles from './SkinConditionsForm.module.scss'

const SkinConditionsForm = React.memo(
  ({ id, className, title, description, ...props }) => {
    const values = useSelector((state) => state.values)

    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault()
        if (e.target.checkValidity()) {
          let elementIds = []
          for (const element of e.target.querySelectorAll('input')) {
            if (element?.type !== 'submit') elementIds.push(element?.id)
          }

          let formState = {}
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

    return (
      <form
        id={id}
        className={`${styles.form}${className ? ' '.concat(className) : ''}`}
        onSubmit={handleSubmit}
        noValidate
        {...props}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && <h4 className={styles.description}>{description}</h4>}
        <div className={styles.container}>
          <div>
            <Label inputId='melanoma'>Melanoma</Label>
            <CheckboxDetail inputId='melanoma' />
            <Error inputId='melanoma' />
          </div>
          <Input
            id='melanoma'
            className={styles['input-component']}
            name='melanoma'
            label='Melanoma'
            type='checkbox'
            value='You'
          />
        </div>
        <div className={styles.container}>
          <div>
            <Label inputId='other-skin-cancers'>
              Other Skin Cancers (Basal Cell, Squamous Cell)
            </Label>
            <CheckboxDetail inputId='other-skin-cancers' />
            <Error inputId='other-skin-cancers' />
          </div>
          <Input
            id='other-skin-cancers'
            className={styles['input-component']}
            name='other-skin-cancers'
            label='Other Skin Cancers (Basal Cell, Squamous Cell)'
            type='checkbox'
            value='You'
          />
        </div>
        <div className={styles.container}>
          <div>
            <Label inputId='eczema'>Eczema </Label>
            <CheckboxDetail inputId='eczema' />
            <Error inputId='eczema' />
          </div>
          <Input
            id='eczema'
            className={styles['input-component']}
            name='eczema'
            label='Eczema'
            type='checkbox'
            value='You'
          />
        </div>
        <div className={styles.container}>
          <div>
            <Label inputId='psoriasis'>Psoriasis</Label>
            <CheckboxDetail inputId='psoriasis' />
            <Error inputId='psoriasis' />
          </div>
          <Input
            id='psoriasis'
            className={styles['input-component']}
            name='psoriasis'
            label='Psoriasis'
            type='checkbox'
            value='You'
          />
        </div>
        <input
          id='submit-skin-conditions'
          type='submit'
          aria-label='Submit this form'
        />
      </form>
    )
  }
)

SkinConditionsForm.displayName = 'SkinConditionsForm'

SkinConditionsForm.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string
}

SkinConditionsForm.defaultProps = {
  title: 'Form'
}

export default SkinConditionsForm
