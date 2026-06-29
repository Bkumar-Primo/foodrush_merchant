"use client";

import { useServerInsertedHTML } from "next/navigation";
import { createSplashBootstrapScript } from "@/lib/constants";

/** Injects splash bootstrap script during SSR (outside the React tree). */
export function SplashBootstrapScript(): null {
  useServerInsertedHTML(() => (
    <script
      id="foodrush-splash-bootstrap"
      dangerouslySetInnerHTML={{ __html: createSplashBootstrapScript() }}
    />
  ));

  return null;
}
