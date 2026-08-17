"use client";

import { useEffect } from "react";
import { initializeTimeZone } from "@/app/actions/daily-tasks";
import { detectBrowserTimeZone } from "@/lib/domain/timezone";

export function TimezoneBootstrap() {
  useEffect(() => { void initializeTimeZone(detectBrowserTimeZone()).catch(() => undefined); }, []);
  return null;
}
