'use client'

import { useState, useEffect } from 'react'

import { faqData } from '../data/schemas'
import { DataError } from './DataError'


export function FAQ() {
  const [isVisible, setIsVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="faq"
      className="relative py-20"
      style={{
        background: 'linear-gradient(135deg, #1a0f08 0%, #0f0704 50%, #1a0f08 100%)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-red-900/15 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-4xl">
        <div className="text-center mb-14">
          <div
            className={`inline-flex items-center gap-3 mb-6 transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-amber-200/80">Good to Know</span>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>

          <h2
            className={`text-5xl sm:text-6xl font-black leading-tight mb-6 text-amber-100 transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            Frequently Asked Questions
          </h2>

          <p
            className={`text-xl text-amber-200/90 leading-relaxed max-w-2xl mx-auto transform transition-all duration-1000 delay-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            Everything you need to know before we start developing
          </p>
        </div>

        <div
          className={`space-y-4 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          {faqData.error || !faqData.data ? (
            <DataError section="FAQ" details={faqData.error} />
          ) : (
          faqData.data.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="rounded-2xl border border-amber-200/15 bg-black/30 backdrop-blur-sm overflow-hidden transition-colors duration-300 hover:border-amber-200/30"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold text-amber-100">{faq.q}</span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full bg-amber-200/10 flex items-center justify-center text-amber-200 text-xl leading-none transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-all duration-500 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-amber-200/80 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            )
          })
          )}
        </div>
      </div>
    </section>
  )
}
