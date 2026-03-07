"use client"

import { useEffect, useRef, useCallback } from "react"

declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady: () => void
  }
}

const PLAYER_VARS: YT.PlayerVars = {
  autoplay: 0,
  mute: 1,
  controls: 0,
  showinfo: 0,
  modestbranding: 1,
  playsinline: 1,
  rel: 0,
  disablekb: 1,
  iv_load_policy: 3,
  fs: 0,
  cc_load_policy: 0,
}

const SWAP_LEAD_TIME = 1.5 // seconds before end to start the swap

export function YouTubeBackground({ videoId }: { videoId: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const playerA = useRef<YT.Player | null>(null)
  const playerB = useRef<YT.Player | null>(null)
  const activeRef = useRef<"A" | "B">("A")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const swappingRef = useRef(false)
  const divARef = useRef<HTMLDivElement>(null)
  const divBRef = useRef<HTMLDivElement>(null)

  const getActive = useCallback(() => {
    return activeRef.current === "A" ? playerA.current : playerB.current
  }, [])

  const getStandby = useCallback(() => {
    return activeRef.current === "A" ? playerB.current : playerA.current
  }, [])

  const swap = useCallback(() => {
    if (swappingRef.current) return
    swappingRef.current = true

    const standby = getStandby()
    if (standby) {
      standby.seekTo(0, true)
      standby.playVideo()
    }

    // Bring standby to front
    const isA = activeRef.current === "A"
    if (divARef.current && divBRef.current) {
      divARef.current.style.zIndex = isA ? "0" : "1"
      divBRef.current.style.zIndex = isA ? "1" : "0"
    }

    activeRef.current = isA ? "B" : "A"

    // After a short delay, pause the old player and reset swap lock
    setTimeout(() => {
      const old = isA ? playerA.current : playerB.current
      if (old) {
        old.pauseVideo()
        old.seekTo(0, true)
      }
      swappingRef.current = false
    }, 2000)
  }, [getStandby])

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      const active = getActive()
      if (!active) return
      try {
        const duration = active.getDuration()
        const current = active.getCurrentTime()
        if (duration > 0 && current > 0 && duration - current < SWAP_LEAD_TIME) {
          swap()
        }
      } catch {
        // player not ready yet
      }
    }, 150)
  }, [getActive, swap])

  const createPlayer = useCallback(
    (elementId: string, autoplay: boolean): YT.Player => {
      return new window.YT.Player(elementId, {
        videoId,
        playerVars: { ...PLAYER_VARS, autoplay: autoplay ? 1 : 0, origin: window.location.origin },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            if (autoplay) {
              event.target.playVideo()
              startPolling()
            }
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            // Safety net: if the active player ends unexpectedly, swap
            if (event.data === window.YT.PlayerState.ENDED) {
              swap()
            }
          },
        },
      })
    },
    [videoId, startPolling, swap]
  )

  const initPlayers = useCallback(() => {
    if (playerA.current || playerB.current) return
    playerA.current = createPlayer("yt-bg-a", true)
    playerB.current = createPlayer("yt-bg-b", false)
  }, [createPlayer])

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayers()
    } else {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)
      window.onYouTubeIframeAPIReady = initPlayers
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      playerA.current?.destroy()
      playerB.current?.destroy()
      playerA.current = null
      playerB.current = null
    }
  }, [initPlayers])

  const iframeClass =
    "[&_iframe]:absolute [&_iframe]:top-1/2 [&_iframe]:left-1/2 [&_iframe]:-translate-x-1/2 [&_iframe]:-translate-y-1/2 [&_iframe]:w-screen [&_iframe]:h-screen [&_iframe]:min-w-[177.78vh] [&_iframe]:min-h-[56.25vw] [&_iframe]:border-none"

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Player A (starts on top) */}
      <div ref={divARef} className={`absolute inset-0 ${iframeClass}`} style={{ zIndex: 1 }}>
        <div id="yt-bg-a" />
      </div>
      {/* Player B (standby underneath) */}
      <div ref={divBRef} className={`absolute inset-0 ${iframeClass}`} style={{ zIndex: 0 }}>
        <div id="yt-bg-b" />
      </div>
    </div>
  )
}
