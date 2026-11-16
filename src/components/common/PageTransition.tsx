import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

export function PageTransition({
  pathname,
  className,
  children,
}: {
  pathname: string;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    first.current = false;
  }, []);

  return (
    <motion.div
      key={pathname}
      className={className}
      initial={reduce || first.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
