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
import { signupSchema } from "@/schema/authSchema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // checking username uniqueness
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const res = await axios.get(
            `/api/check-username?username=${username}`
          );
          setUsernameMessage(res.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data?.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);

      if (response.status === 201) {
        // Auto-login using NextAuth's signIn
        const signInResponse = await signIn("credentials", {
          redirect: false,
          username: data.username,
          password: data.password,
        });

        if (signInResponse?.ok) {
          // Redirect to dashboard
          toast({
            title: "Signed Up Successfully",
            description: response.data.message,
          });
          router.replace("/dashboard/user");
        } else {
          toast({
            title: "Auto-login failed",
          });
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:
          axiosError.response?.data?.message || "Email Adress already exists!!",
        description: "Please try with another email address",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 min-h-screen">
      <Card className="p-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Get Started</CardTitle>
          <CardDescription>
            Welcome to ManageSpace - Let&apos;s create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Sign Up Form */}
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
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedUsername(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername ? (
                      <Loader2 className="animate-spin" />
                    ) : null}
                    <p
                      className={`text-xs ${
                        usernameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="abc@example.com" {...field} />
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
              <Button
                type="submit"
                className="w-full py-6 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          {/* Go To Sign In Page */}
          {/* <Separator className="relative">
            <span className="absolute inset-x-2 -top-[11px] px-4 text-sm mx-auto w-max bg-background text-muted-foreground">
              or
            </span>
          </Separator> */}
          <Button
            variant="outline"
            className="w-full py-6"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="mr-2 w-4 h-4" />
            Sign in with Google
          </Button>
          <p className="text-sm text-center">
            Already have an accouunt?{" "}
            <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-primary/70 underline underline-offset-4 "
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
      <footer className="text-center text-xs text-muted-foreground py-4">
        <p>
          By signing up, you agree to our{" "}
          <Link
            href="/terms-of-use"
            className="underline underline-offset-4 hover:text-primary"
            target="_blank"
          >
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 hover:text-primary"
            target="_blank"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
