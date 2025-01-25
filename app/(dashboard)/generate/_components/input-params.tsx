"use client"

import React, { useState, useEffect } from "react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  RiAspectRatioLine,
  RiBox3Line,
  RiFileImageLine,
  RiHashtag,
  RiLandscapeLine,
  RiLoader4Line,
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

import { useGeneratedStore } from "@/store/use-generated-store"
import { Database, Tables } from "@/types/database"
import { REPLICATE_USERNAME } from "@/constants/replicate"

type Props = {
  userModels: Tables<"Models">[]
  modelIdVer?: string // modelId:VERSION
}

const recommendedInferenceSteps: Record<string, string> = {
  "black-forest-labs/flux-dev": "28-50",
  "black-forest-labs/flux-schnell": "3-4",
}

export const formSchema = z
  .object({
    modelName: z.string({
      required_error: "Model is required.",
    }),
    prompt: z.string({
      required_error: "Prompt is required.",
    }),
    aspectRatio: z.string({
      required_error: "Aspect ratio is required.",
    }),
    numOfOutputs: z
      .number()
      .min(1, { message: "Number of outputs should be at least 1." })
      .max(4, { message: "Number of outputs should be at max 4." }),
    numOfInferenceSteps: z
      .number()
      .min(1, {
        message: "Number of inference steps should be at least 1.",
      })
      .max(50, { message: "Number of inference steps should be at max 50." }),
    guidance: z
      .number()
      .min(0, { message: "Guidance can't be less than 0." })
      .max(10, {
        message: "Guidance can't be greater than 10.",
      })
      .optional(),
    guidanceScale: z
      .number()
      .min(0, { message: "Guidance scale can't be less than 0." })
      .max(10, {
        message: "Guidance scale can't be greater than 10.",
      })
      .optional(),
    outputFormat: z.string({
      required_error: "Output format is required.",
    }),
    outputQuality: z
      .number()
      .min(0, { message: "Output quality can't be less than 0." })
      .max(100, { message: "Output quality can't be greater than 100" }),
    goFast: z.boolean({
      required_error: "Go fast flag is required.",
    }),
    megapixels: z.string({
      required_error: "Megapixels is required.",
    }),
    loraScale: z
      .number()
      .min(-1, { message: "LoRA scale can't be less than -1." })
      .max(3, {
        message: "LoRA scale can't be greater than 3.",
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.modelName === "black-forest-labs/flux-dev" &&
        data.guidance === undefined
      )
        return false

      return true
    },
    {
      path: ["guidance"],
      message: "Guidance is required for black-forest-labs/flux-dev model.",
    },
  )

const InputParams = ({ userModels, modelIdVer }: Props) => {
  const generateImages = useGeneratedStore((state) => state.generateImages)
  const loading = useGeneratedStore((state) => state.loading)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: modelIdVer
        ? `${REPLICATE_USERNAME}/${modelIdVer}`
        : "black-forest-labs/flux-schnell",
      prompt: "",
      aspectRatio: "1:1",
      numOfOutputs: 1,
      numOfInferenceSteps: modelIdVer ? 28 : 4,
      guidance: 3.5,
      guidanceScale: 3.5,
      outputFormat: "webp",
      outputQuality: 80,
      goFast: true,
      megapixels: "1",
      loraScale: 1,
    },
  })
  const [isCustomModel, setIsCustomModel] = useState<boolean>(
    modelIdVer ? true : false,
  )
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "modelName") {
        let defaultSteps
        if (value.modelName === "black-forest-labs/flux-schnell") {
          setIsCustomModel(false)
          defaultSteps = 4
        } else if (value.modelName === "black-forest-labs/flux-dev") {
          setIsCustomModel(false)
          defaultSteps = 28
        } else {
          // Custom model
          setIsCustomModel(true)
          defaultSteps = 28
        }
        if (defaultSteps !== undefined)
          form.setValue("numOfInferenceSteps", defaultSteps)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleReset = () => {
    form.reset() // Reset to default values
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await generateImages(values)
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
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiBox3Line size={16} />
                <span>
                  model_name
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
                  <SelectItem value="black-forest-labs/flux-schnell">
                    black-forest-labs/flux-schnell
                  </SelectItem>
                  <SelectItem value="black-forest-labs/flux-dev">
                    black-forest-labs/flux-dev
                  </SelectItem>
                  {userModels.map(
                    (model) =>
                      model.trainingStatus === "SUCCEEDED" && (
                        <SelectItem
                          key={model.id}
                          value={`${REPLICATE_USERNAME}/${model.modelId}:${model.VERSION}`}
                        >
                          {model.modelName}
                        </SelectItem>
                      ),
                  )}
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
          render={({ field }) => {
            const modelId = form
              .getValues("modelName")
              .split("/")[1]
              .split(":")[0]
            const model = userModels.find((model) => model.modelId === modelId)
            return (
              <FormItem>
                <FormLabel className="flex flex-wrap items-center justify-between gap-2 font-mono">
                  {isCustomModel && (
                    <div className="text-info bg-info-alt border-info-border my-1 w-full border px-4 py-3 text-xs">
                      The trigger word for this model is{" "}
                      <span className="font-semibold">
                        {model?.triggerWord}
                      </span>
                      . Be sure to include in your prompt.
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <RiTextSnippet size={16} />
                    <span>
                      prompt
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
                        <kbd className="border bg-muted px-1 py-0.5">
                          Return
                        </kbd>
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
                <FormDescription>
                  Prompt to generate your image.
                  {isCustomModel &&
                    " If you include the `trigger_word` used in the training process you are more likely to activate the trained object, style, or concept in the resulting image."}{" "}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="aspectRatio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiAspectRatioLine size={16} />
                <span>aspect_ratio</span>
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
                <br />
                <span className="font-semibold">Default: "1:1"</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numOfOutputs"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiHashtag size={16} />
                <span>num_outputs</span>
                <span className="text-xs text-muted-foreground">integer</span>
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
              <FormDescription>
                Number of outputs to generate.
                <br />
                <span className="font-semibold">Default: 1</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numOfInferenceSteps"
          render={({ field }) => {
            const selectedModel = form.watch("modelName")
            const isSchnellModel =
              selectedModel === "black-forest-labs/flux-schnell"
            const recommendedSteps =
              recommendedInferenceSteps[selectedModel] || "28-50"
            return (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 font-mono">
                  <RiHashtag size={16} />
                  <span>num_inference_steps</span>
                  <span className="text-xs text-muted-foreground">integer</span>
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min={1}
                      max={isSchnellModel ? 4 : 50}
                      step={1}
                      {...field}
                      className="max-w-20"
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                    <Slider
                      defaultValue={[field.value]}
                      min={1}
                      max={isSchnellModel ? 4 : 50}
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
                  <br />
                  <span className="font-semibold">
                    Default: {isSchnellModel ? 4 : 28}
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        {isCustomModel && (
          <FormField
            control={form.control}
            name="guidanceScale"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 font-mono">
                    <RiHashtag size={16} />
                    <span>guidance_scale</span>
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
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                      <Slider
                        defaultValue={[field.value || 0]}
                        min={0}
                        max={10}
                        step={0.01}
                        value={[field.value || 0]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {
                      "Guidance scale for the diffusion process. Lower values can give more realistic images. Good values to try are 2, 2.5, 3 and 3.5"
                    }
                    <br />
                    <span className="font-semibold">Default: 3.5</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}
        {!isCustomModel && (
          <FormField
            control={form.control}
            name="guidance"
            render={({ field }) => {
              const selectedModel = form.watch("modelName")
              const isDevModel = selectedModel === "black-forest-labs/flux-dev"
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
                        disabled={!isDevModel}
                        type="number"
                        min={0}
                        max={10}
                        step={0.01}
                        {...field}
                        className="max-w-20"
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                      <Slider
                        disabled={!isDevModel}
                        defaultValue={[field.value || 0]}
                        min={0}
                        max={10}
                        step={0.01}
                        value={[field.value || 0]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {isDevModel
                      ? "Guidance for the diffusion process. Lower values can give more realistic images. Good values to try are 2, 2.5, 3 and 3.5 "
                      : "Guidance is not required for this model."}
                    <br />
                    <span className="font-semibold">Default: 3.5</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}
        <FormField
          control={form.control}
          name="outputFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiFileImageLine size={16} />
                <span>output_format</span>
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
                <br />
                <span className="font-semibold">Default: "webp"</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="outputQuality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <RiHashtag size={16} />
                <span>output_quality</span>
                <span className="text-xs text-muted-foreground">integer</span>
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
                <br />
                <span className="font-semibold">Default: 80</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goFast"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="flex items-center gap-1.5 font-mono">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <span>go_fast</span>
                <span className="text-xs text-muted-foreground">
                  {typeof field.value}
                </span>
              </FormLabel>
              <FormDescription>
                {
                  "Run faster predictions with model optimized for speed (currently fp8 quantized); disable to run in original bf16"
                }
                <br />
                <span className="font-semibold">Default: true</span>
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
                <br />
                <span className="font-semibold">Default: "1"</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isCustomModel && (
          <FormField
            control={form.control}
            name="loraScale"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 font-mono">
                  <RiHashtag size={16} />
                  <span>lora_scale</span>
                  <span className="text-xs text-muted-foreground">
                    {typeof field.value}
                  </span>
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min={-1}
                      max={3}
                      step={0.01}
                      {...field}
                      className="max-w-20"
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                    <Slider
                      defaultValue={[field.value || 1]}
                      min={-1}
                      max={3}
                      step={0.01}
                      value={[field.value || 1]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Determines how strongly the main LoRA should be applied. Sane
                  results between 0 and 1 for base inference. For go_fast we
                  apply a 1.5x multiplier to this value; we've generally seen
                  good performance when scaling the base value by that amount.
                  You may still need to experiment to find the best value for
                  your particular LoRA.
                  <br />
                  <span className="font-semibold">Default: 1</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background py-4">
          <Button type="button" onClick={handleReset} variant="outline">
            Reset
          </Button>
          <Button disabled={loading} type="submit">
            {loading && <RiLoader4Line className="animate-spin" />}
            {loading ? "Running" : "Run"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default InputParams
