/* About the Developer — Sunny's credits page, plus a short intro to the game
 * itself. The photo ships as a web-optimized copy in src/assets (the original
 * stays out of the repo). */

import { Card } from '../components'
import photo from '../assets/developer.jpg'

const DEVELOPER = {
  name: 'Sunny Kumar',
  tagline: 'Developer · bunnycodec.com',
  githubUrl: 'https://github.com/bunnycodec',
  linkedinUrl: 'https://www.linkedin.com/in/bunnycodec/',
  websiteUrl: 'https://bunnycodec.com',
}

function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-parchment"
    >
      {icon}
      {label}
    </a>
  )
}

export default function AboutDeveloper() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold">About the Developer</h1>

      <Card>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <img
            src={photo}
            alt="Sunny Kumar"
            className="h-24 w-24 shrink-0 rounded-full border-2 border-line object-cover"
          />
          <div>
            <h2 className="text-xl font-extrabold">{DEVELOPER.name}</h2>
            <p className="text-sm font-semibold text-ink-soft">{DEVELOPER.tagline}</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink">
          The architecture and design of Codec Ludo are my own work — the game flow, the
          rules, the data model, and how it all looks and feels. During coding, Claude
          Code (Anthropic's AI coding tool) was actively used, with every phase reviewed
          and signed off before it landed.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <SocialLink
            href={DEVELOPER.githubUrl}
            label="GitHub"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
            }
          />
          <SocialLink
            href={DEVELOPER.linkedinUrl}
            label="LinkedIn"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M0 1.15C0 .51.53 0 1.19 0h13.62C15.47 0 16 .51 16 1.15v13.7c0 .64-.53 1.15-1.19 1.15H1.19C.53 16 0 15.49 0 14.85V1.15ZM4.75 13.4V6.17H2.4v7.23h2.35Zm-1.17-8.22c.82 0 1.33-.54 1.33-1.22-.01-.7-.51-1.23-1.32-1.23-.8 0-1.33.53-1.33 1.23 0 .68.51 1.22 1.3 1.22h.02Zm4.9 8.22V9.36c0-.24.02-.48.09-.65.19-.48.63-.98 1.37-.98.97 0 1.35.74 1.35 1.82v3.85h2.35V9.28c0-2.17-1.16-3.18-2.71-3.18-1.25 0-1.81.69-2.12 1.17h.02v-1h-2.35c.03.66 0 7.13 0 7.13h2.35Z" />
              </svg>
            }
          />
          <SocialLink
            href={DEVELOPER.websiteUrl}
            label="Website"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" />
                <ellipse cx="8" cy="8" rx="3" ry="6.5" />
                <path d="M1.5 8h13M2.4 4.75h11.2M2.4 11.25h11.2" />
              </svg>
            }
          />
        </div>
      </Card>

      <Card title="About Codec Ludo">
        <p className="text-sm leading-relaxed text-ink">
          Codec Ludo is classic, strict-rules Ludo for 2 to 4 players, played live in the
          browser. The server rolls every die and validates every move, so nobody can
          cheat from their own screen. Finished games count only after the admin confirms
          them, and every confirmed result feeds the all-time leaderboard. It's invite
          only — there's no public signup; every account is created by the admin.
        </p>
      </Card>
    </div>
  )
}
