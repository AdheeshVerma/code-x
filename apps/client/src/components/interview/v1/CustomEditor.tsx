"use client";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { RemoteUser, useRemoteUsers } from "agora-rtc-react";
import { useMemo, useRef } from "react";

function CustomEditor() {
  const colors = useColors();
  const remoteUsers = useRemoteUsers();
  const containerRef = useRef<HTMLDivElement>(null);

  const activeVideoUser = useMemo(
    () => remoteUsers.find((user) => user.hasVideo) ?? remoteUsers[0],
    [remoteUsers],
  );

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  };

  if (!activeVideoUser) {
    return (
      <div
        className={`
          h-full w-full flex items-center justify-center
          ${colors.background.secondary}
          ${colors.text.secondary}
          ${colors.border.fadedThin}
          rounded-md
        `}
      >
        Waiting for candidate to stream their screen. Make sure they are sharing
        their entire screen.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`
        group
        h-full w-full relative overflow-hidden
        ${colors.background.primary}
        ${colors.border.defaultThin}
        rounded-md
      `}
    >
      <RemoteUser
        user={activeVideoUser}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
        videoPlayerConfig={{ fit: "contain" }}
      />

      {/* Fullscreen Button */}
      <button
        onClick={enterFullscreen}
        className={`
          absolute top-3 right-3
          px-3 py-1 text-sm rounded-md
          opacity-0 group-hover:opacity-100
          transition-opacity
          ${colors.background.special}
          ${colors.text.inverted}
          ${colors.properties.interactiveButton}
        `}
      >
        Fullscreen
      </button>
    </div>
  );
}

export default CustomEditor;