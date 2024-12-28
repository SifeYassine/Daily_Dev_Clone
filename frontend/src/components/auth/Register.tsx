"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";

import myAxios from "@/lib/axios.config";
import { REGISTER_URL } from "@/lib/apiEndPoints";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

export default function Register() {
  const [authState, setAuthState] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  async function handleAuth() {
    setLoading(true);
    try {
      const res = await myAxios.post(REGISTER_URL, authState);
      const response = res.data;

      if (res?.status === 200) {
        toast.success(response.message, { theme: "dark" });
        signIn("credentials", {
          username: authState.username,
          password: authState.password,
          redirect: true,
          callbackUrl: "/",
        });
      }
    } catch (err: any) {
      const errors = err.response?.data;

      if (err.response?.status === 400) {
        setErrors(errors.errors);
      } else {
        toast.error("Something went wrong! Please try again.", {
          theme: "dark",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleAuth();
  }

  return (
    <div>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Welcome to Daily.dev</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={authState.username}
                  onChange={(e) =>
                    setAuthState({ ...authState, username: e.target.value })
                  }
                />
                <span className="text-red-500">{errors.username}</span>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={authState.email}
                  onChange={(e) =>
                    setAuthState({ ...authState, email: e.target.value })
                  }
                />
                <span className="text-red-500">{errors.email}</span>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={authState.password}
                  onChange={(e) =>
                    setAuthState({ ...authState, password: e.target.value })
                  }
                />
                <span className="text-red-500">{errors.password}</span>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password_confirm">Confirm Password</Label>
                <Input
                  id="password_confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={authState.password_confirmation}
                  onChange={(e) =>
                    setAuthState({
                      ...authState,
                      password_confirmation: e.target.value,
                    })
                  }
                />
                <span className="text-red-500">
                  {errors.password_confirmation}
                </span>
              </div>
              <div className="mt-2">
                <Button className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Register"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
