"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "@/schema/authSchema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();

  // zod implementation
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // handle form submission
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    // Sending form submission to next auth
    const response = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false, // prevents redirection to default URL
    });

    if (response?.error) {
      // handle error (invalid credentials)
      toast({
        title: "Invalid credentials",
      });
    } else {
      // successful sign-in
      toast({
        title: "Signed in Successfully",
      });
      router.replace("/dashboard/user");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 min-h-screen">
      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Sign in form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        autoComplete="off"
                        {...field}
                      />
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
                      <Input
                        placeholder="password"
                        type="password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full py-6 mt-2">
                Sign In
              </Button>
            </form>
          </Form>

          {/* Go To Sign Up Page */}
          <Separator className="relative">
            <span className="absolute inset-x-2 -top-[11px] px-4 text-sm mx-auto w-max bg-background text-muted-foreground">
              or
            </span>
          </Separator>
          <Button
            variant="outline"
            className="w-full py-6"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="mr-2 w-4 h-4" />
            Sign in with Google
          </Button>
          <p className="text-sm text-center">
            Don&apos;t have an accouunt?{" "}
            <Link
              href="/sign-up"
              className="text-muted-foreground hover:text-primary/70 underline underline-offset-4 "
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
