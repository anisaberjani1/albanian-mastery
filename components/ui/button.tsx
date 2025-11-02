import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 tracking-wide uppercase shadow-sm focus-visible:ring-[3px] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)]",
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110 border-b-4 border-[color-mix(in_srgb,var(--primary)_60%,black_20%)] active:border-b-0 shadow-[0_4px_12px_rgba(17,70,143,0.25)]",
        primaryOutline:
          "bg-[var(--background)] text-[var(--primary)] border-2 border-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_5%,white_95%)] shadow-none",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:brightness-110 border-b-4 border-[color-mix(in_srgb,var(--secondary)_60%,black_20%)] active:border-b-0 shadow-[0_4px_12px_rgba(218,18,18,0.25)]",
        secondaryOutline:
          "bg-[var(--background)] text-[var(--secondary)] border-2 border-[var(--secondary)] hover:bg-[color-mix(in_srgb,var(--secondary)_5%,white_95%)]",
        ghost:
          "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] border-0",
        danger: "bg-rose-500 text-white hover:bg-rose-600",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }
