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

import axios from "@/lib/axios.config";
import { LOGIN_URL } from "@/lib/apiEndPoints";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

export default function Login() {
  const [authState, setAuthState] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    axios
      .post(LOGIN_URL, authState)
      .then((res) => {
        setLoading(false);
        const response = res.data;

        if (res?.status == 200) {
          signIn("credentials", {
            username: authState.username,
            password: authState.password,
            redirect: true,
            callbackUrl: "/",
          });

          toast.success(response.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        const errors = err.response.data;

        if (err?.status == 400) {
          setErrors(errors.errors);
        } else if (err?.status == 401) {
          toast.error(errors.message);
        } else {
          toast.error("Something went wrong! Please try again.");
        }
      });
  };
  return (
    <div>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Welcom back to Daily.dev</CardDescription>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={authState.password}
                  onChange={(e) => {
                    setAuthState({ ...authState, password: e.target.value });
                  }}
                />
                <span className="text-red-500">{errors.password}</span>
              </div>
              <div className="mt-2">
                <Button className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
