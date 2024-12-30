"use client";

import { useState, useTransition } from "react";

import { ChevronDown, Loader2, LogOut } from "lucide-react";

import { logout } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  email: string;
  name: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ email, name }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [state, formAction] = useTransition();

  const handleLogout = () => {
    formAction(() => {
      logout();
    });
  };

  const closeDialog = () => {
    if (!state) {
      setIsDialogOpen(false);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2"
          data-testid="user-menu-button"
        >
          <span className="text-base font-medium">{name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-full">
        <DropdownMenuLabel className="font-normal">
          <span className="text-xs text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AlertDialog open={isDialogOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              asChild
              className="gap-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                data-testid="logout-button"
                onClick={() => setIsDialogOpen(true)}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                data-testid="cancel-button"
                disabled={state}
                onClick={closeDialog}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                data-testid="confirm-button"
                disabled={state}
                onClick={handleLogout}
                variant="destructive"
              >
                {state ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Log out"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
