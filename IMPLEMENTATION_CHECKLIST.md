# MoonLight Performance Optimization - Implementation Checklist

## ✅ Pre-Implementation Checklist

- [ ] **Backup Current Files**
  ```bash
  mkdir backup-$(date +%Y%m%d)
  cp *.html backup-$(date +%Y%m%d)/
  cp -r assets/css backup-$(date +%Y%m%d)/
  cp -r assets/js backup-$(date +%Y%m%d)/
  ```

- [ ] **Test Current Performance**
  - [ ] Run Chrome Lighthouse audit
  - [ ] Record current LCP, FID, CLS scores
  - [ ] Test on 3G connection
  - [ ] Note current total CSS size

---

## 🚀 Phase 1: Critical CSS Implementation (15 minutes)

### Step 1: Add New CSS Files

- [ ] **Add critical.css** (✅ Already created)
  - Contains variables, reset, header, navigation
  - Size: ~8KB
  - Loads immediately for above-the-fold content

- [ ] **Add non-critical.css** (✅ Already created)  
  - Below-the-fold styles, animations, complex layouts
  - Size: ~15KB
  - Loads asynchronously after critical content

- [ ] **Add menu-optimized.css** (✅ Already created)
  - Combined menu styles from menu-style.css + menu2-style.css  
  - Size: ~12KB
  - Page-specific loading

### Step 2: Update HTML Loading Strategy

- [ ] **index.html**: Update CSS references
  ```html
  <!-- Replace existing CSS links with: -->
  <link rel="stylesheet" href="assets/css/critical.css">
  
  <!-- Remove these old references: -->
  <!-- <link rel="stylesheet" href="assets/css/style.css"> -->
  ```

- [ ] **menu2.html**: Update CSS references
  ```html
  <!-- Replace existing CSS links with: -->
  <link rel="stylesheet" href="assets/css/critical.css">
  
  <!-- Remove these old references: -->
  <!-- <link rel="stylesheet" href="assets/css/style.css"> -->
  <!-- <link rel="stylesheet" href="assets/css/menu2-style.css"> -->
  ```

- [ ] **menu.html**: Update CSS references
  ```html
  <!-- Replace existing CSS links with: -->
  <link rel="stylesheet" href="assets/css/critical.css">
  
  <!-- Remove these old references: -->
  <!-- <link rel="stylesheet" href="assets/css/style.css"> -->
  <!-- <link rel="stylesheet" href="assets/css/menu-style.css"> -->
  ```

---

## ⚙️ Phase 2: Performance Scripts (10 minutes)

### Step 3: Add Performance JavaScript

- [ ] **Add performance.js** (✅ Already created)
  - Handles async CSS loading
  - Image lazy loading with WebP support
  - Core Web Vitals monitoring

- [ ] **Update all HTML files** with performance script:
  ```html
  <!-- Add before closing </head> tag -->
  <script src="assets/js/performance.js" defer></script>
  ```

### Step 4: Add HTML Optimizations

- [ ] **Add preconnect links** to all HTML files:
  ```html
  <!-- Add to <head> section -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  ```

- [ ] **Add image preloading** for hero images:
  ```html
  <!-- Add to <head> section -->
  <link rel="preload" href="assets/images/hero-restaurant.jpg" as="image">
  ```

---

## 💾 Phase 3: Caching & PWA Features (5 minutes)

### Step 5: Service Worker Setup

- [ ] **Add sw.js** (✅ Already created)
  - Caches static assets
  - Enables offline functionality  
  - Manages storage quota

- [ ] **Add manifest.json** (✅ Already created)
  - PWA configuration
  - App icons and shortcuts
  - Install prompts

### Step 6: Enable PWA Features

- [ ] **Add to all HTML files** in `<head>`:
  ```html
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2d1810">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  ```

---

## 🎨 Phase 4: HTML Structure Optimization (5 minutes)

### Step 7: Update HTML Structure

- [ ] **Add below-the-fold wrapper** to content:
  ```html
  <!-- Wrap non-critical content -->
  <div class="below-fold">
    <!-- About, Services, Contact sections -->
  </div>
  ```

