# Pun Intensive Reader - JSON Markup Guide

## Overview
This guide explains how to create and format JSON files for the Pun Intensive Reader application. The reader supports hierarchical presentations with advanced features like redaction, multimedia content, and color-coded sections.

## File Structure

### Basic JSON Structure
```json
{
  "id": "your-presentation-id",
  "title": "Your Presentation Title",
  "recordingDate": "2024-01-15",
  "recordingTime": "14:30",
  "permanentRedaction": false,
  "slides": [
    // Array of slide objects
  ]
}
```

### Presentation Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the presentation |
| `title` | string | Yes | Display title shown in the header |
| `recordingDate` | string | Yes | Date in YYYY-MM-DD format |
| `recordingTime` | string | Yes | Time in HH:MM format (24-hour) |
| `permanentRedaction` | boolean | Yes | Whether redacted content stays hidden after recording time |

## Slide Objects

### Required Fields
```json
{
  "id": "unique-slide-id",
  "level": 1,
  "content": "Your slide content here",
  "type": "normal",
  "hidden": false
}
```

### All Slide Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the slide |
| `level` | number | Yes | Hierarchy level (1-4) - affects font size and color intensity |
| `content` | string | Yes | Main text content (supports redaction markup) |
| `type` | string | Yes | Either "normal" or "sensitive" |
| `hidden` | boolean | Yes | Whether slide is hidden by default |
| `colorScheme` | string | No | Color theme: "red", "blue", "green", "purple", "orange", "teal" |
| `audioUrl` | string | No | URL to audio file |
| `downloadUrl` | string | No | URL for downloadable file |
| `downloadText` | string | No | Custom text for download button |
| `link` | string | No | External URL |
| `linkText` | string | No | Custom text for external link |
| `imageUrl` | string | No | URL to image |
| `imageAlt` | string | No | Alt text for image |

## Content Formatting

### Text Content
- Use `\n` for line breaks
- Start bullet points with `• ` (bullet + space)
- Content is automatically centered and sized based on level

### Redaction Markup
Wrap sensitive content in redaction tags:
```
"content": "This is public. [redact]This is sensitive.[/redact] This is public again."
```

### Hierarchy Levels
- **Level 1**: Main sections (largest font, darkest color)
- **Level 2**: Subsections (medium font, medium color)
- **Level 3**: Sub-subsections (smaller font, lighter color)
- **Level 4**: Details (smallest font, lightest color)

## Color Schemes

### Available Colors
- `red` - Red gradient family
- `blue` - Blue gradient family  
- `green` - Green gradient family
- `purple` - Purple gradient family
- `orange` - Orange gradient family
- `teal` - Teal gradient family

### Color Intensity by Level
Each color scheme has 4 intensity levels:
- Level 1: Darkest (600-700)
- Level 2: Medium-dark (400-500)
- Level 3: Medium-light (300-400)
- Level 4: Lightest (200-300)

## Example Slide Types

### Basic Text Slide
```json
{
  "id": "intro-1",
  "level": 1,
  "content": "I. Introduction to Our Topic",
  "type": "normal",
  "hidden": false,
  "colorScheme": "blue"
}
```

### Slide with Redacted Content
```json
{
  "id": "sensitive-info",
  "level": 2,
  "content": "A. Public Information\n[redact]This information is confidential until after the recording.[/redact]",
  "type": "sensitive",
  "hidden": true,
  "colorScheme": "red"
}
```

### Slide with Audio
```json
{
  "id": "audio-example",
  "level": 2,
  "content": "B. Listen to this example",
  "type": "normal",
  "hidden": false,
  "colorScheme": "green",
  "audioUrl": "https://example.com/audio.mp3"
}
```

### Slide with Download
```json
{
  "id": "download-slide",
  "level": 3,
  "content": "1. Additional Resources",
  "type": "normal",
  "hidden": false,
  "colorScheme": "purple",
  "downloadUrl": "https://example.com/guide.pdf",
  "downloadText": "Download Complete Guide (PDF)"
}
```

### Slide with External Link
```json
{
  "id": "link-slide",
  "level": 2,
  "content": "C. Learn More Online",
  "type": "normal",
  "hidden": false,
  "colorScheme": "orange",
  "link": "https://example.com/more-info",
  "linkText": "Visit Our Website"
}
```

### Slide with Image
```json
{
  "id": "image-slide",
  "level": 2,
  "content": "D. Visual Example",
  "type": "normal",
  "hidden": false,
  "colorScheme": "teal",
  "imageUrl": "https://example.com/image.jpg",
  "imageAlt": "Descriptive text for the image"
}
```

## Best Practices

### Hierarchy Organization
1. Use Level 1 for main sections (Roman numerals: I, II, III)
2. Use Level 2 for subsections (Letters: A, B, C)
3. Use Level 3 for sub-subsections (Numbers: 1, 2, 3)
4. Use Level 4 for detailed points (Letters: a, b, c)

### Color Scheme Strategy
- Assign different colors to major sections
- Keep related subsections in the same color family
- Use color progression to show content flow

### Content Guidelines
- Keep slide content concise and focused
- Use bullet points for lists
- Place sensitive information in redacted sections
- Provide meaningful alt text for images

### File Organization
- Use descriptive slide IDs
- Group related slides with similar ID prefixes
- Maintain consistent naming conventions

## Redaction Behavior

### Time-Based Redaction
- Content in `[redact][/redact]` tags is hidden before `recordingDate` + `recordingTime`
- After the recording time, redacted content becomes visible
- If `permanentRedaction` is true, content stays hidden permanently

### Sensitive Slides
- Slides with `"type": "sensitive"` can be toggled with the visibility button
- Use `"hidden": true` to hide sensitive slides by default
- Combine with redaction for maximum control

## Validation Checklist

Before uploading your JSON file:
- [ ] Valid JSON syntax
- [ ] All required fields present
- [ ] Unique slide IDs
- [ ] Valid date/time format
- [ ] Proper redaction markup syntax
- [ ] Valid color scheme names
- [ ] Working URLs for media/downloads
- [ ] Meaningful content hierarchy