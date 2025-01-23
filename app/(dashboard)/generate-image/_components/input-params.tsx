"use client"

import React from "react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  RiAspectRatioLine,
  RiBox3Line,
  RiFileImageLine,
  RiHashtag,
  RiLandscapeLine,
  RiMenuLine,
  RiTextBlock,
  RiTextSnippet,
} from "@remixicon/react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

type Props = {}

// const input = {
//   prompt: "black forest gateau cake spelling out the words \"FLUX SCHNELL\", tasty, food photography, dynamic shot",
//   go_fast: true,
//   megapixels: "1",
//   num_outputs: 1,
//   aspect_ratio: "1:1",
//   output_format: "webp",
//   output_quality: 80,
//   num_inference_steps: 4
// };

// input = {
//   prompt: "black forest gateau cake spelling out the words \"FLUX DEV\", tasty, food photography, dynamic shot",
//   go_fast: true,
//   guidance: 3.5,
//   megapixels: "1",
//   num_outputs: 1,
//   aspect_ratio: "1:1",
//   output_format: "webp",
//   output_quality: 80,
//   num_inference_steps: 28
// };

const recommendedInferenceSteps: Record<string, string> = {
  "black-forest-labs/flux-dev": "28-50",
  "black-forest-labs/flux-schnell": "3-4",
}

const formSchema = z.object({
  model: z.string({
    required_error: "Model is required.",
  }),
  prompt: z.string({
    required_error: "Prompt is required.",
  }),
  aspect_ratio: z.string({
    required_error: "Aspect ratio is required.",
  }),
  num_outputs: z
    .number()
    .min(1, { message: "Number of outputs should be at least 1." })
    .max(4, { message: "Number of outputs should be at max 4." }),
  num_inference_steps: z
    .number()
    .min(1, {
      message: "Number of inference steps should be at least 1.",
    })
    .max(50, { message: "Number of inference steps should be at max 50." }),
  guidance: z
    .number({
      required_error: "Guidance scale is required.",
    })
    .min(0, { message: "Guidance can't be less than 0." })
    .max(10, {
      message: "Guidance can't be greater than 10.",
    }),
  output_format: z.string({
    required_error: "Output format is required.",
  }),
  output_quality: z
    .number()
    .min(0, { message: "Output quality can't be less than 0." })
    .max(100, { message: "Output quality can't be greater than 100" }),
  go_fast: z.boolean({
    required_error: "Go fast flag is required.",
  }),
  megapixels: z.string({
    required_error: "Megapixels is required.",
  }),
})

