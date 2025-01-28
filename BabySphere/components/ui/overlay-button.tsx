import * as React from "react"
import { cn } from "../../lib/utils"

export interface OverlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

const OverlayButton = React.forwardRef<HTMLButtonElement, OverlayButtonProps>(
  ({ className, active, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full p-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          active ? "bg-[#B4E3A7] text-[#8AA9B8]" : "bg-black/50 text-white hover:bg-black/70",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
OverlayButton.displayName = "OverlayButton"

export { OverlayButton }

