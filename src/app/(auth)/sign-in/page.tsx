"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import { signInSchema } from "@/schema/authSchema";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";

export default function SignInForm() {
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log("Data for submission" + { data: data });

    const response = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false, // prevents redirection to default URL
    });

    if (response?.error) {
      // handle error (invalid credentials)
      console.log("Sign-in error", response.error);
      toast({
        title: "Invalid credentials",
      });
    } else {
      // successful sign-in
      console.log("User signed in successfully");
      toast({
        title: "Signed in Successfully",
      });
      router.push("/dashboard/user");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 min-h-screen">
      <Card className="min-w-[450px] p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {/* Sign In Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
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

          <section className="flex flex-col gap-6">
            <Separator className="relative">
              <span className="absolute inset-x-2 -top-[11px] px-4 text-sm mx-auto w-max bg-background text-muted-foreground">
                or
              </span>
            </Separator>
            <Button
              variant="outline"
              size="lg"
              onClick={() => signIn("google")}
            >
              <FcGoogle className="mr-2 w-4 h-4" />
              Sign in with Google
            </Button>
            <span className="text-sm text-center">
              Don&apos;t have an accouunt?{" "}
              <Link
                href="/sign-up"
                className="text-muted-foreground hover:text-primary/70 underline underline-offset-4 "
              >
                Sign up
              </Link>
            </span>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
