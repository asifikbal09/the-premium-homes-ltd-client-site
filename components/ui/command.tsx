"use client";

import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

/* shadcn/ui Command (cmdk), themed with the site palette: ink text, warm hover, gold accents. */

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn("flex h-full w-full flex-col overflow-hidden text-ink", className)}
      {...props}
    />
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="mx-2 flex items-center gap-2.5 border-b border-ink/10 px-2" cmdk-input-wrapper="">
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-4 shrink-0 text-stone"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.6-3.6" />
      </svg>
      <CommandPrimitive.Input
        className={cn(
          "h-11 w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-stone disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-lenis-prevent=""
      className={cn("no-scrollbar max-h-[240px] overflow-y-auto overflow-x-hidden py-1", className)}
      {...props}
    />
  );
}

function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className="py-5 text-center text-[13px] text-stone" {...props} />;
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "overflow-hidden text-ink [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[2px] [&_[cmdk-group-heading]]:text-stone",
        className,
      )}
      {...props}
    />
  );
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-[14px] px-4 py-2.5 text-[14px] text-ink outline-none transition-colors duration-200",
        "data-[selected=true]:bg-green data-[selected=true]:text-warm data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem };
