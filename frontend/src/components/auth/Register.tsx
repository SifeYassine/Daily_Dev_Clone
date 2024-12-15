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

export default function Register() {
  const [authState, setAuthState] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  return (
    <div>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Welcom to Daily.dev</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form action="">
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
              </div>
              <div className="space-y-1">
                <Label htmlFor="password_confirm">Confirm Password</Label>
                <Input
                  id="password_confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={authState.password_confirmation}
                  onChange={(e) => {
                    setAuthState({
                      ...authState,
                      password_confirmation: e.target.value,
                    });
                  }}
                />
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