"use client";
import { GroupCategories } from "@/lib/types/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Ring } from "ldrs/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useViewContext } from "./Wrapper";
import "ldrs/react/Ring.css";
import { addAndUpdateBudget } from "@/app/_action";

export default function BudgetModal({
  categories,
}: {
  categories: GroupCategories;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { budgetMoalOpen, setBudgetModalOpen } = useViewContext();
  const formSchema = z.object({
    ...categories["EXPENSE"].reduce((acc, category) => {
      acc[category.name] = z.number().min(1, {
        message: `${category.name} must be greater than 0`,
      });
      return acc;
    }, {} as Record<string, z.ZodNumber>),
  });

  useEffect(()=>{
    form.reset({
      ...categories["EXPENSE"].reduce((acc, category) => {
        acc[category.name] = category.budget;
        return acc;
      }, {} as Record<string, number>),
    });
  },[categories])
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...categories["EXPENSE"].reduce((acc, category) => {
        acc[category.name] = category.budget;
        return acc;
      }, {} as Record<string, number>),
    },
  });
  async function onSubmit() {
    setIsLoading(true);
    const keyPair = categories["EXPENSE"].reduce((acc, category) => {
      acc[category.name] = category.id;
      return acc;
    }, {} as Record<string, string>);
    const data = form.getValues();
    const budget = categories["EXPENSE"].reduce((acc, category) => {
      acc.push({
        id: keyPair[category.name],
        amount: data[category.name],
      });
      return acc;
    }, [] as { id: string; amount: number }[]);
    try {
      await addAndUpdateBudget(budget);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setBudgetModalOpen(false);
      form.reset();
    }
  }
  return (
    <Dialog
      open={budgetMoalOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          setBudgetModalOpen(false);
          form.reset();
        }
      }}
    >
      <DialogContent>
        <DialogTitle>Edit Budget</DialogTitle>
        <div className="w-full h-px mx-auto bg-gray-200"></div>
        <form
          className="grid grid-cols-2 gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Form {...form}>
            {categories["EXPENSE"].map((category) => (
              <FormField
                key={category.name}
                control={form.control}
                name={category.name}
                render={({ field }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel>{category.name}</FormLabel>
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
            ))}
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
                  "Update"
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
