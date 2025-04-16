"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePicker } from "../ui/DateTimePicker";
import { TransactionType } from "@/lib/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { tObject } from "@/lib/types/transactionObject";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { addAndUpdateTransactions } from "@/app/_action";
import { Input } from "../ui/input";
import { GroupCategories } from "@/lib/types/categories";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

const formSchema = z.object({
  amount: z.number().min(1, {
    message: "Amount can't be negative. It can be Expense or Income",
  }),
  time: z.date().refine((val) => !val || val <= new Date(), {
    message: "Date can't be in the future",
  }),
  type: z.enum(["INCOME", "EXPENSE"], {
    errorMap: () => ({ message: "Type is required" }),
  }),
  category: z.object({
    id: z.string().min(1, {
      message: "Category is required",
    }),
    name: z.string().min(1, {
      message: "Category is required",
    }),
  }),
  description: z.string().optional(),
});

export default function TransactionModal({
  categoryList,
  currentTransaction,
  setCurrentTransaction,
}: {
  categoryList: GroupCategories;
  currentTransaction: (tObject & { modalType: "ADD" | "UPDATE" }) | null;
  setCurrentTransaction: React.Dispatch<
    React.SetStateAction<(tObject & { modalType: "ADD" | "UPDATE" }) | null>
  >;
}) {
  const [isLoading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      time: new Date(),
      type: "INCOME",
      category: {
        id: "",
        name: "",
      },
      description: "",
    },
  });
  useEffect(() => {
    if (currentTransaction) {
      form.setValue("amount", currentTransaction.amount);
      form.setValue("time", new Date(currentTransaction.time));
      form.setValue("type", currentTransaction.type);
      form.setValue("category", {
        id: currentTransaction.category.id,
        name: currentTransaction.category.name,
      });
      form.setValue("description", currentTransaction.description || "");
    }
  }, [currentTransaction, form]);

  async function onSubmit() {
    const data = form.getValues();
    setLoading(true);
    await addAndUpdateTransactions({ id: currentTransaction?.id, ...data });
    setCurrentTransaction(null);
    setLoading(false);
    form.reset();
  }
  return (
    <Dialog
      open={currentTransaction !== null}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          setCurrentTransaction(null);
          form.reset();
        }
      }}
    >
      <DialogContent>
        <DialogTitle>
          {currentTransaction?.modalType === "UPDATE" ? "Update" : "Add"}{" "}
          Transaction
        </DialogTitle>
        <div className="w-full h-px mx-auto bg-gray-200"></div>
        <form
          className="grid grid-cols-2 gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Form {...form}>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(value) =>
                        field.onChange(value.target.valueAsNumber)
                      }
                      className="border border-gray-300 rounded-md p-2 w-full "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <div>
                      <div className="inline-flex w-48  h-11 font-semibold text-sm relative  rounded-full bg-gray-200  z-[1] shadow-md">
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(TransactionType.INCOME);
                            form.setValue("category", { id: "", name: "" });
                          }}
                          className="relative z-[5] w-1/2 text-center content-center text-green-700"
                        >
                          {TransactionType.INCOME}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(TransactionType.EXPENSE);
                            form.setValue("category", { id: "", name: "" });
                          }}
                          className="relative z-[5] w-1/2 text-center content-center text-red-700"
                        >
                          {TransactionType.EXPENSE}
                        </button>
                        <span
                          className={`inline-block absolute z-[3] bg-white w-[48%] h-[87%]  rounded-full  my-auto -translate-y-1/2 top-[53%] duration-200 left-0 mx-1 ${
                            field.value === TransactionType.EXPENSE
                              ? "translate-x-full"
                              : ""
                          }`}
                        ></span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (!value) return;
                        field.onChange(JSON.parse(value));
                      }}
                      value={field.value.name}
                      defaultValue={field.value.name}
                    >
                      <SelectTrigger className="w-full">
                        {field.value.name || "Select Category"}
                      </SelectTrigger>
                      <SelectContent>
                        {categoryList[form.getValues().type].map((type) => (
                          <SelectItem
                            key={type.id}
                            value={JSON.stringify(type)}
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Date Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      granularity="minute"
                      onChange={(date) => field.onChange(date)}
                      hourCycle={12}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Transaction description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full h-px mx-auto bg-gray-200 col-span-2 mt-2"></div>
            <div className="flex justify-end col-span-2 gap-2 ">
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 font-medium"
              >
                {isLoading ? (
                  <Ring
                    speed={2}
                    size={25}
                    stroke={2}
                    bgOpacity={0}
                    color="white"
                  />
                ) : (
                  "Save"
                )}
              </Button>
              <DialogClose disabled={isLoading} asChild>
                <Button variant="outline" className=" font-medium">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </Form>
        </form>
      </DialogContent>
    </Dialog>
  );
}
