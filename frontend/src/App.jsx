import './App.css'
import {Routes , Route} from 'react-router-dom'
import Login from './component/Login'
import SignUp from './component/Signup'
import Dashboard from './component/Dashboard'

function App() {
  return (
    <>
    <div className='App'>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App
