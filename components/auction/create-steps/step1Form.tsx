import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Step1Form {
  currentStep: number;
  formData: any;
  goToPrevStep: () => void;
  goToNextStep: () => void;
  updateFormData: (data: any) => void;
}

export function Step1Form({
  formData,
  updateFormData,
  currentStep,
  goToPrevStep,
  goToNextStep
}: Step1Form) {
  const formSchema_1 = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(500),
    imageUrl: z.string().url("Must be a valid URL").optional(),
  });

  type FormValues_1 = z.infer<typeof formSchema_1>;

  const form_1 = useForm<FormValues_1>({
    resolver: zodResolver(formSchema_1),
    defaultValues: {
      title: formData.title || "",
      description: formData.description || "",
      imageUrl: formData.imageUrl || "",
    },
  });

  const onSubmit = (data: FormValues_1) => {
    updateFormData({
      ...data,
    });
    goToNextStep();
  };

  return (
    <Form {...form_1}>
      <form onSubmit={form_1.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form_1.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auction Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a title for your auction"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form_1.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what you're auctioning"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form_1.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artwork Image</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Paste image URL (https://...)"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            type="button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button type="submit">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
