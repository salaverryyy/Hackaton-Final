import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "yesflex yesh-10 yesw-full yesrounded-md yesborder yesborder-input yesbg-background yespx-3 yespy-2 yestext-base yesring-offset-background file:yesborder-0 file:yesbg-transparent file:yestext-sm file:yesfont-medium file:yestext-foreground placeholder:yestext-muted-foreground focus-visible:yesoutline-none focus-visible:yesring-2 focus-visible:yesring-ring focus-visible:yesring-offset-2 disabled:yescursor-not-allowed disabled:yesopacity-50 md:yestext-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
