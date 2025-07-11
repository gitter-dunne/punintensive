import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronUp, ChevronDown, Eye, EyeOff, Calendar, Video, Plus, Palette, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SlideContent from './SlideContent'
import { PresentationData } from '../types'
import { processSlides, getSectionNumber, ProcessedSlide } from '../utils/harvardOutline'

const Reader: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>()
  const [data, setData] = useState<PresentationData | null>(null)
  const [processedSlides, setProcessedSlides] = useState<ProcessedSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('down')
  const [showTutorial, setShowTutorial] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<'flat-rainbow' | 'pastel-shine'>('flat-rainbow')

  useEffect(() => {
    loadPresentation()
  }, [fileId])

  useEffect(() => {
    if (!data) return
    
    const updateCountdown = () => {
      const now = new Date()
      const recordingDateTime = new Date(`${data.recordingDate}T${data.recordingTime}`)
      const timeDiff = recordingDateTime.getTime() - now.getTime()
      
      if (timeDiff <= 0) {
        setTimeLeft('Recording time has passed')
        return
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [data])

  const loadPresentation = async () => {
    try {
      setLoading(true)
      
      // Load JSON file from public directory
      const response = await fetch(`/presentations/${fileId}.json`)
      if (!response.ok) {
        throw new Error(`Failed to load presentation: ${response.status}`)
      }
      const mockData: PresentationData = await response.json()
      
      setData(mockData)
      
      // Set the theme from the loaded data
      setCurrentTheme(mockData.theme || 'flat-rainbow')
      
      // Process slides to generate Harvard outline IDs and levels
      const processed = processSlides(mockData.slides)
      setProcessedSlides(processed)
      
      // Set initial tutorial visibility based on recording date/time
      // Hide tutorial slides 1 hour before recording time, otherwise show them
      const now = new Date()
      const recordingDateTime = new Date(`${mockData.recordingDate}T${mockData.recordingTime}`)
      const oneHourBefore = new Date(recordingDateTime.getTime() - 60 * 60 * 1000)
      setShowTutorial(now < oneHourBefore) // Show tutorials until 1 hour before recording
      
    } catch (err) {
      setError('Failed to load presentation')
    } finally {
      setLoading(false)
    }
  }

  const getVisibleSlides = (): ProcessedSlide[] => {
    return processedSlides.filter(slide => showTutorial || !slide.tutorial)
  }

  const visibleSlides = getVisibleSlides()
  const totalSlides = visibleSlides.length

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setSlideDirection('down')
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1)
      }, 0)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setSlideDirection('up')
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1)
      }, 0)
    }
  }

  const shouldShowRedacted = (): boolean => {
    if (!data) return false
    if (data.permanentRedaction) return true
    
    const now = new Date()
    const recordingDateTime = new Date(`${data.recordingDate}T${data.recordingTime}`)
    return now < recordingDateTime
  }

  const isSessionJoinable = (): boolean => {
    if (!data) return false
    const now = new Date()
    const recordingDateTime = new Date(`${data.recordingDate}T${data.recordingTime}`)
    const oneHourBefore = new Date(recordingDateTime.getTime() - 60 * 60 * 1000)
    return now >= oneHourBefore
  }

  const handleThemeChange = (newTheme: 'flat-rainbow' | 'pastel-shine') => {
    setCurrentTheme(newTheme)
    setShowThemeSelector(false)
    
    // Update the data object to reflect the new theme
    if (data) {
      setData({ ...data, theme: newTheme })
    }
  }

  const generateVCalFile = (): string => {
    if (!data) return ''
    
    const startDate = new Date(`${data.recordingDate}T${data.recordingTime}`)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour duration
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    const vcal = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Pun Intensive Reader//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      'SUMMARY:Pun Intensive Recording Session',
      `DESCRIPTION:Join the recording session for: ${data.title}\\n\\nAccess link: ${window.location.href}`,
      `URL:${window.location.href}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
    
    return vcal
  }

  const downloadVCal = () => {
    const vcalContent = generateVCalFile()
    const blob = new Blob([vcalContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pun-intensive-session.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatDateTime = (date: string, time: string): string => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }).replace(/CST|CDT/, 'Central Time')
  }

  const getSlideColor = (slide: ProcessedSlide): string => {
    const sectionNumber = getSectionNumber(slide.id)
    
    // Color schemes cycle through 6 colors based on main section
    const colorSchemes = ['red', 'blue', 'green', 'purple', 'orange', 'teal']
    const baseColor = colorSchemes[(sectionNumber - 1) % colorSchemes.length]
    
    // Theme-specific color maps
    const flatRainbowColors = {
      red: {
        1: 'from-red-600 to-red-700',    // I. Main section - darkest red
        2: 'from-red-400 to-red-500',    // I.A. Subsection - noticeably lighter red
        3: 'from-red-300 to-red-400',    // I.A.1. Sub-subsection - much lighter red
        4: 'from-red-200 to-red-300'     // I.A.1.a. Detail - very light red
      },
      blue: {
        1: 'from-blue-600 to-blue-700',
        2: 'from-blue-400 to-blue-500',
        3: 'from-blue-300 to-blue-400',
        4: 'from-blue-200 to-blue-300'
      },
      green: {
        1: 'from-green-600 to-green-700',
        2: 'from-green-400 to-green-500',
        3: 'from-green-300 to-green-400',
        4: 'from-green-200 to-green-300'
      },
      purple: {
        1: 'from-purple-600 to-purple-700',
        2: 'from-purple-400 to-purple-500',
        3: 'from-purple-300 to-purple-400',
        4: 'from-purple-200 to-purple-300'
      },
      orange: {
        1: 'from-orange-600 to-orange-700',
        2: 'from-orange-400 to-orange-500',
        3: 'from-orange-300 to-orange-400',
        4: 'from-orange-200 to-orange-300'
      },
      teal: {
        1: 'from-teal-600 to-teal-700',
        2: 'from-teal-400 to-teal-500',
        3: 'from-teal-300 to-teal-400',
        4: 'from-teal-200 to-teal-300'
      }
    }
    
    const pastelShineColors = {
      red: {
        1: 'from-pink-300 via-pink-200 to-pink-100',
        2: 'from-pink-200 via-pink-100 to-pink-50',
        3: 'from-pink-100 via-pink-50 to-white',
        4: 'from-pink-50 via-white to-pink-50'
      },
      blue: {
        1: 'from-blue-300 via-blue-200 to-blue-100',
        2: 'from-blue-200 via-blue-100 to-blue-50',
        3: 'from-blue-100 via-blue-50 to-white',
        4: 'from-blue-50 via-white to-blue-50'
      },
      green: {
        1: 'from-emerald-300 via-emerald-200 to-emerald-100',
        2: 'from-emerald-200 via-emerald-100 to-emerald-50',
        3: 'from-emerald-100 via-emerald-50 to-white',
        4: 'from-emerald-50 via-white to-emerald-50'
      },
      purple: {
        1: 'from-purple-300 via-purple-200 to-purple-100',
        2: 'from-purple-200 via-purple-100 to-purple-50',
        3: 'from-purple-100 via-purple-50 to-white',
        4: 'from-purple-50 via-white to-purple-50'
      },
      orange: {
        1: 'from-orange-300 via-orange-200 to-orange-100',
        2: 'from-orange-200 via-orange-100 to-orange-50',
        3: 'from-orange-100 via-orange-50 to-white',
        4: 'from-orange-50 via-white to-orange-50'
      },
      teal: {
        1: 'from-teal-300 via-teal-200 to-teal-100',
        2: 'from-teal-200 via-teal-100 to-teal-50',
        3: 'from-teal-100 via-teal-50 to-white',
        4: 'from-teal-50 via-white to-teal-50'
      }
    }
    
    const colorMap = currentTheme === 'pastel-shine' ? pastelShineColors : flatRainbowColors
    const colors = colorMap[baseColor as keyof typeof colorMap]
    return colors[slide.level as keyof typeof colors] || colors[1]
  }

  const getProgressBarColor = (currentSlideData: ProcessedSlide): string => {
    if (!currentSlideData) return 'from-primary-500 to-secondary-500'
    
    const sectionNumber = getSectionNumber(currentSlideData.id)
    const colorSchemes = ['red', 'blue', 'green', 'purple', 'orange', 'teal']
    const baseColor = colorSchemes[(sectionNumber - 1) % colorSchemes.length]
    
    const flatRainbowProgressColors = {
      red: 'from-red-500 to-red-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      teal: 'from-teal-500 to-teal-600'
    }
    
    const pastelShineProgressColors = {
      red: 'from-pink-300 to-pink-400',
      blue: 'from-blue-300 to-blue-400',
      green: 'from-emerald-300 to-emerald-400',
      purple: 'from-purple-300 to-purple-400',
      orange: 'from-orange-300 to-orange-400',
      teal: 'from-teal-300 to-teal-400'
    }
    
    const progressColorMap = currentTheme === 'pastel-shine' ? pastelShineProgressColors : flatRainbowProgressColors
    
    return progressColorMap[baseColor as keyof typeof progressColorMap] || 'from-primary-500 to-secondary-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600">Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-xl">{error || 'Presentation not found'}</p>
          <button 
            onClick={loadPresentation}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (totalSlides === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-xl">No slides to display</p>
          <button 
            onClick={() => setShowTutorial(!showTutorial)}
            className="px-6 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
          >
            Toggle Tutorial Slides
          </button>
        </div>
      </div>
    )
  }

  const getSlideThemeClass = (): string => {
    return currentTheme === 'pastel-shine' ? 'slide-pill-pastel-shine' : 'slide-pill-main'
  }

  const getSlideTextColor = (): string => {
    return currentTheme === 'pastel-shine' ? 'text-gray-700' : 'text-white'
  }

  const currentSlideData = visibleSlides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center space-y-4">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800">{data.title}</h1>
            
            {/* Recording Time */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-lg text-gray-700">
                <Calendar size={20} />
                {formatDateTime(data.recordingDate, data.recordingTime)}
              </div>
            </div>
            
            {/* Countdown */}
            <div className="text-sm text-gray-600">
              {timeLeft}
            </div>
            
            {/* Join Session Button */}
            {data.sessionLink && (
              <div>
                <button
                  onClick={() => window.open(data.sessionLink, '_blank')}
                  disabled={!isSessionJoinable()}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isSessionJoinable()
                      ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Video size={18} />
                  {isSessionJoinable() ? 'Join Recording Session' : 'Session Not Available Yet'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="max-w-5xl mx-auto px-6 py-32">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: slideDirection === 'down' ? 50 : -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: slideDirection === 'down' ? -50 : 50 }}
              transition={{ duration: 0.4 }}
              className={`${getSlideThemeClass()} min-h-[300px] max-w-4xl mx-auto p-8 bg-gradient-to-br ${getSlideColor(currentSlideData)} ${getSlideTextColor()} flex items-center justify-center`}
            >
              <div className="w-full text-center">
                <SlideContent 
                  slide={currentSlideData} 
                  showRedacted={shouldShowRedacted()} 
                  theme={currentTheme}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons - Enhanced Visibility */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute left-1/2 transform -translate-x-1/2 -top-24 p-4 bg-gray-800/90 backdrop-blur-sm rounded-full text-white hover:bg-gray-700/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl border-2 border-white/20 z-30"
          >
            <ChevronUp size={32} strokeWidth={3} />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="absolute left-1/2 transform -translate-x-1/2 -bottom-24 p-4 bg-gray-800/90 backdrop-blur-sm rounded-full text-white hover:bg-gray-700/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl border-2 border-white/20 z-30"
          >
            <ChevronDown size={32} strokeWidth={3} />
          </button>
        </div>

        {/* Progress Bar - Now matches current slide color */}
        <div className="mt-40 bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className={`h-full bg-gradient-to-r ${getProgressBarColor(currentSlideData)} transition-all duration-500 shadow-sm`}
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </div>

      {/* Theme Selector Popup */}
      {showThemeSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette size={24} />
                  <h3 className="text-xl font-semibold">Choose Theme</h3>
                </div>
                <button
                  onClick={() => setShowThemeSelector(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Theme Options */}
            <div className="p-6 space-y-4">
              {/* Flat Rainbow Theme */}
              <button
                onClick={() => handleThemeChange('flat-rainbow')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  currentTheme === 'flat-rainbow'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">🌈 Flat Rainbow</h4>
                  {currentTheme === 'flat-rainbow' && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Bold, vibrant colors with flat design and high contrast
                </p>
                {/* Preview */}
                <div className="flex gap-2">
                  <div className="w-8 h-4 rounded-full bg-gradient-to-r from-red-600 to-red-700"></div>
                  <div className="w-8 h-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700"></div>
                  <div className="w-8 h-4 rounded-full bg-gradient-to-r from-green-600 to-green-700"></div>
                  <div className="w-8 h-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-700"></div>
                </div>
              </button>

              {/* Pastel Shine Theme */}
              <button
                onClick={() => handleThemeChange('pastel-shine')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  currentTheme === 'pastel-shine'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">✨ Pastel Shine</h4>
                  {currentTheme === 'pastel-shine' && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Soft pastel colors with glossy, shiny effects and 3D depth
                </p>
                {/* Preview */}
                <div className="flex gap-2">
                  <div className="w-8 h-4 rounded-full bg-gradient-to-r from-pink-300 to-pink-200 shadow-inner"></div>
                  <div className="w-8 h-4 rounded-full bg-gradient-to-r from-blue-300 to-blue-200 shadow-inner"></div>
                  <div className="w-8 h-4 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-200 shadow-inner"></div>
                  <div className="w-8 h-4 rounded-full bg-gradient-to-r from-purple-300 to-purple-200 shadow-inner"></div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4">
              <p className="text-xs text-gray-500 text-center">
                Theme changes apply instantly to your current session
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-6">
            {/* Add to Calendar Button */}
            <button
              onClick={downloadVCal}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <Plus size={18} />
              Add to Calendar
            </button>
            
            {/* Theme Selector Button */}
            <button
              onClick={() => setShowThemeSelector(true)}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <Palette size={18} />
              Theme
            </button>
            
            {/* Show/Hide Tutorial Slides Button */}
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors font-medium ${
                showTutorial 
                  ? 'bg-secondary-500 text-white hover:bg-secondary-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showTutorial ? <Eye size={18} /> : <EyeOff size={18} />}
              {showTutorial ? 'Hide Tutorial Slides' : 'Show Tutorial Slides'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reader