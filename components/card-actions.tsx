import { useState } from "react";
import { Download, Share2, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface CardActionsProps {
  cardRef: React.RefObject<HTMLDivElement>;
  username: string;
}

export function CardActions({ cardRef, username }: CardActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `github-card-${username}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Card downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download card");
    } finally {
      setIsGenerating(false);
    }
  };

  const shareCard = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `github-card-${username}.png`, {
        type: "image/png",
      });

      if (navigator.share) {
        await navigator.share({
          title: `GitHub Card - ${username}`,
          text: "Check out my GitHub stats!",
          files: [file],
        });
        toast.success("Card shared successfully!");
      } else {
        throw new Error("Share not supported");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.message !== "Share not supported") {
        toast.error("Failed to share card");
      } else {
        toast.error("Sharing is not supported on this device");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={downloadCard} disabled={isGenerating}>
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Download
      </Button>
      <Button variant="outline" onClick={shareCard} disabled={isGenerating}>
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        Share
      </Button>
    </div>
  );
}
