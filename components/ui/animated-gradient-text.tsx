import { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface AnimatedGradientTextProps
  extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
}

export function AnimatedGradientText({
  children,
  className,
  ...props
}: AnimatedGradientTextProps) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center bg-background/75 px-4 py-1.5 text-sm font-medium backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] dark:bg-black/40",
        className,
      )}
      {...props}
    >
      <div
        className={`animate-gradient absolute inset-0 block h-full w-full border border-transparent bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] [border-radius:inherit] ![mask-composite:subtract] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]`}
      />

      {children}
    </div>
  )
}
