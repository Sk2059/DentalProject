import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-[8px] border border-[#CBD5E1] bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(42,168,153,0.18)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
