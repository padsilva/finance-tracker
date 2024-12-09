"use client";

import React, { PropsWithChildren } from "react";

import { motion } from "framer-motion";

import { ProgressBar } from "@/components/profile-setup/progress-bar";

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

interface StepProps {
  description: string;
  number: number;
}

export const Step: React.FC<PropsWithChildren<StepProps>> = ({
  children,
  description,
  number,
}) => (
  <motion.div
    className="mx-auto sm:w-[500px]"
    initial="initial"
    animate="animate"
    variants={pageVariants}
  >
    <ProgressBar step={number} description={description} />

    {children}
  </motion.div>
);
