import { motion } from "framer-motion";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  step: number;
  description: string;
}

const MAX_STEPS = 4;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  step,
  description,
}) => (
  <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <motion.div
      className="mb-2 flex items-center justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <motion.span
        className="text-sm text-muted-foreground"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Step {step} of {MAX_STEPS}
      </motion.span>
      <motion.span
        className="text-sm text-muted-foreground"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {description}
      </motion.span>
    </motion.div>

    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{
        scaleX: 1,
        opacity: 1,
        transition: { delay: 0.4, duration: 0.6, ease: "easeOut" },
      }}
      style={{ originX: 0 }}
    >
      <Progress
        value={(step / MAX_STEPS) * 100}
        className="transition-all duration-500 ease-out"
      />
    </motion.div>
  </motion.div>
);

export const StaticProgressBar: React.FC<ProgressBarProps> = ({
  step,
  description,
}) => (
  <div className="mb-8">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Step {step} of {MAX_STEPS}
      </span>
      <span className="text-sm text-muted-foreground">{description}</span>
    </div>

    <Progress
      value={(step / MAX_STEPS) * 100}
      className="transition-all duration-500 ease-out"
    />
  </div>
);
