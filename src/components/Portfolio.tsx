'use client'

import { motion } from 'framer-motion'

import workProduction from '../assets/unsplash/work-production.jpg'
import workCamera from '../assets/unsplash/work-camera.jpg'
import workEditing from '../assets/unsplash/work-editing.jpg'
import workStudio from '../assets/unsplash/work-studio.jpg'
import workColor from '../assets/unsplash/work-color.jpg'
import workScreen from '../assets/unsplash/work-screen.jpg'

type Work = {
  image: string
  category: string
  title: string
  description: string
  /** Tailwind grid span classes for the asymmetric bento layout */
  span: string
}

export function Portfolio() {
  const works: Work[] = [
    {
      image: workProduction,
      category: 'Commercial',
      title: 'On-Set Production',
      description: 'End-to-end creative direction for brand campaigns.',
      span: 'lg:col-span-2 lg:row-span-2',
    },
    {
      image: workCamera,
      category: 'Cinematography',
      title: 'Cinematic Capture',
      description: 'Visually rich storytelling with a filmic finish.',
      span: 'lg:col-span-1 lg:row-span-1',
    },
    {
      image: workColor,
      category: 'Color',
      title: 'Color Grading',
      description: 'Signature looks crafted for every frame.',
      span: 'lg:col-span-1 lg:row-span-1',
    },
    {
      image: workEditing,
      category: 'Post-Production',
      title: 'Edit & Sound',
      description: 'Precise editing and immersive audio design.',
      span: 'lg:col-span-1 lg:row-span-2',
    },
    {
      image: workStudio,
      category: 'Studio',
      title: 'Studio Sessions',
      description: 'Controlled environments for premium results.',
      span: 'lg:col-span-2 lg:row-span-1',
    },
    {
      image: workScreen,
      category: 'Delivery',
      title: 'Multi-Format Delivery',
      description: 'Optimized cuts for every screen and platform.',
      span: 'lg:col-span-1 lg:row-span-1',
    },
  ]

  return (
    <section id="portfolio" className="relative py-32 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
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

        {/* Featured Video */}
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

        {/* Immersive Bento Gallery */}
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px] gap-5">
          {works.map((work, index) => (
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
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
        </div>
      </div>
    </section>
  )
}