const InputParams = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "black-forest-labs/flux-dev",
      prompt: "",
      aspect_ratio: "1:1",
      num_outputs: 1,
      num_inference_steps: 28,
      guidance: 3.5,
      output_format: "webp",
      output_quality: 80,
      go_fast: true,
      megapixels: "1",
    },
  })

  const handleReset = () => {
    form.reset() // Reset to default values
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <Form {...form}>
      <form
        onKeyDown={(event) => {
          // TODO
          if (event.key === "Enter" && event.ctrlKey) {
            // Trigger form submission on Ctrl+Enter
            form.handleSubmit(onSubmit)()
          }
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiBox3Line size={16} />
                <span>
                  {field.name}
                  <sup className="text-destructive">*</sup>
                </span>
                <span className="text-xs text-muted-foreground">
                  {typeof field.value}
                </span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="black-forest-labs/flux-dev">
                    black-forest-labs/flux-dev
                  </SelectItem>
                  <SelectItem value="black-forest-labs/flux-schnell">
                    black-forest-labs/flux-schnell
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Selected model will be used to generate your image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-wrap items-center justify-between gap-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <RiTextSnippet size={16} />
                  <span>
                    {field.name}
                    <sup className="text-destructive">*</sup>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {typeof field.value}
                  </span>
                </div>
                <div className="hidden md:block">
                  <span className="translate-y-0 text-xs text-muted-foreground opacity-100 transition-all">
                    <span translate="no">
                      <kbd className="border bg-muted px-1 py-0.5">Shift</kbd>
                      <kbd className="px-1 py-0.5">+</kbd>
                      <kbd className="border bg-muted px-1 py-0.5">Return</kbd>
                    </span>
                    <span> for a new line</span>
                  </span>
                </div>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your prompt"
                  className="resize-none overflow-hidden text-sm"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = "auto" // Reset height
                    target.style.height = `${target.scrollHeight}px` // Set to scroll height
                  }}
                  {...field}
                />
              </FormControl>
              <FormDescription>Prompt to generate your image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aspect_ratio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiAspectRatioLine size={16} />
                <span>{field.name}</span>
                <span className="text-xs text-muted-foreground">
                  {typeof field.value}
                </span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an aspect ratio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1:1">1:1</SelectItem>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="21:9">21:9</SelectItem>
                  <SelectItem value="3:2">3:2</SelectItem>
                  <SelectItem value="2:3">2:3</SelectItem>
                  <SelectItem value="4:5">4:5</SelectItem>
                  <SelectItem value="5:4">5:4</SelectItem>
                  <SelectItem value="3:4">3:4</SelectItem>
                  <SelectItem value="9:16">9:16</SelectItem>
                  <SelectItem value="9:21">9:21</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Aspect ratio for the generated image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="num_outputs"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiHashtag size={16} />
                <span>{field.name}</span>
                <span className="text-xs text-muted-foreground">
                  {typeof field.value}
                </span>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={1}
                    max={4}
                    step={1}
                    {...field}
                    className="max-w-20"
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                  <Slider
                    defaultValue={[field.value]}
                    min={1}
                    max={4}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </div>
              </FormControl>
              <FormDescription>Number of outputs to generate.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="num_inference_steps"
          render={({ field }) => {
            const selectedModel = form.watch("model")
            const recommendedSteps =
              recommendedInferenceSteps[selectedModel] || "-"
            return (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 font-mono">
                  <RiHashtag size={16} />
                  <span>{field.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {typeof field.value}
                  </span>
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      step={1}
                      {...field}
                      className="max-w-20"
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                    <Slider
                      defaultValue={[field.value]}
                      min={1}
                      max={50}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Number of denoising steps. Recommended range is{" "}
                  {recommendedSteps}, and lower number of steps produce lower
                  quality outputs, faster.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="guidance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiHashtag size={16} />
                <span>{field.name}</span>
                <span className="text-xs text-muted-foreground">
                  {typeof field.value}
                </span>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    step={0.01}
                    {...field}
                    className="max-w-20"
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                  <Slider
                    defaultValue={[field.value]}
                    min={0}
                    max={10}
                    step={0.01}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </div>
              </FormControl>
              <FormDescription>Guidance for generated image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="output_format"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiFileImageLine size={16} />
                <span>{field.name}</span>
                <span className="text-xs text-muted-foreground">
                  {typeof field.value}
                </span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Format of the output image(s)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="webp">webp</SelectItem>
                  <SelectItem value="jpg">jpg</SelectItem>
                  <SelectItem value="png">png</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {`Format of the output image(s)`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="output_quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiHashtag size={16} />
                <span>{field.name}</span>
                <span className="text-xs text-muted-foreground">
                  {typeof field.value}
                </span>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    {...field}
                    className="max-w-20"
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                  <Slider
                    defaultValue={[field.value]}
                    min={0}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Quality when saving the output images, from 0 to 100. 100 is
                best quality, 0 is lowest quality. Not relevant for .png
                outputs.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="go_fast"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <span>{field.name}</span>
                <span className="text-xs text-muted-foreground">
                  {typeof field.value}
                </span>
              </FormLabel>
              <FormDescription>
                {
                  "Run faster predictions with model optimized for speed (currently fp8 quantized); disable to run in original bf16"
                }
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="megapixels"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiLandscapeLine size={16} />
                <span>{field.name}</span>
                <span className="text-xs text-muted-foreground">
                  {typeof field.value}
                </span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Approximate number of megapixels" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="0.25">0.25</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Approximate number of megapixels for generated image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background py-4">
          <Button type="button" onClick={handleReset} variant="outline">
            Reset
          </Button>
          <Button type="submit">Run</Button>
        </div>
      </form>
    </Form>
  )
}

export default InputParams
