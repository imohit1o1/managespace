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
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { signUpSchema } from "@/schema/authSchema";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

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

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      console.log("Signup successful", response.status);

      if (response.status === 201) {
        console.log("Signing in user after sign up");
        // Auto-login using NextAuth's signIn
        const signInResponse = await signIn("credentials", {
          redirect: false,
          username: data.username,
          password: data.password,
        });

        if (signInResponse?.ok) {
          console.log("Auto-login successful");
          // Redirect to dashboard
          router.push("/dashboard/user");
        } else {
          console.error("Auto-login failed");
        }
      }
      toast({
        title: "Signed Up Successfully",
        description: response.data.message,
      });

      router.replace("/dashboard/user");
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
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
      <Card className="p-6 min-w-[450px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Let&apos;s get started with ManageSpace
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
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
          <section className="flex flex-col gap-2">
            {/* Sign Up with Google */}
            <Button
              variant="outline"
              size="default"
              onClick={() => signIn("google")}
              className="h-12"
            >
              <FcGoogle className="mr-2 w-4 h-4" />
              Sign up with Google
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already a member?{" "}
              <Link
                href="/sign-in"
                className="underline underline-offset-4 hover:text-primary/90"
              >
                Sign in
              </Link>
            </p>
          </section>
        </CardContent>
      </Card>
      <div className="text-sm text-center text-muted-foreground">
        By signing up to create an account I accept
        <br />
        Company&apos;s{" "}
        <Link
          href="/terms-of-use"
          className="hover:text-primary/70 underline underline-offset-4 "
        >
          Terms of Use{" "}
        </Link>
        and{" "}
        <Link
          href="/privacy-policy"
          className="hover:text-primary/70 underline underline-offset-4 "
        >
          Privacy Policy{" "}
        </Link>
      </div>
    </div>
  );
}
