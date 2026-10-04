"use client";

/**
 * Demo notice.
 *
 * The README says DEMO ONLY. Hiding that in a footer would contradict the
 * product's entire pitch, so it is stated up front and linked to the FAQ
 * entry that explains it. Dismissible, because it will get in the way
 * once you've read it.
 */

import { useState } from "react";
import { X } from "lucide-react";
import { DEMO_NOTICE } from "@/lib/content";

export function DemoNotice() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-brand-wash text-ink">
      <div className="mx-auto flex w-full max-w-6xl items-start gap-3 px-5 py-3 sm:items-center sm:px-8">
        <p className="flex-1 text-sm leading-relaxed">
          <span className="font-semibold text-brand">{DEMO_NOTICE.label}</span>
          <span className="text-brand" aria-hidden="true">
            —
          </span>
          {DEMO_NOTICE.body}
        </p>

        <a
          href={DEMO_NOTICE.href}
          className="hidden shrink-0 rounded-sm py-1 text-sm font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:inline-block"
        >
          {DEMO_NOTICE.action}
        </a>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss demo notice"
          className="shrink-0 rounded-sm p-1 text-ink-muted transition-colors hover:bg-brand/10 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}