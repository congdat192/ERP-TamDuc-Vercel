import * as React from "react"
import { useIsMobileDevice } from "./use-device-type"

const MOBILE_BREAKPOINT = 1024

export function useIsMobile() {
  // Use device detection instead of width-only check
  // This ensures iPad in landscape (1024px+) is treated as mobile device
  const isMobileDevice = useIsMobileDevice()
  
  return isMobileDevice
}
