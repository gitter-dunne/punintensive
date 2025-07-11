// Harvard Outline System Utilities

export const romanNumerals = [
  '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'
]

export const capitalLetters = [
  '', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export const arabicNumbers = [
  '', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
]

export const lowercaseLetters = [
  '', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

export interface ProcessedSlide {
  id: string
  level: number
  content: string
  tutorial: boolean
  colorScheme?: string
  audioUrl?: string
  downloadUrl?: string
  downloadText?: string
  link?: string
  linkText?: string
  imageUrl?: string
  imageAlt?: string
  harvardId: string
  displayContent: string
}

export function processSlides(slides: any[]): ProcessedSlide[] {
  const counters = [0, 0, 0, 0] // Level 1, 2, 3, 4 counters
  
  return slides.map((slide) => {
    const level = slide.level
    
    // Reset counters for deeper levels when we encounter a higher level
    for (let i = level; i < counters.length; i++) {
      if (i > level - 1) {
        counters[i] = 0
      }
    }
    
    // Increment counter for current level
    counters[level - 1]++
    
    // Generate Harvard ID based on level and counters
    let harvardId = ''
    let numericId = ''
    
    switch (level) {
      case 1:
        harvardId = romanNumerals[counters[0]]
        numericId = counters[0].toString()
        break
      case 2:
        harvardId = `${romanNumerals[counters[0]]}.${capitalLetters[counters[1]]}`
        numericId = `${counters[0]}.${counters[1]}`
        break
      case 3:
        harvardId = `${romanNumerals[counters[0]]}.${capitalLetters[counters[1]]}.${arabicNumbers[counters[2]]}`
        numericId = `${counters[0]}.${counters[1]}.${counters[2]}`
        break
      case 4:
        harvardId = `${romanNumerals[counters[0]]}.${capitalLetters[counters[1]]}.${arabicNumbers[counters[2]]}.${lowercaseLetters[counters[3]]}`
        numericId = `${counters[0]}.${counters[1]}.${counters[2]}.${counters[3]}`
        break
      default:
        harvardId = 'ERROR'
        numericId = 'error'
    }
    
    // Create display content with Harvard numbering
    const displayContent = `${harvardId}. ${slide.content.replace(/^[IVX]+\.\s*|^[A-Z]\.\s*|^\d+\.\s*|^[a-z]\.\s*/, '')}`
    
    return {
      ...slide,
      id: numericId,
      level,
      harvardId,
      displayContent
    }
  })
}

export function getSectionNumber(id: string): number {
  // Extract the first number from the ID (e.g., "1.2.3" -> 1)
  const match = id.match(/^(\d+)/)
  return match ? parseInt(match[1]) : 1
}