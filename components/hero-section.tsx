import React from "react"
import { Button } from "@/components/ui/button"
import { Header } from "./header"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      className="flex flex-col items-center text-center relative mx-auto rounded-2xl overflow-hidden my-6 py-0 px-4
         w-full h-[400px] md:w-[1220px] md:h-[600px] lg:h-[810px] md:px-0"
    >
      {/* Lightweight CSS background replacement for heavy SVG (improves paint/repain performance) */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none">
        soft gradient layer
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-transparent" />

        subtle grid using CSS repeating gradients — far cheaper than many SVG nodes + filters
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 36px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 36px)',
            mixBlendMode: 'overlay',
          }}
        />
      </div> */}

      {/* Header positioned at top of hero container */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Header />
      </div>

      <div className="relative z-10 space-y-4 md:space-y-5 lg:space-y-6 mb-6 md:mb-7 lg:mb-9 max-w-md md:max-w-[500px] lg:max-w-[588px] mt-16 md:mt-[120px] lg:mt-[160px] px-4">
        <h1 className="text-foreground text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight">
          Intelligent Expense Management
        </h1>
        <p className="text-muted-foreground text-base md:text-base lg:text-lg font-medium leading-relaxed max-w-lg mx-auto">
          Transform your spending with AI-powered insights, automated categorization, and smart budgeting that learns your habits.
        </p>
      </div>

      <Link href="https://vercel.com/home" target="_blank" rel="noopener noreferrer">
        <Button className="relative z-10 bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-3 rounded-full font-medium text-base shadow-lg ring-1 ring-primary/20">
          Start Free Trial
        </Button>
      </Link>
    </section>
  )
}
