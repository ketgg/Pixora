import Link from "next/link"
import React from "react"
import { RiHeartFill } from "@remixicon/react"

const Footer = () => {
  return (
    <section id="footer" className="border-b">
      <div className="container-wrapper">
        <div className="container flex flex-col items-center justify-center gap-6 p-4">
          <div className="flex w-full items-center justify-center gap-4">
            <p className="flex items-center gap-1 px-0 text-base text-muted-foreground md:px-6">
              Built with
              <RiHeartFill
                size={20}
                className="hover:cursor-pointer hover:fill-rose-500"
              />
              by{" "}
              <Link
                href="https://x.com/kettogg"
                className="underline underline-offset-2 hover:decoration-4 hover:underline-offset-4"
              >
                Ketto
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer
