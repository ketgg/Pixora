import Image from "next/image"

import React from "react"
import { cn } from "@/lib/utils"

import { Marquee } from "../ui/marquee"
import { AnimatedGradientText } from "../ui/animated-gradient-text"

const reviews = [
  {
    name: "Jack Smith",
    username: "@jacksmith",
    body: "The dating profile photos I received transformed my online presence and boosted my matches significantly. Truly a game changer!",
    img: "/avatars/01.jpg",
  },
  {
    name: "Jill Smith",
    username: "@jillsmith",
    body: "I was completely blown away by the results. This service exceeded all my expectations. Absolutely amazing!",
    img: "/avatars/02.jpg",
  },
  {
    name: "John Doe",
    username: "@johndoe",
    body: "Using Pixora for my LinkedIn profile was a fantastic decision. The quality was outstanding, and I got multiple job offers!",
    img: "/avatars/04.jpg",
  },
  {
    name: "Jane Doe",
    username: "@janedoe",
    body: "Words can't express how thrilled I am with the results. This service is simply phenomenal. I love it!",
    img: "/avatars/03.jpg",
  },
  {
    name: "Jenny Mandell",
    username: "@jennymandell",
    body: "I can't find the words to describe how impressed I am. This service is truly remarkable. I love it!",
    img: "/avatars/05.jpg",
  },
  {
    name: "James Cameron",
    username: "@jamescameron",
    body: "I am genuinely amazed by the quality of the photos. This service is a game changer for anyone looking to enhance their profile!",
    img: "/avatars/06.jpg",
  },
]
const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative flex w-80 cursor-pointer flex-col justify-between overflow-hidden border p-4 sm:p-6",

        "bg-muted/70 hover:bg-muted/80",
      )}
    >
      <blockquote className="text-sm">{body}</blockquote>
      <div className="mt-2 flex flex-row items-center gap-2">
        <Image
          className="aspect-square rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
    </figure>
  )
}

const Testimonials = () => {
  return (
    <section id="testimonials" className="border-b">
      <div className="container-wrapper">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 pb-10 pt-24">
          <div className="flex flex-col items-center justify-center gap-4">
            <AnimatedGradientText className="pointer-events-auto">
              <span
                className={cn(
                  `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
              >
                Testimonials
              </span>
            </AnimatedGradientText>
            <h2 className="font-grotesk px-0 text-center text-3xl font-bold md:px-6 md:text-4xl lg:px-0">
              What Our Users Say
            </h2>
            <p className="px-0 text-base text-muted-foreground md:px-6 lg:max-w-[75%]">
              Discover why people are choosing Pixora for effortless,
              high-quality photo generation, from Linkedin headshots to vibrant
              social media content.
            </p>
          </div>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden pb-24">
          <Marquee
            pauseOnHover
            className="mt-1 [--duration:30s] [--gap:1rem] sm:mt-4 sm:[--gap:2rem]"
          >
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee
            reverse
            pauseOnHover
            className="mt-1 [--duration:30s] [--gap:1rem] sm:mt-4 sm:[--gap:2rem]"
          >
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background sm:w-1/4"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background sm:w-1/4"></div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
