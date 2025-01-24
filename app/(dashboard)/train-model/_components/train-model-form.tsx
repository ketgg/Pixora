"use client"

import React, { useEffect, useRef, useState, useId } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  RiAspectRatioLine,
  RiBox3Line,
  RiFolderZipLine,
  RiHashtag,
  RiLoader4Line,
  RiSettings2Line,
  RiSettings3Line,
  RiSettings4Line,
  RiText,
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
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getPreSignedStorageUrl } from "@/actions/storage"

const VALID_ZIP_FILES = ["application/x-zip-compressed", "application/zip"]
const MAX_FILE_SIZE = 45 * 1024 * 1024

const modelNameRegex = /^(?![-_.])[a-z0-9-_.]*(?<![-_.])$/

const formSchema = z.object({
  modelName: z
    .string({
      required_error: "Model name is required.",
    })
    .min(1, { message: "Model name cannot be empty." }) // Ensure the field is not empty
    .regex(modelNameRegex, {
      message:
        "Enter a valid name. This value may contain only lowercase letters, numbers, dashes, underscores, or periods, and may not start or end with a dash, underscore, or period.",
    }),
  zipFile: z
    .instanceof(File, { message: "Please select a valid file." })
    .refine(
      (file) => file.type && VALID_ZIP_FILES.includes(file.type),
      "Only ZIP files are accepted.",
    )
    .refine(
      (file) => file.size < MAX_FILE_SIZE,
      "Max file size allowed is 45 MB.",
    ),
  triggerWord: z.string().optional(),
  autocaption: z.boolean().optional(),
  autocaptionPrefix: z.string().optional(),
  autocaptionSuffix: z.string().optional(),
  steps: z
    .number()
    .min(3, { message: "Minimum number of steps should be 3." })
    .max(6000, { message: "Maximum number of steps cannot exceed 6000." })
    .optional(),
  loraRank: z
    .number()
    .min(1, { message: "Minimum LoRA rank should be 1." })
    .max(128, { message: "Maximum LoRA rank is 128." })
    .optional(),
  learningRate: z.number().optional(),
  batchSize: z
    .number()
    .min(1, { message: "Batch size should be greater than 1." })
    .optional(),
  resolution: z.string().optional(),
  captionDropoutRate: z
    .number()
    .min(0, { message: "Caption dropout rate should be greater than 0." })
    .max(1, { message: "Caption dropout rate should not exceed 1." })
    .optional(),
  optimizer: z.string().optional(),
  cacheLatentsToDisk: z.boolean().optional(),
  layersToOptimizeRegex: z.string().optional(),
  gradientCheckpointing: z.boolean().optional(),
})

type Props = {}

const TrainModelForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: "",
      zipFile: undefined,
      triggerWord: "TOK",
      autocaption: true,
      autocaptionPrefix: "",
      autocaptionSuffix: "",
      steps: 1000,
      loraRank: 16,
      learningRate: 0.0004,
      batchSize: 1,
      resolution: "512,768,1024",
      captionDropoutRate: 0.05,
      optimizer: "adamw8bit",
      cacheLatentsToDisk: false,
      layersToOptimizeRegex: "",
      gradientCheckpointing: false,
    },
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue("zipFile", file)
      setFileName(file.name)
      form.clearErrors("zipFile")
    }
  }

  const { watch, setValue } = form
  const batchSize = watch("batchSize")
  // Automatically set gradientCheckpointing to true if batchSize > 1
  useEffect(() => {
    if (batchSize && batchSize > 1) {
      setValue("gradientCheckpointing", true)
    } else {
      setValue("gradientCheckpointing", false)
    }
  }, [batchSize, setValue])

  const handleReset = () => {
    form.reset()
  }

  const toastId = useId()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    toast.loading("Uploading training data...", { id: toastId })
    try {
      const data = await getPreSignedStorageUrl(values.zipFile.name)
      // console.log("@SIGNED_URL", data)
      if (data.error) {
        toast.error(data.error || "Failed to get the upload URL.", {
          id: toastId,
        })
        return
      }

      // Upload the file using presigned URL
      const urlResponse = await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": values.zipFile.type,
        },
        body: values.zipFile,
      })

      if (!urlResponse.ok) {
        throw new Error("Upload Failed.")
      }

      const res = await urlResponse.json()
      toast.success("Training data uploaded successfully!", {
        id: toastId,
      })

      const apiData = {
        fileKey: res.Key,
        ...values,
      }
      const apiResponse = await fetch("/api/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(apiData),
      })

      const apiResult = await apiResponse.json()
      if (!apiResponse.ok || apiResult?.error) {
        throw new Error(apiResult?.error || "Failed to train the model.")
      }
      toast.success(
        "Training started successfully! You'll get a notification once its finished.",
        { id: toastId },
      )
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Something went wrong in uploading training data."
      toast.error(errMsg, { id: toastId, duration: 4000 })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="space-y-6">
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
                <FormControl>
                  <Input placeholder="Enter a model name" {...field} />
                </FormControl>
                <FormDescription>
                  Pick a short and memorable name, like{" "}
                  <span className="font-mono">pixora-model</span>. You can use
                  lower case characters, digits, periods, underscores and
                  dashes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 font-mono">
                  <RiFolderZipLine size={16} />
                  <span>
                    input_images
                    <sup className="text-destructive">*</sup>
                  </span>
                  <span className="text-xs text-muted-foreground">zip</span>
                </FormLabel>
                <FormControl>
                  <div className="flex w-full max-w-xl items-center gap-2">
                    <input
                      type="file"
                      accept=".zip"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleFileButtonClick}
                    >
                      Upload File
                    </Button>
                    {fileName && ( // Display the file name if a file is selected
                      <span className="text-sm text-muted-foreground">
                        {fileName}
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  {
                    "A zip file containing the images that will be used for training. We recommend a minimum of 10 images. If you include captions, include them as one .txt file per image, e.g. my-photo.jpg should have a caption file named my-photo.txt. If you don't include captions, you can use autocaptioning (enabled by default)."
                  }
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="triggerWord"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 font-mono">
                  <RiTextSnippet size={16} />
                  <span>trigger_word</span>
                  <span className="text-xs text-muted-foreground">
                    {typeof field.value}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter a model name" {...field} />
                </FormControl>
                <FormDescription>
                  The trigger word refers to the object, style or concept you
                  are training on. Pick a string that isn’t a real word, like
                  TOK or something related to what’s being trained, like
                  CYBRPNK. The trigger word you specify here will be associated
                  with all images during training. Then when you use your LoRA,
                  you can include the trigger word in prompts to help activate
                  the LoRA.
                  <br />
                  <span className="font-semibold">Default: "TOK"</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="autocaption"
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
                  Automatically caption images using Llava v1.5 13B
                  <br />
                  <span className="font-semibold">Default: true</span>
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="autocaptionPrefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 font-mono">
                  <RiTextSnippet size={16} />
                  <span>autocaption_prefix</span>
                  <span className="text-xs text-muted-foreground">
                    {typeof field.value}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  <span className="font-semibold">Optional:</span> Text you want
                  to appear at the beginning of all your generated captions; for
                  example, &apos;a photo of TOK,&apos;. You can include your
                  trigger word in the prefix. Prefixes help set the right
                  context for your captions, and the captioner will use this
                  prefix as context.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="autocaptionSuffix"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 font-mono">
                  <RiTextSnippet size={16} />
                  <span>autocaption_suffix</span>
                  <span className="text-xs text-muted-foreground">
                    {typeof field.value}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  <span className="font-semibold">Optional:</span> Text you want
                  to appear at the end of all your generated captions; for
                  example, &apos;in the style of TOK&apos;. You can include your
                  trigger word in suffixes. Suffixes help set the right concept
                  for your captions, and the captioner will use this suffix as
                  context.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="steps"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between gap-2 font-mono">
                  <div className="flex items-center gap-1.5">
                    <RiHashtag size={16} />
                    <span>steps</span>
                    <span className="text-xs text-muted-foreground">
                      integer
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {"(minimum: 3, maximum: 6000)"}
                  </div>
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min={3}
                      max={6000}
                      step={1}
                      {...field}
                      className="max-w-24"
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                    <Slider
                      defaultValue={[field.value || 1000]}
                      min={4}
                      max={6000}
                      step={1}
                      value={[field.value || 1000]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Number of training steps. Recommended range is 500-4000.
                  <br />
                  <span className="font-semibold">Default: 1000</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loraRank"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between gap-2 font-mono">
                  <div className="flex items-center gap-1.5">
                    <RiHashtag size={16} />
                    <span>steps</span>
                    <span className="text-xs text-muted-foreground">
                      integer
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {"(minimum: 1, maximum: 128)"}
                  </div>
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min={1}
                      max={128}
                      step={1}
                      {...field}
                      className="max-w-24"
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                    <Slider
                      defaultValue={[field.value || 16]}
                      min={1}
                      max={128}
                      step={1}
                      value={[field.value || 16]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Higher ranks take longer to train but can capture more complex
                  features. Caption quality is more important for higher ranks.
                  <br />
                  <span className="font-semibold">Default: 16</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Accordion className="mb-4 mt-2" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-freigeist text-base">
              Show advanced inputs
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              <FormField
                control={form.control}
                name="learningRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between gap-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <RiHashtag size={16} />
                        <span>learning_rate</span>
                        <span className="text-xs text-muted-foreground">
                          number
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          step={0.01}
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Learning rate, if you're new to training you probably
                      don't need to change this.
                      <br />
                      <span className="font-semibold">Default: 0.0004</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batchSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between gap-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <RiHashtag size={16} />
                        <span>batch_size</span>
                        <span className="text-xs text-muted-foreground">
                          integer
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          min={1}
                          step={1}
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Batch size, you can leave this as 1
                      <br />
                      <span className="font-semibold">Default: 1</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 font-mono">
                      <RiAspectRatioLine size={16} />
                      <span>resolution</span>
                      <span className="text-xs text-muted-foreground">
                        string
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Image resolutions for training
                      <br />
                      <span className="font-semibold">
                        Default: "512,768,1024"
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="captionDropoutRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between gap-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <RiHashtag size={16} />
                        <span>caption_dropout_rate</span>
                        <span className="text-xs text-muted-foreground">
                          number
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {"(minimum: 0, maximum:1)"}
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          min={0}
                          max={1}
                          step={0.01}
                          {...field}
                          className="max-w-24"
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                        <Slider
                          defaultValue={[field.value || 0.05]}
                          min={0}
                          max={1}
                          step={0.01}
                          value={[field.value || 0.05]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Advanced setting. Determines how often a caption is
                      ignored. 0.05 means for 5% of all steps an image will be
                      used without its caption. 0 means always use captions,
                      while 1 means never use them. Dropping captions helps
                      capture more details of an image, and can prevent
                      over-fitting words with specific image elements. Try
                      higher values when training a style.
                      <br />
                      <span className="font-semibold">Default: 0.05</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 font-mono">
                      <RiSettings3Line size={16} />
                      <span>optimizer</span>
                      <span className="text-xs text-muted-foreground">
                        string
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Optimizer to use for training. Supports: prodigy,
                      adam8bit, adamw8bit, lion8bit, adam, adamw, lion, adagrad,
                      adafactor.
                      <br />
                      <span className="font-semibold">
                        Default: "adamw8bit"
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cacheLatentsToDisk"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="flex items-center gap-1.5 font-mono">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span>cache_latents_to_disk</span>
                      <span className="text-xs text-muted-foreground">
                        {typeof field.value}
                      </span>
                    </FormLabel>
                    <FormDescription>
                      Use this if you have lots of input images and you hit out
                      of memory errors
                      <br />
                      <span className="font-semibold">Default: false</span>
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="layersToOptimizeRegex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 font-mono">
                      <RiTextSnippet size={16} />
                      <span>layers_to_optimize_regex</span>
                      <span className="text-xs text-muted-foreground">
                        string
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      {
                        "Regular expression to match specific layers to optimize. Optimizing fewer layers results in shorter training times, but can also result in a weaker LoRA. For example, To target layers 7, 12, 16, 20 which seems to create good likeness with faster training (as discovered by lux in the Ostris discord, inspired by The Last Ben), use `transformer.single_transformer_blocks.(7|12|16|20).proj_out`."
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gradientCheckpointing"
                render={({ field }) => {
                  return (
                    <FormItem className="">
                      <FormLabel className="flex items-center gap-1.5 font-mono">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <span>gradient_checkpointing</span>
                        <span className="text-xs text-muted-foreground">
                          {typeof field.value}
                        </span>
                      </FormLabel>
                      <FormDescription>
                        Turn on gradient checkpointing; saves memory at the cost
                        of training speed. Automatically enabled for batch sizes
                        &gt; 1.
                        <br />
                        <span className="font-semibold">Default: false</span>
                      </FormDescription>
                    </FormItem>
                  )
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background py-4">
          <Button type="button" onClick={handleReset} variant="outline">
            Reset
          </Button>
          <Button disabled={false} type="submit">
            {false && <RiLoader4Line className="animate-spin" />}
            {false ? "Running" : "Create training"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TrainModelForm
