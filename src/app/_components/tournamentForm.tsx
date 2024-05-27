"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/trpc/react";

const formSchema = z.object({
  tournamentName: z.string(),
  firstDayDate: z.date({
    required_error: "Date of first day is required",
  }),
  dayOneFormat: z.enum([
    "none",
    "same sex doubles",
    "coed doubles",
    "reverse coed doubles",
    "same sex sixes",
    "coed sixes",
    "reverse coed quads",
    "same sex triples",
  ]),
  secondDayDate: z
    .date({
      required_error: "Date of first day is required",
    })
    .optional(),
  dayTwoFormat: z
    .enum([
      "none",
      "same sex doubles",
      "coed doubles",
      "reverse coed doubles",
      "same sex sixes",
      "coed sixes",
      "reverse coed quads",
      "same sex triples",
    ])
    .optional(),
  duration: z.enum(["one", "two"], {
    required_error: "You need to select how many days your tournament is.",
  }),
});

const formats = [
  { label: "Same Sex Doubles", value: "same sex doubles" },
  { label: "Coed Doubles", value: "coed doubles" },
  { label: "Reverse Coed Doubles", value: "reverse coed doubles" },
] as const;

export function TournamentForm({ userId }: { userId: string }) {
  const createTournament = api.director.createTournament.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: "",
      firstDayDate: new Date(),
      dayOneFormat: "same sex doubles",
      secondDayDate: new Date(),
      dayTwoFormat: "reverse coed doubles",
      duration: "one",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (data.duration === "one") {
      createTournament.mutate({
        name: data.tournamentName,
        tournamentDirectorId: userId,
        dayOneDate: data.firstDayDate,
        dayTwoDate: undefined,
        dayOneFormat: data.dayOneFormat,
        dayTwoFormat: "none",
      });
    } else if (data.duration === "two") {
      createTournament.mutate({
        name: data.tournamentName,
        dayTwo: true,
        tournamentDirectorId: userId,
        dayOneDate: data.firstDayDate,
        dayOneFormat: data.dayOneFormat,
        dayTwoDate: data.secondDayDate,
        dayTwoFormat: data.dayTwoFormat,
      });
    } else {
      throw new Error("Invalid duration value");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tournamentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament Name</FormLabel>
              <FormControl>
                <Input placeholder="Tournament Name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How many days is your tournament?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-1"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="one" />
                    </FormControl>
                    <FormLabel className="font-normal">One Day</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="two" />
                    </FormControl>
                    <FormLabel className="font-normal">Two Days</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row space-x-2">
          <FormField
            control={form.control}
            name="firstDayDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>First Day Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dayOneFormat"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Day One Format</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? formats.find(
                              (format) => format.value === field.value,
                            )?.label
                          : "Select format"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandList>
                        <CommandInput placeholder="Search format..." />
                        <CommandEmpty>No format found.</CommandEmpty>
                        <CommandGroup>
                          {formats.map((format) => (
                            <CommandItem
                              value={format.label}
                              key={format.value}
                              onSelect={() => {
                                form.setValue("dayOneFormat", format.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  format.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {format.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {form.getValues().duration === "two" && (
          <div className="flex flex-row space-x-2">
            <FormField
              control={form.control}
              name="secondDayDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Second Day Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dayTwoFormat"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Day Two Format</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? formats.find(
                                (format) => format.value === field.value,
                              )?.label
                            : "Select format"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search format..." />
                        <CommandEmpty>No format found.</CommandEmpty>
                        <CommandGroup>
                          {formats.map((format) => (
                            <CommandItem
                              value={format.label}
                              key={format.value}
                              onSelect={() => {
                                form.setValue("dayTwoFormat", format.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  format.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {format.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit">Create Tournament</Button>
      </form>
    </Form>
  );
}
