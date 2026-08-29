interface DataErrorProps {
  /** Section name shown to the user, e.g. "FAQ" */
  section: string
  /** Validation issue details (shown muted, may be null) */
  details?: string | null
}

/**
 * Fallback card rendered when a section's data fails zod validation.
 * Styled to match the darkroom/amber theme.
 */
export function DataError({ section, details }: DataErrorProps) {
  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-amber-200/15 bg-black/30 backdrop-blur-sm px-8 py-12 text-center">
      <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-amber-200/10 flex items-center justify-center text-amber-200 text-2xl leading-none">
        !
      </div>
      <h3 className="text-xl font-bold text-amber-100 mb-3">
        {section} content is temporarily unavailable
      </h3>
      <p className="text-amber-200/70 leading-relaxed mb-4">
        We're having trouble loading this section. Please try refreshing the
        page or check back soon.
      </p>
      {details && (
        <p className="text-xs text-amber-200/40 font-mono break-words">
          {details}
        </p>
      )}
    </div>
  )
}
