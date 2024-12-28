"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import authApiRequest from "@/apiResquests/auth";
import { useAppContext } from "@/app/AppProvider";

export default function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { setSesstionToken } = useAppContext();
  // 1. Define your form.
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
    try {
      const result = await authApiRequest.resgister(values);

      toast({
        description: result.payload.message,
      });

      await authApiRequest.auth({ sesstionToken: result.payload.data.token });

      setSesstionToken(result.payload.data.token);

      router.push("/me");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errors = error.payload.errors as { field: string; message: string }[];
      const status = error.status as number;
      if (status === 422) {
        errors.forEach((error) => {
          form.setError(error.field as "email" | "password", { type: "server", message: error.message });
        });
        toast({
          variant: "destructive",
          title: "Error !",
          description: error.payload.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/4 space-y-2" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="!mt-8 w-full">
            Register
          </Button>
        </form>
      </Form>
    </>
  );
}
