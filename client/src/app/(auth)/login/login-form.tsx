"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import authApiRequest from "@/apiResquests/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    try {
      const result = await authApiRequest.login(values);

      toast({
        description: result.payload.message,
      });

      await authApiRequest.auth({ sesstionToken: result.payload.data.token });

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
          <Button type="submit" className="!mt-8 w-full">
            Login
          </Button>
        </form>
      </Form>
    </>
  );
}
