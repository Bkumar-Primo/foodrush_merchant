import Image from "next/image";
import {
  AUTH_HERO_IMAGE_CLASS,
  AUTH_HERO_WRAPPER_CLASS,
  AUTH_PAGE_BG,
} from "@/features/auth/constants/authLayout";
import {
  BRAND_ASSETS,
  BRAND_LOGIN_HERO_DISPLAY,
  BRAND_LOGIN_HERO_SIZE,
} from "@/lib/constants";

/** Soft blend only on the left seam where the image meets the form card. */
const HERO_EDGE_FADE = `linear-gradient(to right, ${AUTH_PAGE_BG} 0%, transparent 4%)`;

export function AuthHeroImage(): React.JSX.Element {
  return (
    <div
      className={AUTH_HERO_WRAPPER_CLASS}
      style={{
        width: BRAND_LOGIN_HERO_DISPLAY.width,
        height: BRAND_LOGIN_HERO_DISPLAY.height,
      }}
    >
      <Image
        src={BRAND_ASSETS.loginHero}
        alt=""
        width={BRAND_LOGIN_HERO_SIZE.width}
        height={BRAND_LOGIN_HERO_SIZE.height}
        unoptimized
        priority
        aria-hidden
        className={AUTH_HERO_IMAGE_CLASS}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: HERO_EDGE_FADE }}
      />
    </div>
  );
}
