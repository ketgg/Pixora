import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import Navigation from "@/components/root/navigation"
import Hero from "@/components/root/hero"
import Features from "@/components/root/features"
import Testimonials from "@/components/root/testimonials"
import Pricing from "@/components/root/pricing"
import Faqs from "@/components/root/faqs"
import Footer from "@/components/root/footer"

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navigation />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <Faqs />
        <section id="pricing" className="border-b">
          <div className="container-wrapper bg-muted">
            <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <h2 className="font-grotesk px-0 text-center text-3xl font-bold md:px-6 md:text-4xl lg:px-0">
                  Ready to Transform your Photos?
                </h2>
                <p className="px-0 text-base text-muted-foreground md:px-6 lg:max-w-[75%]">
                  Join hundreds of users who are already creating amazing
                  AI-generated images.
                </p>
                <Link href="/login" className="pointer-events-auto">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex items-center hover:bg-primary/100"
                  >
                    <div>Get Started Now!</div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  )
}
