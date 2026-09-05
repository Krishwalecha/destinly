import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "#111214",
        "--normal-text": "#ffffff",
        "--normal-border": "rgba(255,255,255,0.1)",
        "--border-radius": "8px",
      }}
      toastOptions={{
        classNames: {
          toast: "font-[Inclusive_Sans]",
          title: "text-sm font-medium",
          description: "text-xs text-white/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
