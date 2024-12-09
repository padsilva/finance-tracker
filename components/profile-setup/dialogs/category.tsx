"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/database";

interface CategoryDialogProps {
  onAddCategory: (category: Category) => void;
}

export const CategoryDialog = ({ onAddCategory }: CategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    onAddCategory({
      code: name.toLowerCase().replace(/\s+/g, "-"),
      name: name.trim(),
    });
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" type="button" variant="outline">
          Add Custom Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Create a new custom category to track your spending
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 py-4">
          <Label htmlFor="categoryName">Name</Label>
          <Input
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} type="button">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
