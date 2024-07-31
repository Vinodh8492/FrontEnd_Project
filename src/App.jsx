import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../Pages/HomePage/HomePage'
import EditStoryPage from '../Pages/EditStoryPage/EditStoryPage'
import SlideDetails from '../Components/SlideDetails/SlideDetails'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/slide/:id" element={<SlideDetails />} />
        <Route path='/edit' element={<EditStoryPage />} />
      </Routes>
    </div>
  )
}

export default App