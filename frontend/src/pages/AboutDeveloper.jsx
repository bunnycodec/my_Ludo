/* About the Developer — a small credits page. Built as a template: the photo,
 * bio, and social links are placeholders until the user supplies real content
 * in a later refining pass (see the TODO markers below). */

import { Card } from '../components'

// TODO(refine): replace with the real photo (e.g. import from src/assets and pass
// its path here), bio, and profile URLs.
const DEVELOPER = {
  name: 'Your Name Here',
  tagline: 'Builder of this Ludo app for the family',
  bio:
    "This app was hand-built from scratch — backend, frontend, and everything in " +
    'between — as a way to bring the family together for a game night, no matter ' +
    "which city everyone's in. Replace this paragraph with your own story: what " +
    'you do, why you built this, whatever feels right.',
  photoUrl: null, // e.g. '/developer-photo.jpg' once you have one
  githubUrl: null, // e.g. 'https://github.com/your-username'
  linkedinUrl: null, // e.g. 'https://linkedin.com/in/your-profile'
}

function SocialLink({ href, label, icon }) {
  const filled = Boolean(href)
  return (
    <a
      href={filled ? href : undefined}
      target={filled ? '_blank' : undefined}
      rel={filled ? 'noreferrer' : undefined}
      aria-disabled={!filled}
      title={filled ? label : `${label} link coming soon`}
      className={`flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-bold transition-colors ${
        filled ? 'bg-white text-ink hover:bg-parchment' : 'cursor-default bg-parchment/60 text-ink-soft'
      }`}
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
          {DEVELOPER.photoUrl ? (
            <img
              src={DEVELOPER.photoUrl}
              alt={DEVELOPER.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-parchment text-3xl font-extrabold text-ink-soft"
              aria-hidden="true"
            >
              ?
            </div>
          )}
          <div>
            <h2 className="text-xl font-extrabold">{DEVELOPER.name}</h2>
            <p className="text-sm font-semibold text-ink-soft">{DEVELOPER.tagline}</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink">{DEVELOPER.bio}</p>

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
        </div>
        {!DEVELOPER.githubUrl && !DEVELOPER.linkedinUrl && (
          <p className="mt-3 text-xs text-ink-soft">Links go live once added — coming soon.</p>
        )}
      </Card>
    </div>
  )
}
