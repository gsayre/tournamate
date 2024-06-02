"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  divisionName: z.string().min(1, "Name is required"),
  divisionType: z.enum(["MENS", "WOMEN", "COED", "REVCO"]),
});

export default function AddDivisionForm({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const addDivision = api.division.addDivision.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      divisionName: "",
      divisionType: "MENS",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    addDivision.mutate(
      {
        tournamentId: parseInt(tournamentId),
        divisionName: data.divisionName,
        divisionType: data.divisionType,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
        <div className="flex flex-col">
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="divisionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"Name"}
                      {...field}
                      className="text-black focus-visible:ring-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="divisionType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Division Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="MENS" />
                        </FormControl>
                        <FormLabel className="font-normal">Mens</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="WOMEN" />
                        </FormControl>
                        <FormLabel className="font-normal">Womens</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="COED" />
                        </FormControl>
                        <FormLabel className="font-normal">Coed</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="REVCO" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Reverse Coed
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="flex self-end">
            Add Division
          </Button>
        </div>
      </form>
    </Form>
  );
}
