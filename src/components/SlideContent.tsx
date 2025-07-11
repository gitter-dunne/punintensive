import React from 'react'
import { Download, ExternalLink, Volume2, X, ZoomIn } from 'lucide-react'
import { ProcessedSlide } from '../utils/harvardOutline'

interface SlideContentProps {
  slide: ProcessedSlide
  showRedacted: boolean
  theme?: 'flat-rainbow' | 'pastel-shine'
}

const SlideContent: React.FC<SlideContentProps> = ({ slide, showRedacted, theme = 'flat-rainbow' }) => {
  const [showImageModal, setShowImageModal] = React.useState(false)

  const createRedactionBlocks = (text: string): string => {
    // Split by spaces and punctuation to handle words individually while preserving structure
    const parts = text.split(/(\s+|[.,!?;:()[\]{}'""-])/g)
    
    return parts.map(part => {
      // If it's whitespace or punctuation, keep it as-is
      if (/^\s+$/.test(part) || /^[.,!?;:()[\]{}'""-]+$/.test(part)) {
        return part
      }
      
      // If it's a word, replace with blocks based on length
      if (part.trim().length > 0) {
        const wordLength = part.length
        let blockCount
        
        // Smart block sizing based on word length
        if (wordLength >= 1 && wordLength <= 3) {
          blockCount = 3
        } else if (wordLength >= 4 && wordLength <= 7) {
          blockCount = 7
        } else {
          blockCount = Math.min(10, Math.max(8, wordLength))
        }
        
        return '█'.repeat(blockCount)
      }
      
      return part
    }).join('')
  }


  const processContent = (content: string): string => {
    if (!showRedacted) {
      // Remove redaction markup when not showing redacted content
      return content.replace(/\[redact\](.*?)\[\/redact\]/g, '$1')
    }
    
    // Replace redaction markup with smart blocks that preserve sentence structure
    return content.replace(/\[redact\](.*?)\[\/redact\]/g, (_match, text) => {
      return createRedactionBlocks(text)
    })
  }

  const getOverlayClass = (): string => {
    return theme === 'pastel-shine' ? 'bg-gray-700/10' : 'bg-white/10'
  }

  const getButtonClass = (): string => {
    return theme === 'pastel-shine' 
      ? 'bg-gray-700/20 hover:bg-gray-700/30 text-gray-700' 
      : 'bg-white/20 hover:bg-white/30 text-white'
  }

  const renderContent = () => {
    const processedContent = processContent(slide.displayContent)
    const lines = processedContent.split('\n')
    
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />
      
      // Handle bullet points
      if (line.startsWith('• ')) {
        return (
          <div key={index} className="flex items-center justify-center gap-3 mb-3">
            <span className="text-white/80">•</span>
            <span dangerouslySetInnerHTML={{ __html: line.substring(2) }} />
          </div>
        )
      }
      
      // Regular content
      return (
        <p key={index} className="mb-4 text-center" dangerouslySetInnerHTML={{ __html: line }} />
      )
    })
  }

  const getFontSize = () => {
    switch (slide.level) {
      case 1:
        return 'text-3xl font-bold'
      case 2:
        return 'text-2xl font-semibold'
      case 3:
        return 'text-xl font-medium'
      default:
        return 'text-lg'
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Main Content */}
      <div className={`leading-relaxed ${getFontSize()}`}>
        {renderContent()}
      </div>

      {/* Audio Player */}
      {slide.audioUrl && (
        <div className={`${getOverlayClass()} backdrop-blur-sm rounded-lg p-4 mx-auto max-w-md`}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Volume2 size={20} />
            <span className="font-medium text-base">Audio Content</span>
          </div>
          <audio controls className="w-full">
            <source src={slide.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Download Link */}
      {slide.downloadUrl && (
        <div className={`${getOverlayClass()} backdrop-blur-sm rounded-lg p-4 mx-auto max-w-md text-center`}>
          <a
            href={slide.downloadUrl}
            download
            className={`inline-flex items-center gap-2 px-4 py-2 ${getButtonClass()} rounded-lg transition-colors text-base font-medium`}
          >
            <Download size={18} />
            {slide.downloadText || 'Download File'}
          </a>
        </div>
      )}

      {/* External Link */}
      {slide.link && (
        <div className={`${getOverlayClass()} backdrop-blur-sm rounded-lg p-4 mx-auto max-w-md text-center`}>
          <a
            href={slide.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 ${getButtonClass()} rounded-lg transition-colors text-base font-medium`}
          >
            <ExternalLink size={18} />
            {slide.linkText || 'Visit Link'}
          </a>
        </div>
      )}

      {/* Image */}
      {slide.imageUrl && (
        <>
          <div className={`${getOverlayClass()} backdrop-blur-sm rounded-lg p-4 mx-auto max-w-md`}>
            <div className="relative group cursor-pointer" onClick={() => setShowImageModal(true)}>
              <img
                src={slide.imageUrl}
                alt={slide.imageAlt || 'Slide image'}
                className="w-full h-32 object-cover rounded-lg shadow-lg mx-auto"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <ZoomIn size={24} className="text-white" />
              </div>
            </div>
            <p className={`text-center text-sm mt-2 ${theme === 'pastel-shine' ? 'text-gray-600' : 'text-white/80'}`}>Click to enlarge</p>
          </div>

          {/* Image Modal */}
          {showImageModal && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowImageModal(false)}
            >
              <div className="relative max-w-4xl max-h-full">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute -top-12 right-0 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all hover:scale-110 border-2 border-white/20"
                >
                  <X size={32} />
                </button>
                <img
                  src={slide.imageUrl}
                  alt={slide.imageAlt || 'Slide image'}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SlideContent