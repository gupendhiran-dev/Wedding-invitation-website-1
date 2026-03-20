# Assets Folder

## images/
Place your wedding photos here and reference them in the HTML:
- `couple-bride.jpg`      → Bride's portrait (for Section 2)
- `couple-groom.jpg`      → Groom's portrait (for Section 2)
- `couple-together.jpg`   → Couple photo (for Thank You section)
- `gallery-1.jpg` ... `gallery-6.jpg` → Pre-wedding gallery photos
- `story-1.jpg` ... `story-4.jpg`     → Timeline story photos
- `venue.jpg`             → Optional venue exterior photo

## music/
Place your background music here:
- `background.mp3`        → Romantic background music

## How to add photos
In `index.html`, replace `.gallery-placeholder` divs or `.couple-photo.placeholder` divs with:
```html
<img src="assets/images/your-photo.jpg" alt="Description" />
```

And in `scroll-effects.js` or `styles.css`, reference them as:
```css
background-image: url('../assets/images/your-photo.jpg');
```