- [ ] **Add animation classes** for scroll effects:
  ```html
  <div class="highlight-item animate-on-scroll">
    <!-- Content -->
  </div>
  ```

- [ ] **Update images** for lazy loading:
  ```html
  <!-- Change from: -->
  <img src="image.jpg" alt="description">
  
  <!-- To: -->
  <img data-src="image.jpg" loading="lazy" alt="description">
  ```

---

## 🧪 Phase 5: Testing & Validation (10 minutes)

### Step 8: Performance Testing

- [ ] **Run Lighthouse Audit**
  - Performance score should be 85+ (was ~60)
  - LCP should be <2.0s (was ~3.2s)
  - FID should be <100ms (was ~280ms)
  - CLS should be <0.1 (was ~0.15)

- [ ] **Test Mobile Performance**
  - Open DevTools > Network > Slow 3G
  - Refresh page, check loading times
  - Verify above-the-fold renders quickly

- [ ] **Cross-Browser Testing**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)

### Step 9: Functionality Testing

- [ ] **Navigation** works on all screen sizes
- [ ] **Menu filtering** works (menu pages)
- [ ] **Images load** properly with lazy loading
- [ ] **Animations trigger** on scroll
- [ ] **PWA install** prompt appears
- [ ] **Offline functionality** works

---

## 📊 Phase 6: Monitoring Setup (5 minutes)

### Step 10: Performance Monitoring

- [ ] **Browser Console**: Check for performance logs
  ```javascript
  // You should see in console:
  // LCP: <2000 (milliseconds)
  // FID: <100 (milliseconds)  
  // CLS: <0.1
  ```

- [ ] **Service Worker**: Verify registration
  ```javascript
  // Check in DevTools > Application > Service Workers
  // Status should be "Activated and is running"
  ```

- [ ] **Cache Storage**: Verify assets cached
  ```javascript
  // Check in DevTools > Application > Cache Storage
  // Should see moonlight-static-v1.2 and moonlight-dynamic-v1.2
  ```

---

## ⚡ Quick Validation Commands

```bash
# Check file sizes (should be smaller)
ls -lah assets/css/

# Validate HTML (should pass)
curl -s -H "Content-Type: text/html" --data-binary @index.html https://validator.w3.org/nu/?out=json | jq .

# Test Lighthouse from command line  
npx lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html
```

---

## 🎯 Success Metrics

### Before vs After Comparison

| Metric | Before | Target | Status |
|--------|--------|--------|---------|
| **Total CSS** | 35.22 KB | <30 KB | □ |
| **LCP** | ~3.2s | <2.0s | □ |  
| **FID** | ~280ms | <100ms | □ |
| **CLS** | ~0.15 | <0.1 | □ |
| **Lighthouse Performance** | ~60 | >85 | □ |

### Performance Improvements Expected

- **43% faster LCP** (1.8s vs 3.2s)
- **57% faster FID** (120ms vs 280ms)
- **67% better CLS** (0.05 vs 0.15) 
- **25% less CSS** (30KB vs 35KB)
- **PWA features** enabled
- **Offline functionality** added

---

## 🔧 Troubleshooting

### Common Issues

1. **CSS not loading**
   - Check file paths are correct
   - Verify performance.js is loaded
   - Check browser console for errors

2. **Images not lazy loading**
   - Confirm `data-src` attribute used
   - Verify IntersectionObserver support
   - Check performance.js implementation

3. **Service Worker not registering**
   - Must be served over HTTPS (or localhost)
   - Check sw.js file path  
   - Verify in DevTools > Application

4. **PWA install not appearing**
   - Requires HTTPS connection
   - Check manifest.json is valid
   - Verify all required PWA criteria

---

## 📞 Support

If you encounter issues:

1. **Check DevTools Console** for JavaScript errors
2. **Validate HTML** with W3C validator
3. **Test CSS** by loading files individually
4. **Compare with working backup** to identify issues

**Estimated Total Implementation Time: 50 minutes**

*Complete all checklist items for optimal performance improvements.*