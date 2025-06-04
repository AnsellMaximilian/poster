"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@/context/user/UserContext";

import { useState } from "react";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(4).max(50),
    password: z.string().min(8, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

enum AuthType {
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
}

export default function AuthForm({}) {
  const { login, isProcessing, register } = useUser();
  const [authType, setAuthType] = useState<AuthType>(AuthType.LOGIN);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  async function onLogin(values: z.infer<typeof loginSchema>) {
    const { email, password } = values;

    login(email, password);
  }

  async function onRegister(values: z.infer<typeof registerSchema>) {
    const { email, password, name } = values;

    await register(email, password, name);
    await login(email, password);
  }
  return (
    <div>
      <Tabs
        value={authType}
        onValueChange={(value) => {
          setAuthType(value as AuthType);
          loginForm.reset(); // Reset form when switching tabs
          registerForm.reset();
        }}
        className="w-full"
      >
        <TabsList className="w-max">
          <TabsTrigger value={AuthType.LOGIN}>Login</TabsTrigger>
          <TabsTrigger value={AuthType.REGISTER}>Register</TabsTrigger>
        </TabsList>

        {/* LOGIN FORM */}
        <TabsContent value={AuthType.LOGIN} className="py-4">
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-luckiest-guy">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-luckiest-guy">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <Button
                  type="submit"
                  className="ml-auto text-2xl py-2 h-auto px-6 rotate-2 rounded-tl-none rounded-br-none"
                  disabled={isProcessing}
                >
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        {/* REGISTER FORM */}
        <TabsContent value={AuthType.REGISTER} className="py-4">
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onRegister)}
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-luckiest-guy">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-luckiest-guy">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-luckiest-guy">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-luckiest-guy">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <Button
                  type="submit"
                  className="ml-auto text-2xl py-2 h-auto px-6 rotate-2 rounded-tl-none rounded-br-none"
                  disabled={isProcessing}
                >
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
