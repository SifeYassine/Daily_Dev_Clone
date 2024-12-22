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
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { LogOut, UserRoundPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios.config";
import { LOGOUT_URL, UPDATE_PROFILE_URL } from "@/lib/apiEndPoints";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { profile } from "console";

export default function ProfileMenu() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [errors, setErrors] = useState({
    profile_image: [],
  });

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const { data, update } = useSession();
  const user = data?.user as CustomUser;

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      console.log("the selected file", file);
      setImage(file);
    }
  }

  function updateProfile(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (image) {
      formData.append("profile_image", image);
    }

    axios
      .post(UPDATE_PROFILE_URL, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setLoading(false);
        const response = res.data;

        if (res?.status == 200) {
          update({ profile_image: response.user.profile_image });
          toast.success(response.message);
          setEditProfileOpen(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        const errs = err.response.data;
        setErrors(errs.errors);

        if (err?.status == 400) {
          toast.error(errors.profile_image?.[0]);
        } else {
          toast.error("Something went wrong! Please try again.");
        }
      });
  }

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
        setLoading(false);
        const errors = err.response.data;

        if (err?.status == 400) {
          setErrors(errors.errors);
        } else {
          toast.error("Something went wrong! Please try again.");
        }
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

      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateProfile}>
            <div className="mb-2">
              <Label htmlFor="profile">Profile Image</Label>
              <Input
                type="file"
                className="file:bg-slate-500 file:rounded-sm"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg"
                onChange={handleImageChange}
              />
            </div>

            <div className="mb-2">
              <Button className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar image={user?.profile_image ?? undefined} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
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
