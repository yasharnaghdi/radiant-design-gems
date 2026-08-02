'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import workProduction from '../assets/unsplash/work-production.jpg'
import workCamera from '../assets/unsplash/work-camera.jpg'
import workEditing from '../assets/unsplash/work-editing.jpg'
import workStudio from '../assets/unsplash/work-studio.jpg'
import workColor from '../assets/unsplash/work-color.jpg'
import workScreen from '../assets/unsplash/work-screen.jpg'
import worksData from '../data/portfolio.json'

type Work = {
  image: string
  category: string
  title: string
  description: string
  /** Tailwind grid span classes for the asymmetric bento layout */
  span: string
}

const STORAGE_KEY = 'portfolio-filter'
const ALL = 'All'

const imageMap: Record<string, string> = {
  'work-production': workProduction,
  'work-camera': workCamera,
  'work-editing': workEditing,
  'work-studio': workStudio,
  'work-color': workColor,
  'work-screen': workScreen,
}

const works: Work[] = worksData.map((w) => ({
  ...w,
  image: imageMap[w.image],
}))


const categories = [ALL, ...Array.from(new Set(works.map((w) => w.category)))]

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<string>(ALL)

  // Restore persisted filter after mount (guard against removed categories)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored && categories.includes(stored)) {
        setActiveFilter(stored)
      }
    } catch {
      /* ignore storage access errors */
    }
  }, [])

  const handleFilter = (category: string) => {
    setActiveFilter(category)
    try {
      window.localStorage.setItem(STORAGE_KEY, category)
    } catch {
      /* ignore storage access errors */
    }
  }

  const visibleWorks =
    activeFilter === ALL
      ? works
      : works.filter((w) => w.category === activeFilter)

  const showFeatured = activeFilter === ALL

  return (
    <section id="portfolio" className="relative py-32 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              Featured Work
            </span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8">
            <span className="block mb-2">Creative Productions</span>
          </h2>

          <p className="text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            A selection of frames from our craft — directed, shot, graded and
            delivered for screens of every size.
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-4 z-30 mb-16 flex justify-center">
          <div className="glass-effect rounded-full p-2 flex flex-wrap justify-center gap-2 backdrop-blur-md max-w-full">
            {categories.map((category) => {
              const isActive = activeFilter === category
              return (
                <button
                  key={category}
                  onClick={() => handleFilter(category)}
                  aria-pressed={isActive}
                  className={`gentle-animation rounded-full px-5 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-accent-purple text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured Video */}
        <AnimatePresence>
          {showFeatured && (
            <motion.div
              key="featured-video"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="max-w-6xl mx-auto">
                <div className="relative bg-card clean-border rounded-3xl overflow-hidden elevated-shadow">
                  <div className="relative">
                    <div className="aspect-video">
                      <iframe
                        src="https://www.youtube.com/embed/fIbDWDh6aYw?rel=0&showinfo=0&modestbranding=1"
                        title="Hampton Commercial - The Lonely Journey"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full rounded-t-3xl"
                      />
                    </div>

                    <div className="absolute top-6 right-6">
                      <span className="glass-effect rounded-xl px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                        Latest Project
                      </span>
                    </div>
                  </div>

                  <div className="p-8 lg:p-12">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-accent-purple/10 text-accent-purple px-3 py-1 rounded-full text-sm font-medium">
                          Commercial
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Client: Hampton
                        </span>
                      </div>

                      <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        The Lonely Journey
                      </h3>

                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        A powerful commercial exploring the isolation that startup founders face and how joining Hampton's community can transform that journey. This piece captures the emotional weight of entrepreneurship and the relief that comes with finding your tribe.
                      </p>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block">Industry</span>
                          <span className="font-medium">Community Platform</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Style</span>
                          <span className="font-medium">Narrative Drama</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Tone</span>
                          <span className="font-medium">Emotional Journey</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Format</span>
                          <span className="font-medium">Digital Commercial</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Immersive Bento Gallery */}
        <div
          className={`max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px] gap-5 ${
            showFeatured ? 'mt-20' : ''
          }`}
        >
          <AnimatePresence mode="popLayout">
            {visibleWorks.map((work) => (
              <motion.figure
                layout
                key={work.title}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative min-h-[260px] rounded-2xl overflow-hidden clean-border elevated-shadow ${work.span}`}
              >
                <img
                  src={work.image}
                  alt={work.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                {/* Base wash for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                {/* Hover sheen */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent-purple/30 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-block bg-white/15 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium mb-3 tracking-wide">
                    {work.category}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">
                    {work.title}
                  </h3>
                  <p className="text-sm text-white/0 max-h-0 overflow-hidden transition-all duration-500 group-hover:text-white/80 group-hover:max-h-20 leading-relaxed">
                    {work.description}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
