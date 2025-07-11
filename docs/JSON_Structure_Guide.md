# Pun Intensive Reader - JSON Structure & File Integration Guide

## 📋 Complete JSON Template

```json
{
  "id": "your-presentation-id",
  "title": "Your Presentation Title",
  "recordingDate": "2025-07-20",
  "recordingTime": "15:00",
  "permanentRedaction": false,
  "sessionLink": "https://zoom.us/j/123456789",
  "slides": [
    {
      "id": "slide-1",
      "level": 1,
      "content": "I. Main Section Title",
      "type": "normal",
      "hidden": false,
      "colorScheme": "red"
    },
    {
      "id": "slide-2",
      "level": 2,
      "content": "A. Subsection with [redact]hidden content[/redact]",
      "type": "sensitive",
      "hidden": true,
      "colorScheme": "blue",
      "audioUrl": "https://example.com/audio.mp3",
      "downloadUrl": "https://example.com/document.pdf",
      "downloadText": "Download PDF Guide",
      "link": "https://example.com/more-info",
      "linkText": "Learn More",
      "imageUrl": "https://example.com/image.jpg",
      "imageAlt": "Description of the image"
    }
  ]
}
```

## 🏗️ Presentation Metadata

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | ✅ | Unique identifier for presentation | `"meeting-2025-07-20"` |
| `title` | string | ✅ | Display title in header | `"Quarterly Review Meeting"` |
| `recordingDate` | string | ✅ | Date in YYYY-MM-DD format | `"2025-07-20"` |
| `recordingTime` | string | ✅ | Time in HH:MM format (24-hour) | `"15:00"` |
| `permanentRedaction` | boolean | ✅ | Keep redacted content hidden forever | `false` |
| `sessionLink` | string | ❌ | Zoom/Teams meeting URL | `"https://zoom.us/j/123456789"` |

## 📄 Slide Structure

### Required Fields
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | ✅ | Unique slide identifier | `"intro-1"` |
| `level` | number | ✅ | Hierarchy level (1-4) | `1` |
| `content` | string | ✅ | Main slide text | `"I. Introduction"` |
| `type` | string | ✅ | `"normal"` or `"sensitive"` | `"normal"` |
| `hidden` | boolean | ✅ | Hide by default | `false` |

### Optional Enhancement Fields
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `colorScheme` | string | ❌ | Override automatic color (optional) | `"red"`, `"blue"`, `"green"`, `"purple"`, `"orange"`, `"teal"` |
| `audioUrl` | string | ❌ | Audio file URL | `"https://example.com/audio.mp3"` |
| `downloadUrl` | string | ❌ | PDF/document download URL | `"https://example.com/guide.pdf"` |
| `downloadText` | string | ❌ | Custom download button text | `"Download Complete Guide"` |
| `link` | string | ❌ | External website URL | `"https://company.com/info"` |
| `linkText` | string | ❌ | Custom link button text | `"Visit Our Website"` |
| `imageUrl` | string | ❌ | Image file URL | `"https://example.com/photo.jpg"` |
| `imageAlt` | string | ❌ | Image accessibility text | `"Team photo from meeting"` |

## 🎨 Automatic Color Assignment & Hierarchy

### 🤖 Automatic Color Assignment
Colors are **automatically assigned** based on your slide ID structure:
- **Section 1** (IDs starting with "1"): Red theme
- **Section 2** (IDs starting with "2"): Blue theme  
- **Section 3** (IDs starting with "3"): Green theme
- **Section 4** (IDs starting with "4"): Purple theme
- **Section 5** (IDs starting with "5"): Orange theme
- **Section 6** (IDs starting with "6"): Teal theme
- **Section 7+**: Cycles back through the colors

### 📝 Slide ID Examples:
```json
// These will all be RED (Section 1)
"id": "1"     // Main section
"id": "1a"    // Subsection  
"id": "1b"    // Subsection
"id": "1c1"   // Sub-subsection

// These will all be BLUE (Section 2)  
"id": "2"     // Main section
"id": "2a"    // Subsection
"id": "2b"    // Subsection
```

### Available Color Schemes
- **`red`** - Red gradient family (Section 1)
- **`blue`** - Blue gradient family (Section 2)  
- **`green`** - Green gradient family (Section 3)
- **`purple`** - Purple gradient family (Section 4)
- **`orange`** - Orange gradient family (Section 5)
- **`teal`** - Teal gradient family (Section 6)

### 🎛️ Manual Override (Optional)
You can still manually specify a color if needed:
```json
{
  "id": "special-slide",
  "colorScheme": "purple"  // Forces purple instead of auto-assigned color
}
```

### Hierarchy Levels
- **Level 1**: Main sections (largest font, darkest color) - Use Roman numerals: I, II, III
- **Level 2**: Subsections (medium font, medium color) - Use letters: A, B, C
- **Level 3**: Sub-subsections (smaller font, lighter color) - Use numbers: 1, 2, 3
- **Level 4**: Details (smallest font, lightest color) - Use lowercase: a, b, c

## 🔒 Redaction System

### Redaction Markup
Wrap sensitive content in redaction tags:
```json
"content": "Public info [redact]This is hidden until recording time[/redact] More public info"
```

### Redaction Behavior
- **Before Recording Time**: Shows as black blocks (█)
- **After Recording Time**: Shows actual content (unless `permanentRedaction: true`)
- **Sensitive Slides**: Can be toggled with visibility button

## 📁 File Integration Guide

### 🎵 Audio Files

#### Supported Formats
- **MP3** (recommended)
- **WAV**
- **OGG**

