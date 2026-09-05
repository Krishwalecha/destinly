import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ResultCard = ({ shortened, setShortened }) => {
  const [copied, setCopied] = useState(false);

  const shortUrl = `https://shrinkr.link/${
    shortened.customAlias || shortened.shortCode
  }`;

  const displayUrl = shortUrl.replace("https://", "");
  const createdDate = new Date(
    shortened.createdAt || Date.now(),
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="mt-8 w-full rounded-2xl border border-white/[0.18] bg-white/[0.09] p-3 backdrop-blur-md sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-white/10 px-1 pb-4 text-left">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              Your Short URL is ready
            </h2>
          </div>
          <p className="mt-1 text-xs text-white/50 sm:text-sm text-left">
            Your link has been shortened successfully.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShortened(false)}
          className="group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 py-2 text-xs text-white/65 transition hover:bg-white/5 hover:text-white sm:text-sm"
        >
          <span className="hidden sm:inline">Shorten another</span>
          <span className="sm:hidden">New</span>
          <ArrowRight
            size={16}
            strokeWidth={1.5}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* Main Split */}
      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_170px] sm:gap-0">
        <div className="flex min-w-0 flex-col text-left sm:border-r sm:border-white/10 sm:pr-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45 sm:text-xs">
            Short URL
          </p>

          <div className="mt-1.5 flex min-h-12 min-w-0 items-center rounded-lg border border-blue-200/25 bg-blue-200/10 px-3.5 sm:min-h-14 sm:px-4">
            <p className="min-w-0 truncate font-mono text-sm font-medium tracking-tight text-blue-100 sm:text-base">
              {displayUrl}
            </p>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-white px-4 text-sm font-medium text-[#3057C9] transition hover:bg-white/90"
            >
              <ExternalLink size={16} strokeWidth={1.5} />
              Open
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-white/[0.14] bg-white/[0.06] px-4 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {copied ? (
                <Check size={16} strokeWidth={1.5} />
              ) : (
                <Copy size={16} strokeWidth={1.5} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-white/10 pt-3 text-center">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/40 sm:text-xs">
                {shortened.customAlias ? "Custom Alias" : "Short Code"}
              </p>
              <p className="mt-1 truncate text-xs font-medium text-white/85 sm:text-sm">
                {shortened.customAlias || shortened.shortCode}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/40 sm:text-xs">
                Expiry
              </p>
              <p className="mt-1 truncate text-xs font-medium text-white/85 sm:text-sm">
                {shortened.expiresIn} days
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/40 sm:text-xs">
                Click Limit
              </p>
              <p className="mt-1 truncate text-xs font-medium text-white/85 sm:text-sm">
                {shortened.maxClicks === -1
                  ? "Unlimited"
                  : `${shortened.maxClicks} clicks`}
              </p>
            </div>
          </div>
        </div>

        {/* QR + Download + Created date */}
        <div className="flex min-w-0 flex-col items-center text-center sm:pl-5">
          <div className="aspect-square w-full max-w-[130px] rounded-lg border border-white/[0.14] bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.15)] sm:max-w-none">
            <div className="flex size-full items-center justify-center rounded-md">
              <span className="text-xs text-black/30">QR CODE</span>
            </div>
          </div>

          <button
            type="button"
            className="mt-2.5 flex h-9 w-full max-w-[130px] items-center justify-center gap-1.5 rounded-lg border border-white/[0.14] bg-white/[0.06] text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white sm:max-w-none"
          >
            <ArrowDownToLine size={14} strokeWidth={1.5} />
            Download
          </button>

          <p className="mt-1.5 text-[10px] text-white/45">
            Created {createdDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
