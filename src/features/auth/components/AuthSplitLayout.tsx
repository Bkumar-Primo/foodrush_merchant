import type { ReactNode } from "react";
import { AuthHeroImage } from "@/features/auth/components/AuthHeroImage";
import {
  AUTH_PAGE_BG,
  AUTH_SPLIT_CONTENT_CLASS,
  AUTH_SPLIT_LEFT_CLASS,
  AUTH_SPLIT_MAIN_CLASS,
  AUTH_SPLIT_RIGHT_CLASS,
} from "@/features/auth/constants/authLayout";

interface AuthSplitLayoutProps {
  children: ReactNode;
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps): React.JSX.Element {
  return (
    <main className={AUTH_SPLIT_MAIN_CLASS} style={{ backgroundColor: AUTH_PAGE_BG }}>
      <div className={AUTH_SPLIT_CONTENT_CLASS}>
        <section className={AUTH_SPLIT_LEFT_CLASS}>{children}</section>

        <aside className={AUTH_SPLIT_RIGHT_CLASS}>
          <AuthHeroImage />
        </aside>
      </div>
    </main>
  );
}
