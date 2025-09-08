# Online Course Dossier (Static Site)

A responsive static website that visually and interactively clones the Genially “Online Course Dossier” template. It includes animated sections, modals, an accordion, a timeline, a schedule grid, a testimonials carousel (API-powered), a theme switcher (light/dark), and an accessible, validated contact form. Also includes a matching themed Login page.

## Demo Structure
- `index.html` – Main site with sections: Hero, Objectives, Program, Faculty, Schedule, Students, Features, Attachments, Contact
- `login.html` – Themed login page with validation and theme persistence
- `styles.css` – Global styles, theme variables, responsive layout, animations
- `main.js` – Interactivity (navbar, accordion, modals, carousel, counters, scroll reveal), GSAP animations, API testimonials, theme persistence
- `login.js` – Login page validation and theme persistence
- `data/course.json` – Sample course data (Objectives, Program, Faculty, Schedule)
- `assets/` – SVG icons, avatars, wave, logo, and download placeholders

## Features
- Smooth scrolling and reveal-on-scroll animations
- Section cards with hover elevation and subtle transitions
- Objectives accordion (ARIA-enabled)
- Program timeline with modal details
- Faculty cards with modal bios
- Schedule grid with expandable slot details
- Students section with animated counters and carousel (auto-rotate + keyboard/controls)
- Features grid of icon cards
- Attachments with downloads and a PDF preview placeholder
- Contact form validation with inline errors
- Theme switcher (Light/Dark) with `localStorage` persistence and smooth color transitions
- GSAP animations for hero, cards, and timeline slide-ins
- API integration for testimonials (Quotable API) with graceful fallback
- Accessibility: semantic HTML5, ARIA labels, keyboard navigation (Tab/Enter/ESC), skip link, color-contrast aware dark theme

## Getting Started
### 1) Open directly (may restrict data fetch)
Double-click `index.html` to open in your browser.
- Note: Browsers may block `fetch()` of `data/course.json` on `file://`. If content doesn’t load, use a local server.

### 2) Run a local server (recommended)
- Python (Windows):
  ```bash
  py -m http.server 5500
  ```
  Visit: http://localhost:5500

- Node.js:
  ```bash
  npx serve -p 5500
  ```
  Visit: http://localhost:5500

- VS Code Live Server: Right-click `index.html` → “Open with Live Server”.

## Usage
- “Start” in the hero takes you to `login.html`.
- Use the “Dark/Light” toggle in the navbar to switch themes (persists).
- Scroll to see animations and interact with cards, timeline, schedule, and modals.

## Configuration
- Edit `data/course.json` to update objectives, program items, faculty, and schedule.
- Replace SVGs in `assets/` with your brand assets as needed.
- API for testimonials is loaded from Quotable (`https://api.quotable.io/quotes?limit=3`). Update or replace in `main.js > loadApiTestimonials()`.

## Tech Stack
- HTML5, CSS3 (no frameworks), vanilla JavaScript
- GSAP (from CDN) for animations
- Google Fonts: Montserrat (headings), Open Sans (body)

## Accessibility
- Landmarks: header, main, sections
- Keyboard support for modals (ESC), carousel (arrow keys), and accordions (Enter/Space)
- ARIA roles/labels for modals, carousel, accordion, and navigation
- Skip link at top for screen readers
- Dark mode uses colors that maintain legible contrast

## Project Structure
```
.
├─ index.html
├─ login.html
├─ styles.css
├─ main.js
├─ login.js
├─ data/
│  └─ course.json
└─ assets/
   ├─ logo.svg
   ├─ wave.svg
   ├─ avatar1.svg / avatar2.svg / avatar3.svg
   ├─ icon-video.svg / icon-infographic.svg / icon-quiz.svg / icon-embed.svg
   ├─ pdf-placeholder.svg
   ├─ sample.pdf / syllabus.pdf / resources.zip
```

## Notes
- This project is a static clone for educational/demo purposes inspired by Genially’s “Online Course Dossier”. Replace assets and text for production use.
- No build step required; everything runs in the browser.

## License
MIT – Feel free to use and adapt.
