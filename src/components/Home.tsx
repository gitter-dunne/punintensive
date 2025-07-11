import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Pun Intensive Reader
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A beautiful slideshow viewer for your JSON presentations with advanced redaction and visibility controls.
          </p>
        </div>
        
        <div className="flex gap-6 justify-center">
          <Link 
            to="/r/demo" 
            className="flex items-center gap-3 px-8 py-4 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <BookOpen size={24} />
            View Demo
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Try the demo or access files directly at <code>/r/your-file-id</code></p>
        </div>
      </div>
    </div>
  )
}

export default Home