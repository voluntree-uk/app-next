import { useEffect, useState } from "react";
import { clientData } from "@data/supabase";

/**
 * Resolve an avatar filename (storage key) into a public URL string.
 * Returns undefined if no avatar or default avatar.
 */
export function useAvatarSrc(avatarKey?: string | null): string | undefined {
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const loadAvatar = async () => {
      if (!avatarKey || avatarKey === "default_avatar.png") {
        setAvatarSrc(undefined);
        return;
      }
      const publicUrl = await clientData.getAvatarUrl(avatarKey);
      if (!cancelled) setAvatarSrc(publicUrl);
    };

    loadAvatar();

    return () => {
      cancelled = true;
    };
  }, [avatarKey]);

  return avatarSrc;
}
