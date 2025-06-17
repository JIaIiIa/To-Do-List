import { useState } from 'react'
import './App.css'
import './assets/scss/main.scss'
import PostList from './assets/blocs/PostList.jsx'
function App() {

  return (
    <div className='app container'>
      <PostList />
    </div>
  )
}

export default App
