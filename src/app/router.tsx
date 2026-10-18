import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { CameraPage } from "@/pages/CameraPage";
import { EditorPage } from "@/pages/EditorPage";
import { FrameSelectionPage } from "@/pages/FrameSelectionPage";
import { HomePage } from "@/pages/HomePage";
import { ResultPage } from "@/pages/ResultPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "frames", element: <FrameSelectionPage /> },
      { path: "camera", element: <CameraPage /> },
      { path: "editor", element: <EditorPage /> },
      { path: "result", element: <ResultPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
