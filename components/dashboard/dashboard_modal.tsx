"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface DashboardModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Dashboard dialog: a bottom sheet on phones, a centred card from `sm` up.
 * Closes on backdrop click and Escape. End the body with <ModalFooter> to pin the actions.
 */
export function DashboardModal({ open, onClose, title, description, children, className }: DashboardModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "bg-white w-full sm:max-w-[560px] max-h-[92dvh] rounded-t-[24px] sm:rounded-[24px] shadow-2xl flex flex-col overflow-hidden",
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-8 pb-4 shrink-0">
              <div className="flex flex-col gap-[8px] min-w-0">
                <h3 className="font-serif font-semibold leading-[1.1] text-[#054b3c] text-[22px] sm:text-[24px]">
                  {title}
                </h3>
                {description && (
                  <p className="font-sans text-[14px] leading-[1.5] text-[#546360]">{description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -mr-2 -mt-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-5 sm:pb-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Action bar pinned to the bottom of a DashboardModal while its body scrolls. */
export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-5 sm:-mx-8 -mb-5 sm:-mb-8 mt-5 px-5 sm:px-8 pt-4 sm:pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-8 bg-white border-t border-[#eaecf0]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small yes/no dialog used in place of `window.confirm`. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  busy = false,
  tone = "danger",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  busy?: boolean;
  tone?: "danger" | "primary";
}) {
  return (
    <DashboardModal
      open={open}
      onClose={busy ? () => {} : onClose}
      title={title}
      description={description}
      className="sm:max-w-[440px]"
    >
      <ModalFooter className="mt-0">
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-[44px] px-6 rounded-full bg-[#f1f6f5] hover:bg-[#e3ecea] text-[#054b3c] text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={cn(
              "h-[44px] px-6 rounded-full text-white text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2",
              tone === "danger" ? "bg-[#d92d20] hover:bg-[#b42318]" : "bg-[#054b3c] hover:bg-[#043d30]",
            )}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </ModalFooter>
    </DashboardModal>
  );
}
