import { Spinner } from "@/components/ui/spinner";

/** Reserves the same space as the login card content to avoid layout shift. */
export function AuthCardLoader(): React.JSX.Element {
  return (
    <div className="flex min-h-[420px] items-center justify-center" aria-busy="true" aria-label="Loading">
      <Spinner className="size-8 text-primary" />
    </div>
  );
}
