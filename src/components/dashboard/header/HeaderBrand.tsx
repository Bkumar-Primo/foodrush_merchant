import Image from "next/image";
import { BRAND_ASSETS } from "@/lib/constants";

export function HeaderBrand(): React.JSX.Element {
  return (
    <div className="flex flex-col select-none shrink-0">
      <div className="">
        <Image
          src={BRAND_ASSETS.logo}
          alt=""
          width={150}
          height={150}
          unoptimized
          priority
          aria-hidden
          className="shrink-0 object-contain"
        />
      </div>
    </div>
  );
}
