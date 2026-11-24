"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, RefreshCw, Loader2 } from "lucide-react";

type InstallStatus = "not_installed" | "installing" | "installed" | "update";

interface InstallButtonProps {
  appId: number;
  appName: string;
  isFree: boolean;
  price?: string | null;
  size?: "default" | "sm" | "lg";
}

export default function InstallButton({ appId, appName, isFree, price, size = "default" }: InstallButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<InstallStatus>("not_installed");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!session?.user) { setLoading(false); return; }
    checkInstallStatus();
  }, [session, appId]);

  const checkInstallStatus = async () => {
    try {
      const res = await fetch(`/api/apps/${appId}/install`);
      const data = await res.json();
      setStatus(data.status || "not_installed");
    } catch {
      setStatus("not_installed");
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async () => {
    if (!session?.user) { router.push("/auth/signin"); return; }

    setStatus("installing");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 15;
      });
    }, 200);

    try {
      await new Promise((r) => setTimeout(r, 2500));
      clearInterval(interval);
      setProgress(100);

      await fetch(`/api/apps/${appId}/install`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "installed" }),
      });

      setStatus("installed");
    } catch {
      clearInterval(interval);
      setStatus("not_installed");
    }
  };

  const handleUninstall = async () => {
    try {
      await fetch(`/api/apps/${appId}/install`, { method: "DELETE" });
      setStatus("not_installed");
    } catch {}
  };

  if (loading) {
    return (
      <Button size={size} disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...
      </Button>
    );
  }

  if (status === "installing") {
    return (
      <Button size={size} disabled className="bg-[#01875F] text-white min-w-[140px]">
        <div className="flex flex-col items-center gap-1 w-full py-1">
          <div className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-sm">Installing {Math.min(Math.round(progress), 100)}%</span>
          </div>
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
      </Button>
    );
  }

  if (status === "installed") {
    return (
      <Button size={size} variant="installed" onClick={handleUninstall} className="min-w-[120px]">
        <CheckCircle2 className="h-4 w-4 mr-2 text-[#01875F]" /> Installed
      </Button>
    );
  }

  if (status === "update") {
    return (
      <Button size={size} variant="update" onClick={handleInstall} className="min-w-[120px]">
        <RefreshCw className="h-4 w-4 mr-2" /> Update
      </Button>
    );
  }

  return (
    <Button size={size} variant="install" onClick={handleInstall} className="min-w-[120px]">
      <Download className="h-4 w-4 mr-2" /> {isFree ? "Install" : `$${price}`}
    </Button>
  );
}
