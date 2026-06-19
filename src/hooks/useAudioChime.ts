import { useCallback, useSyncExternalStore } from "react";
import { useDashboardStore, RINGTONE_MAP } from "@/stores/useDashboardStore";

let activeAudio: HTMLAudioElement | null = null;
let isPlayingGlobal = false;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getIsPlayingSnapshot() {
  return isPlayingGlobal;
}

/** Stop any active chime immediately — shared across all hook instances. */
export function stopChime() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio.removeAttribute("src");
    activeAudio.load();
    activeAudio = null;
  }
  isPlayingGlobal = false;
  emitChange();
}

function playAudio(file: string, loop: boolean, onEnded?: () => void) {
  const { volume } = useDashboardStore.getState();

  stopChime();

  try {
    const audio = new Audio(file);
    audio.volume = Math.max(0, Math.min(1, volume / 100));
    audio.loop = loop;
    activeAudio = audio;
    isPlayingGlobal = true;
    emitChange();

    if (onEnded) {
      audio.addEventListener(
        "ended",
        () => {
          if (activeAudio === audio) {
            activeAudio = null;
            isPlayingGlobal = false;
            emitChange();
          }
          onEnded();
        },
        { once: true },
      );
    }

    void audio.play().catch((e) => {
      console.warn("Audio playback blocked by browser autoplay policy:", e);
      if (activeAudio === audio) {
        activeAudio = null;
        isPlayingGlobal = false;
        emitChange();
      }
    });
  } catch (e) {
    console.warn("Audio playback error:", e);
    isPlayingGlobal = false;
    emitChange();
  }
}

export const useAudioChime = () => {
  const isPlaying = useSyncExternalStore(
    subscribe,
    getIsPlayingSnapshot,
    getIsPlayingSnapshot,
  );

  const playOrderChime = useCallback(() => {
    const { soundEnabled, selectedRingtone } = useDashboardStore.getState();
    if (!soundEnabled) return;

    const ringtoneInfo = RINGTONE_MAP[selectedRingtone];
    playAudio(ringtoneInfo.file, false);
  }, []);

  /** Play ringtone in a continuous loop until stopChime() is called */
  const playLooping = useCallback(() => {
    const { soundEnabled, selectedRingtone } = useDashboardStore.getState();
    if (!soundEnabled) return;

    const ringtoneInfo = RINGTONE_MAP[selectedRingtone];
    playAudio(ringtoneInfo.file, true);
  }, []);

  const updateVolume = useCallback((vol: number) => {
    if (activeAudio) {
      activeAudio.volume = Math.max(0, Math.min(1, vol / 100));
    }
  }, []);

  const previewRingtone = useCallback(
    (ringtoneKey: string) => {
      if (isPlaying) {
        stopChime();
        return;
      }

      const { volume } = useDashboardStore.getState();
      const ringtoneInfo = RINGTONE_MAP[ringtoneKey as keyof typeof RINGTONE_MAP];
      if (!ringtoneInfo) return;

      try {
        stopChime();
        const audio = new Audio(ringtoneInfo.file);
        audio.volume = Math.max(0, Math.min(1, volume / 100));
        activeAudio = audio;
        isPlayingGlobal = true;
        emitChange();

        audio.addEventListener(
          "ended",
          () => {
            if (activeAudio === audio) {
              activeAudio = null;
              isPlayingGlobal = false;
              emitChange();
            }
          },
          { once: true },
        );

        void audio.play().catch((e) => {
          console.warn("Audio preview blocked by browser autoplay policy:", e);
          if (activeAudio === audio) {
            activeAudio = null;
            isPlayingGlobal = false;
            emitChange();
          }
        });
      } catch (e) {
        console.warn("Audio preview error:", e);
        isPlayingGlobal = false;
        emitChange();
      }
    },
    [isPlaying],
  );

  return { playOrderChime, playLooping, stopChime, previewRingtone, updateVolume, isPlaying };
};
