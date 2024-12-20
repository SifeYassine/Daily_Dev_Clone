"use client";

import React, { useState } from "react";
import UserAvatar from "@/components/common/UserAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DialogClose } from "@radix-ui/react-dialog";

import { LogOut, UserRoundPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios.config";
import { LOGOUT_URL } from "@/lib/apiEndPoints";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";

export default function ProfileMenu({ user }: { user: CustomUser }) {
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function logoutUser() {
    axios
      .post(
        LOGOUT_URL,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((res) => {
        const response = res.data;

        if (res?.status == 200) {
          signOut({
            redirect: true,
            callbackUrl: "/login",
          });
          toast.success(response.message);
        }
      })
      .catch((err) => {
        toast.error("Something went wrong! Please try again.");
      });
  }
  return (
    <div>
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action will expire your session & to access home page you
              need to login again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="destructive" onClick={logoutUser}>
              Yes, Logout!
            </Button>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserRoundPen />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLogoutOpen(true)}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
