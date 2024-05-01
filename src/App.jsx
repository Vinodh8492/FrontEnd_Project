import React from 'react'
import { Routes, Route} from 'react-router-dom'
import HomePage from '../Pages/HomePage/HomePage'
import LoginPage from '../Pages/LoginPage/LoginPage'
import RegisterPage from '../Pages/RegisterPage/RegisterPage'
import StoryPage from '../Pages/StoryPage/StoryPage'
import EditStoryPage from '../Pages/EditStoryPage/EditStoryPage'
import SlideDetails from '../Components/SlideDetails/SlideDetails'

function App() {
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        {/* <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/story' element={<StoryPage/>} /> */}
        <Route path="/slide/:id" element={<SlideDetails />} />
        <Route path='/edit' element={<EditStoryPage/>} />
       
        
      </Routes>
    </div>
  )
}

export default App