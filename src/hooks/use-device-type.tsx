import * as React from "react"

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = React.useState<DeviceType>(() => getDeviceType())

  React.useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return deviceType
}

export function useIsMobileDevice(): boolean {
  const deviceType = useDeviceType()
  return deviceType === 'mobile' || deviceType === 'tablet'
}

function getDeviceType(): DeviceType {
  // Check user agent first
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  // iPad detection (including iPadOS 13+ that reports as desktop)
  const isIPad = /iPad/.test(userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  
  // iPhone detection
  const isIPhone = /iPhone/.test(userAgent)
  
  // Android tablet detection
  const isAndroidTablet = /Android/.test(userAgent) && !/Mobile/.test(userAgent)
  
  // Android mobile detection
  const isAndroidMobile = /Android/.test(userAgent) && /Mobile/.test(userAgent)
  
  // Touch capability
  const hasTouchPoints = navigator.maxTouchPoints > 0
  
  // Screen width fallback
  const width = window.innerWidth
  
  // Determine device type
  if (isIPhone || isAndroidMobile) {
    return 'mobile'
  }
  
  if (isIPad || isAndroidTablet) {
    return 'tablet'
  }
  
  // Fallback to width-based detection for unknown touch devices
  if (hasTouchPoints && width < 1024) {
    return width < 768 ? 'mobile' : 'tablet'
  }
  
  // Width-based detection for non-touch or when user agent doesn't match
  if (width < 768) {
    return 'mobile'
  } else if (width < 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}
