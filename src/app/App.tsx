import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
