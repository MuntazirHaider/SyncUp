"use client";

// form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
// route
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";
// hooks
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  fileUrl: z
    .string()
    .min(1, { message: "Attachment is required" })
    .refine(
      (data) => {
        try {
          const parsed = JSON.parse(data);
          return (
            typeof parsed === "object" &&
            parsed !== null &&
            typeof parsed.url === "string" &&
            parsed.url.trim() !== "" &&
            typeof parsed.type === "string" &&
            parsed.type.trim() !== "" &&
            typeof parsed.name === "string" &&
            parsed.type.trim() !== ""
          );
        } catch (error) {
          console.log(error);
          return false;
        }
      },
      { message: "Invalid file data format" }
    ),
});

const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;
  const router = useRouter();

  const isMOdalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: JSON.stringify({
        url: "",
        type: "",
        name: "",
      }),
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query: query,
      });
      await axios.post(url, {
        fileUrl: values.fileUrl,
      });
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isMOdalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="main">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
