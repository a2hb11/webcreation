// Captures showcase covers for the concept demos: 1440x900 viewport, JPEG.
// Usage: pnpm build && node scripts/capture-demos.mjs   (needs a built app)
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const PORT = process.env.PORT || String(3800 + Math.floor(Math.random() * 100))
const EXECUTABLE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const DEMOS = ['barq-detailing', 'sahwa-roasters', 'bayt-misk', 'marsa-chalets']
const LOCALES = ['en', 'ar']

const server = spawn('pnpm', ['start', '-p', PORT], { stdio: 'ignore' })
const ready = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/en`)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error('server did not start')
}

try {
  await ready()
  const browser = await chromium.launch({ executablePath: EXECUTABLE })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  for (const slug of DEMOS) {
    await mkdir(`public/demos/${slug}`, { recursive: true })
    for (const locale of LOCALES) {
      await page.goto(`http://127.0.0.1:${PORT}/${locale}/demo/${slug}`, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      // Hide the studio ribbon so the cover shows the client site only.
      await page.evaluate(() => { const el = document.querySelector('[data-demo] > div:first-child'); if (el) el.style.display = 'none' })
      await page.screenshot({ path: `public/demos/${slug}/cover-${locale}.jpg`, type: 'jpeg', quality: 82, fullPage: false })
      console.log(`captured ${slug} ${locale}`)
    }
  }
  await browser.close()
} finally {
  server.kill()
}
