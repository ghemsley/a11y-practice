import React from 'react'
import Form from './components/Form/Form'
import './App.css'

function App() {
  return (
    <>
      <header>
        <h1>A11y Practice</h1>
      </header>
      <main>
        <section>
          <h2>Form component</h2>
          <p>Below is an example form meant to demonstrate basic accessibility features</p>
          <Form title='User Info' description='Please provide some information about yourself:'/>
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