#### How to Add Audio
1. **Upload to Cloud Storage**:
   - Google Drive (make public, get direct link)
   - Dropbox (create public link)
   - AWS S3 (set public permissions)
   - Your website's media folder

2. **Get Direct URL**:
   ```
   ✅ Good: https://example.com/audio.mp3
   ❌ Bad: https://drive.google.com/file/d/abc123/view
   ```

3. **Add to JSON**:
   ```json
   {
     "audioUrl": "https://example.com/presentation-audio.mp3"
   }
   ```

#### Audio Best Practices
- **File Size**: Keep under 10MB for fast loading
- **Quality**: 128kbps MP3 is sufficient for speech
- **Length**: 30 seconds to 5 minutes recommended

### 📄 PDF Documents

#### How to Add PDFs
1. **Upload to Cloud Storage**:
   - Google Drive → Share → Anyone with link → Copy link
   - Dropbox → Share → Create link
   - Your website's documents folder

2. **Get Direct Download URL**:
   ```
   ✅ Good: https://example.com/guide.pdf
   ✅ Good: https://drive.google.com/uc?id=FILE_ID&export=download
   ❌ Bad: https://drive.google.com/file/d/FILE_ID/view
   ```

3. **Add to JSON**:
   ```json
   {
     "downloadUrl": "https://example.com/meeting-notes.pdf",
     "downloadText": "Download Meeting Notes (PDF)"
   }
   ```

#### PDF Best Practices
- **File Size**: Keep under 25MB
- **Naming**: Use descriptive filenames
- **Security**: Ensure files are publicly accessible

### 🖼️ Images

#### Supported Formats
- **JPG/JPEG** (recommended for photos)
- **PNG** (recommended for graphics with transparency)
- **WebP** (modern, smaller file sizes)

#### How to Add Images
1. **Upload to Image Hosting**:
   - **Imgur**: Free, reliable, direct links
   - **Google Photos**: Share → Get link
   - **Your website**: Upload to `/images/` folder
   - **Pexels/Unsplash**: Use stock photo URLs

2. **Get Direct Image URL**:
   ```
   ✅ Good: https://i.imgur.com/abc123.jpg
   ✅ Good: https://images.pexels.com/photos/123/photo.jpg
   ✅ Good: https://example.com/images/chart.png
   ❌ Bad: https://photos.google.com/share/abc123
   ```

3. **Add to JSON**:
   ```json
   {
     "imageUrl": "https://i.imgur.com/presentation-chart.jpg",
     "imageAlt": "Sales growth chart showing 25% increase"
   }
   ```

#### Image Best Practices
- **Size**: Optimize to 1920px width max
- **File Size**: Keep under 2MB each
- **Alt Text**: Always provide descriptive alt text
- **Format**: Use JPG for photos, PNG for graphics

## 🔗 External Links

### How to Add Links
```json
{
  "link": "https://company.com/product-info",
  "linkText": "View Product Details"
}
```

### Link Best Practices
- **HTTPS**: Always use secure URLs
- **Testing**: Verify links work before publishing
- **Text**: Use descriptive link text

## 📝 Content Formatting

### Text Formatting
- **Line Breaks**: Use `\n` for new lines
- **Bullet Points**: Start with `• ` (bullet + space)
- **Emphasis**: Use natural text emphasis

### Example Content
```json
"content": "A. Meeting Agenda\n• Review Q3 results\n• Discuss Q4 planning\n• [redact]Budget allocation details[/redact]"
```

## 🎯 Complete Example Slide

```json
{
  "id": "quarterly-results",
  "level": 2,
  "content": "B. Q3 Financial Results\n• Revenue: [redact]$2.5M (15% increase)[/redact]\n• Expenses: $1.8M\n• Net Profit: [redact]$700K[/redact]",
  "type": "sensitive",
  "hidden": true,
  "colorScheme": "green",
  "audioUrl": "https://example.com/cfo-commentary.mp3",
  "downloadUrl": "https://example.com/q3-financial-report.pdf",
  "downloadText": "Download Full Financial Report",
  "imageUrl": "https://i.imgur.com/revenue-chart.jpg",
  "imageAlt": "Q3 revenue growth chart showing upward trend"
}
```

## 🚀 Quick Start Checklist

### Before Creating Your JSON:
- [ ] Gather all audio files and upload to cloud storage
- [ ] Prepare PDF documents and get public URLs
- [ ] Optimize and upload images
- [ ] Plan your content hierarchy (levels 1-4)
- [ ] Identify sensitive content for redaction
- [ ] Choose color schemes for different sections

### File Organization Tips:
1. **Create a folder structure**:
   ```
   presentation-assets/
   ├── audio/
   │   ├── intro.mp3
   │   └── conclusion.mp3
   ├── documents/
   │   ├── handout.pdf
   │   └── resources.pdf
   └── images/
       ├── chart1.jpg
       └── diagram.png
   ```

2. **Use consistent naming**:
   - `presentation-name-audio-01.mp3`
   - `presentation-name-handout.pdf`
   - `presentation-name-chart-revenue.jpg`

3. **Test all URLs** before finalizing your JSON

## 🔧 Validation Tools

### JSON Validation
- Use [JSONLint](https://jsonlint.com/) to validate syntax
- Check all URLs are accessible
- Verify date/time formats

### Testing Your Presentation
1. Upload your JSON file
2. Test all media files load correctly
3. Verify redaction works as expected
4. Check responsive design on mobile
5. Test countdown timer accuracy

This guide covers everything you need to create rich, interactive presentations with the Pun Intensive Reader!