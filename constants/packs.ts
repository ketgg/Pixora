import { PackType } from "@/types/pack"

export const PACKS: PackType[] = [
  {
    id: "explorer",
    name: "Explorer",
    credits: 1000,
    price: 10,
    description: "Perfect for exploring the platform.",
    features: [
      "Generate ~500 images with Schnell model.",
      "Generate ~100 images with Dev or Custom model.",
      "Train ~1-2 custom model",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    credits: 5000,
    price: 45,
    discount: 5,
    description: "For regular creators and small businesses.",
    features: [
      "Generate ~2500 images with Schnell model.",
      "Generate ~500 images with Dev or Custom model.",
      "Train ~7-8 custom models.",
    ],
  },
  {
    id: "visionary",
    name: "Visionary",
    credits: 15000,
    price: 120,
    discount: 30,
    description: "For power users and high-volume needs.",
    features: [
      "Generate ~7,500 images with Schnell model.",
      "Generate ~1,500 images with Dev or Custom model.",
      "Train ~23-24 custom models.",
    ],
  },
]
