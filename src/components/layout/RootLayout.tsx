import { useEffect } from "react";
import { useOutlet, useBlocker, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { hasAnyPhoto, useSession } from "@/store/session";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { PageTransition } from "../common/PageTransition";
import { StepIndicator } from "../common/StepIndicator";
import { Footer } from "./Footer";
import { Header } from "./Header";

const flow = new Set(["/frames", "/camera", "/editor", "/result"]);

export function RootLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const photos = useSession((state) => state.photos);
  const resetSession = useSession((state) => state.resetSession);
  const shooting = hasAnyPhoto(photos);
  const compact = location.pathname === "/camera";
  const landing = location.pathname === "/";
  const inFlow = flow.has(location.pathname);
  const { copy } = useI18n();

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (!shooting) return false;
    if (currentLocation.pathname === nextLocation.pathname) return false;
    const staying = flow.has(currentLocation.pathname) && flow.has(nextLocation.pathname);
    return !staying;
  });

  useEffect(() => {
    if (!shooting) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [shooting]);

  return (
    <div className={landing ? "flex h-dvh flex-col overflow-hidden" : "flex min-h-screen flex-col"}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-butter focus:px-4 focus:py-2">
        {copy.nav.skip}
      </a>
      <Header />
      {inFlow ? (
        <div className="mx-auto w-full max-w-6xl px-4 pt-4">
          <StepIndicator pathname={location.pathname} />
        </div>
      ) : null}
      <main id="main" className={landing ? "min-h-0 flex-1" : "flex-1"}>
        <PageTransition pathname={location.pathname} className={landing ? "h-full" : undefined}>
          {outlet}
        </PageTransition>
      </main>
      {compact || landing ? null : <Footer />}
      <ConfirmDialog
        open={blocker.state === "blocked"}
        title={copy.leave.title}
        body={copy.leave.body}
        confirmLabel={copy.leave.confirm}
        cancelLabel={copy.leave.keep}
        onCancel={() => {
          if (blocker.state === "blocked") blocker.reset();
        }}
        onConfirm={() => {
          if (blocker.state === "blocked") blocker.proceed();
          resetSession();
        }}
      />
    </div>
  );
}
