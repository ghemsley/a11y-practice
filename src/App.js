import React from 'react'
import Form from './components/Form/Form'

function App() {
  return (
    <>
      <header>
        <h1>A11y Practice</h1>
      </header>
      <main>
        <section>
          <div>
            <h2>Accessible form</h2>
            <p>Below is a form meant to demonstrate basic accessibility features</p>
            <Form />
          </div>
        </section>
      </main>
      <footer>
        <section>
          Copyright © 2022 Teladoc Health
        </section>
      </footer>
    </>
  )
}

export default App
