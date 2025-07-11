# Pun Intensive Reader - File Management & Naming Guide

## File Upload Process

### Supported File Types
- **JSON files only** (`.json` extension)
- Maximum file size: 10MB (recommended: under 1MB for optimal performance)
- UTF-8 encoding required

### Upload Methods

#### 1. Admin Panel Upload
1. Navigate to `/admin` in your browser
2. Enter admin password (demo: `admin123`)
3. Use the "Upload JSON File" section
4. Select your `.json` file
5. File is automatically processed and made available

#### 2. Direct File Placement
For development or bulk uploads:
- Place files in `/public/presentations/` directory
- Files are automatically detected and available

## File Naming Conventions

### Recommended Naming Pattern
```
[category]-[topic]-[date].json
```

### Examples
- `meeting-quarterly-review-2024-01-15.json`
- `training-safety-protocols-2024-02-01.json`
- `presentation-product-launch-2024-03-10.json`
- `workshop-team-building-2024-01-20.json`

### Naming Rules
- **Use lowercase letters only**
- **Use hyphens (-) instead of spaces**
- **No special characters** except hyphens and periods
- **Include date** in YYYY-MM-DD format when relevant
- **Keep names descriptive** but under 50 characters
- **Avoid version numbers** in filename (use internal versioning)

## File Storage Structure

### Directory Organization
```
/public/presentations/
├── meetings/
│   ├── quarterly-review-2024-q1.json
│   ├── board-meeting-2024-01-15.json
│   └── team-standup-2024-01-20.json
├── training/
│   ├── onboarding-new-employees.json
│   ├── safety-protocols-2024.json
│   └── software-training-basics.json
├── presentations/
│   ├── product-launch-alpha.json
│   ├── client-proposal-acme-corp.json
│   └── conference-tech-summit-2024.json
└── workshops/
    ├── team-building-activities.json
    ├── creative-thinking-session.json
    └── problem-solving-workshop.json
```

## URL Access Patterns

### Direct Access URLs
Files are accessible at: `https://your-domain.com/r/[filename-without-extension]`

### Examples
| File Name | Access URL |
|-----------|------------|
| `demo.json` | `/r/demo` |
| `meeting-notes-2024-01-15.json` | `/r/meeting-notes-2024-01-15` |
| `training-safety.json` | `/r/training-safety` |
| `presentation-q1-results.json` | `/r/presentation-q1-results` |

## File Management Best Practices

### Organization Strategy
1. **Use consistent categories** (meetings, training, presentations, workshops)
2. **Include dates** for time-sensitive content
3. **Use descriptive names** that indicate content purpose
4. **Group related files** in subdirectories
5. **Archive old files** regularly to maintain performance

### Version Control
Instead of filename versioning, use internal JSON metadata:
```json
{
  "id": "product-launch-alpha",
  "version": "2.1",
  "lastModified": "2024-01-15T10:30:00Z",
  "title": "Product Launch Presentation - Alpha Version"
}
```

### Security Considerations
- **Sensitive files** should use the redaction system
- **Confidential content** should be marked with `"type": "sensitive"`
- **Time-sensitive information** should use proper recording dates
- **Access control** is managed through the visibility toggle system

## File Lifecycle Management

### Active Files
- Currently used presentations
- Keep in main directories
- Regular updates and maintenance

### Archived Files
- Move to `/archived/` subdirectory
- Keep for historical reference
- Remove from active navigation

### Deprecated Files
- Files no longer in use
- Move to `/deprecated/` subdirectory
- Consider removal after retention period

## Backup and Recovery

### Recommended Backup Strategy
1. **Daily backups** of all JSON files
2. **Version history** for critical presentations
3. **Cloud storage** integration for redundancy
4. **Export functionality** for local copies

### Recovery Procedures
1. **File corruption**: Restore from latest backup
2. **Accidental deletion**: Check backup archives
3. **Content loss**: Use version history if available
4. **System failure**: Restore entire presentation directory

## Performance Optimization

### File Size Guidelines
- **Optimal size**: Under 100KB per file
- **Maximum recommended**: 1MB per file
- **Large files**: Consider splitting into multiple presentations
- **Media content**: Use external URLs instead of embedding

### Loading Performance
- **Minimize slides**: Keep presentations focused
- **Optimize images**: Use compressed formats and external hosting
- **Reduce complexity**: Limit nested content and multimedia

## Troubleshooting Common Issues

### File Not Found (404 Error)
- Check filename spelling and case sensitivity
- Verify file is in correct directory
- Ensure `.json` extension is present in file but not in URL

### Invalid JSON Format
- Validate JSON syntax using online tools
- Check for missing commas, brackets, or quotes
- Verify proper escape characters in content

### Slow Loading
- Check file size (should be under 1MB)
- Verify external URLs are accessible
- Consider reducing number of slides

### Access Denied
- Verify file permissions
- Check if file is in correct directory
- Ensure proper authentication if required

## Migration and Import

### From Other Systems
1. **Export data** in JSON format
2. **Convert structure** to match required schema
3. **Validate content** using provided guidelines
4. **Test upload** with small sample first
5. **Bulk import** remaining files

### Data Conversion Tools
- Use provided JSON schema for validation
- Convert from PowerPoint, Google Slides, or other formats
- Maintain hierarchy and formatting during conversion
- Preserve multimedia references and links

## Monitoring and Analytics

### Usage Tracking
- Monitor file access patterns
- Track popular presentations
- Identify unused files for archival
- Analyze user engagement metrics

### Maintenance Schedule
- **Weekly**: Check for broken links and media
- **Monthly**: Review file organization and cleanup
- **Quarterly**: Archive old presentations
- **Annually**: Full system backup and optimization