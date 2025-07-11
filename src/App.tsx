import { Routes, Route } from 'react-router-dom'
import Reader from './components/Reader'
import Home from './components/Home'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/r/:fileId" element={<Reader />} />
      </Routes>
    </div>
  )
}

export default App