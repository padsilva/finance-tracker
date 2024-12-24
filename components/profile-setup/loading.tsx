"use client";

import { motion } from "framer-motion";

import { ProgressBar } from "@/components/profile-setup/progress-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  description: string;
  backLink?: boolean;
  checkboxesNumber?: number;
  fieldsNumber?: number;
  step?: number;
}

const FormCheckboxFieldSkeleton = () => (
  <div className="flex w-full flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow sm:w-52">
    <div className="flex w-full items-center space-x-2">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

const FormInputFieldSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-20" />
    <div className="relative">
      <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center">
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);

const pageVariants = {
  initial: {
    x: 50,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  description,
  step,
  backLink = false,
  checkboxesNumber = 0,
  fieldsNumber = 0,
}) => {
  const generateKeys = (length: number) =>
    Array.from({ length }, () => crypto.randomUUID());

  const checkboxesKeys = generateKeys(checkboxesNumber);
  const fieldsKeys = generateKeys(fieldsNumber);

  return (
    <motion.div
      className="mx-auto sm:w-[500px]"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {step && <ProgressBar step={step} description={description} />}

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full p-5">
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            <Skeleton className="mx-auto h-8 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="mx-auto h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 pt-2">
          <div className="space-y-8">
            <div className="space-y-4">
              {!!checkboxesNumber && (
                <>
                  <div className="flex flex-wrap justify-between gap-3 space-y-0">
                    {checkboxesKeys.map((key) => (
                      <FormCheckboxFieldSkeleton key={key} />
                    ))}
                  </div>

                  <div className="flex items-center justify-center">
                    <Skeleton className="h-9 w-full" />
                  </div>
                </>
              )}
              {!!fieldsNumber &&
                fieldsKeys.map((key) => <FormInputFieldSkeleton key={key} />)}
            </div>
            <div className="flex justify-between">
              {backLink && <Skeleton className="h-9 w-24" />}
              <Skeleton className={`h-9 w-32 ${!backLink ? "ml-auto" : ""}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
