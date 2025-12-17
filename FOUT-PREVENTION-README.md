# FOUT Prevention System

This document explains the Flash of Unstyled Text (FOUT) prevention system implemented across all HTML pages on the Thomas Grist website.

## Overview

FOUT occurs when web fonts load after the page has already rendered with fallback fonts, causing a visible "flash" as text changes appearance. Our system eliminates this by:

1. **Preloading fonts** with high priority
2. **Controlling visibility** until fonts are ready
3. **Detecting font loading** with JavaScript
4. **Providing fallbacks** for accessibility

## System Components

### 1. Font Preloading
```html
<!-- Preload critical fonts to prevent FOUT -->
<link rel="preload" href="fonts/Apercu-Light.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/Apercu-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

### 2. Critical CSS
```html
<style>
    /* Critical inline styles to prevent FOUT */
    .font-loading body {
        visibility: hidden;
    }
    .fonts-loaded body,
    .no-js body {
        visibility: visible;
    }
</style>
```

### 3. Font Loading Detection
```html
<script src="font-loading.js"></script>
```

### 4. CSS Font Declarations (in styles.css)
```css
@font-face {
    font-family: 'Apercu';
    src: url('fonts/Apercu-Light.woff2') format('woff2'),
         url('fonts/Apercu-Light.woff') format('woff');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Apercu';
    src: url('fonts/Apercu-Regular.woff2') format('woff2'),
         url('fonts/Apercu-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

## How It Works

1. **Page Load**: HTML loads with `.font-loading` class on `<html>` element
2. **Visibility Hidden**: Body is hidden via CSS until fonts load
3. **Font Preloading**: Browser begins downloading fonts immediately
4. **Font Detection**: JavaScript monitors font loading status
5. **Visibility Restored**: Once fonts load, `.fonts-loaded` class is added and content becomes visible
6. **Timeout Fallback**: Content shows after 3 seconds maximum, even if fonts fail

## Accessibility Features

- **No-JS Fallback**: Content shows immediately if JavaScript is disabled
- **Timeout Protection**: Never hides content for more than 3 seconds
- **Progressive Enhancement**: Works without fonts, better with fonts
- **Screen Reader Friendly**: No impact on assistive technologies

## Performance Benefits

- **No Layout Shift**: Prevents cumulative layout shift (CLS) issues
- **Faster Perceived Load**: No visual font swapping
- **Session Storage**: Remembers loaded fonts for subsequent pages
- **Parallel Loading**: Fonts load alongside other resources

## Files Updated

All HTML pages now include the FOUT prevention system:
- ✅ `index.html`
- ✅ `audi.html`
- ✅ `whereby.html`
- ✅ `deltatre.html`
- ✅ `rio-esg.html`
- ✅ `sky-comcast.html`
- ✅ `speechmatics-ai.html`
- ✅ `case-study-template.html`
- ✅ `case-study-tabs-archive.html`
- ✅ `backlog.html`
- ✅ `success.html`

## Creating New Pages

### Use the Template
Copy `new-page-template.html` as your starting point. This includes all FOUT prevention measures pre-configured.

### Manual Implementation
If creating a page from scratch, add these elements in order:

1. **After `<title>` and favicon:**
```html
<!-- Preload critical fonts to prevent FOUT -->
<link rel="preload" href="fonts/Apercu-Light.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/Apercu-Regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font loading optimization -->
<style>
    /* Critical inline styles to prevent FOUT */
    .font-loading body {
        visibility: hidden;
    }
    .fonts-loaded body,
    .no-js body {
        visibility: visible;
    }
</style>
```

2. **After main stylesheet:**
```html
<!-- Font loading detection -->
<script src="font-loading.js"></script>
```

## Testing

### Manual Testing
1. Open browser with slow network throttling
2. Load page - should not see font swapping
3. Disable JavaScript - content should still appear
4. Clear cache and reload - first visit behavior

### Performance Testing
- **Lighthouse**: Check for CLS (Cumulative Layout Shift) scores
- **WebPageTest**: Monitor font loading waterfall
- **Chrome DevTools**: Network tab for font loading timing

## Troubleshooting

### Common Issues

**Fonts not loading:**
- Check file paths are correct
- Verify CORS headers for font files
- Ensure WOFF2 files exist

**Content not showing:**
- Check JavaScript console for errors
- Verify `font-loading.js` is loading properly
- Confirm CSS classes are applied correctly

**Performance issues:**
- Monitor font file sizes
- Check preload is working (Network tab)
- Verify session storage functionality

## Maintenance

### Adding New Fonts
1. Add `@font-face` declarations to `styles.css`
2. Add preload links to all HTML pages
3. Update `font-loading.js` with new font detection
4. Update this documentation

### Font File Updates
1. Replace font files in `/fonts/` directory
2. Update version numbers if using cache busting
3. Test across all pages
4. Update preload URLs if filenames change

## Browser Support

- **Modern browsers**: Full support with FontFace API
- **Older browsers**: Graceful degradation with timeout fallback
- **No JavaScript**: Content shows immediately
- **Slow connections**: 3-second maximum wait time

## Performance Metrics

Expected improvements:
- **CLS**: Reduced to near-zero
- **FCP**: Slightly delayed but more stable
- **LCP**: More consistent timing
- **User Experience**: No visible font swapping 