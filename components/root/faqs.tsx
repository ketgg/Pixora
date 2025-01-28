import Link from "next/link"

import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { cn } from "@/lib/utils"

import { AnimatedGradientText } from "../ui/animated-gradient-text"
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "../ui/accordion"

const faqsList = [
  {
    question: "How does Pixora work?",
    answer:
      "Pixora uses Flux and Flux LoRA models to analyze and understand your photos. It then generates new images based on your features and the scenarios you choose, creating realistic and personalized results.",
  },
  {
    question: "Is my data safe with Pixora?",
    answer:
      "Yes, we take data privacy very seriously. All uploaded photos and generated images are encrypted and stored securely. We never share your personal data or images with third parties without your explicit consent.",
  },
  {
    question: "How many photos do I need to upload for best results?",
    answer:
      "For optimal results, we recommend uploading at least 10-20 diverse photos of yourself. This helps AI model better understand your features and expressions, leading to more accurate and realistic generated images.",
  },
  {
    question: "Can I use Pixora for commercial purposes?",
    answer:
      "Yes, our Creator and Visionary packs include commercial usage rights for the images you generate. However, please note that you should always respect copyright and privacy laws when using AI-generated images.",
  },
  {
    question: "Do you offer free credits for new users?",
    answer: "Yes, we offer free 10 credits for new users.",
  },
]

const Question = ({
  question,
  answer,
}: {
  question: string
  answer: string
}) => {
  return (
    <AccordionItem value={question} className="">
      <AccordionTrigger className="text-left">{question}</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        {answer}
      </AccordionContent>
    </AccordionItem>
  )
}

type Props = {}

const Faqs = (props: Props) => {
  return (
    <section id="faqs" className="border-b">
      <div className="container-wrapper">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-24">
          <div className="flex flex-col items-center justify-center gap-4">
            <AnimatedGradientText className="pointer-events-auto">
              <span
                className={cn(
                  `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
              >
                FAQs
              </span>
            </AnimatedGradientText>
            <h2 className="font-grotesk px-0 text-center text-3xl font-bold md:px-6 md:text-4xl lg:px-0">
              Frequently Asked Questions
            </h2>
            <p className="px-0 text-base text-muted-foreground md:px-6 lg:max-w-[75%]">
              Here are some of the most frequently asked questions about out
              product.
            </p>
          </div>
          <Accordion
            type="single"
            collapsible
            className="mx-auto w-full max-w-4xl"
          >
            {faqsList.map((faq) => {
              return <Question key={faq.question} {...faq} />
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default Faqs
