import Image from "next/image";
import {
  AUTH_HERO_IMAGE_CLASS,
  AUTH_HERO_WRAPPER_CLASS,
  AUTH_PAGE_BG,
} from "@/features/auth/constants/authLayout";
import { BRAND_ASSETS, BRAND_LOGIN_HERO_SIZE } from "@/lib/constants";

const HERO_BLEND_LAYERS = [
  `linear-gradient(to right, ${AUTH_PAGE_BG} 0%, transparent 10%)`,
  `linear-gradient(to bottom, ${AUTH_PAGE_BG} 0%, transparent 7%)`,
  `linear-gradient(to left, ${AUTH_PAGE_BG} 0%, transparent 7%)`,
] as const;

export function AuthHeroImage(): React.JSX.Element {
  return (
    <div className={AUTH_HERO_WRAPPER_CLASS}>
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
      {HERO_BLEND_LAYERS.map((background) => (
        <div
          key={background}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background }}
        />
      ))}
    </div>
  );
}
