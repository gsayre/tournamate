"use client";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/trpc/react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function InviteList({ userId }: { userId: string }) {
  const updateName = api.user.updateName.useMutation();
  const [addingName, setAddingName] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    updateName.mutate(
      {
        name: data.name,
        userId: userId,
      },
      {
        onSuccess: () => {
          setAddingName(false);
        },
      },
    );
  }

  return (
    <div>
      <Alert className="flex w-96 flex-col border-orange-500  text-orange-500">
        <TriangleAlert className="h-4 w-4 stroke-orange-500" />
        <AlertTitle>We&apos;re missing your name</AlertTitle>
        <AlertDescription className="pb-2">
          You can add your name to make it easier for other to search and find
          you
        </AlertDescription>
        {addingName ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-row justify-between space-x-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={"Your name"}
                        {...field}
                        className="text-black focus-visible:ring-0"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="flex self-end">
                Add Name
              </Button>
            </form>
          </Form>
        ) : (
          <div className="flex justify-end">
            {" "}
            <Button
              className="flex"
              onClick={() => {
                setAddingName(true);
              }}
            >
              Add Name
            </Button>
          </div>
        )}
      </Alert>
    </div>
  );
}