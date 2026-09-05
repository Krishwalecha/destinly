import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Link2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/Loader";

const API_SERVER = import.meta.env.VITE_API_SERVER;

const UrlGenerator = ({ setShortened }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expiresIn, setExpiresIn] = useState(90);
  const [maxClicks, setMaxClicks] = useState(-1);
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [loading, setLoading] = useState(false);

  const shortenUrl = async () => {
    if (!longUrl) {
      toast.error("Long URL is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_SERVER}/urls`,
        {
          longUrl,
          customAlias,
          expiresIn,
          maxClicks,
        },
        {
          withCredentials: true,
        },
      );

      if (res.data?.data) setShortened(res.data?.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const changeValue = (setter, value, min) => {
    setter((prev) => Math.max(min, prev + value));
  };

  return (
    <div className="mt-8 w-full rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
      {/* Main URL input */}
      <div className="flex min-w-0 flex-col gap-2 md:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3">
          <Link2 size={19} strokeWidth={1.5} className="shrink-0" />

          <input
            type="url"
            placeholder="Paste your long URL"
            className="w-full min-w-0 bg-transparent text-white outline-none placeholder:text-white/50"
            value={longUrl}
            onChange={(e) => {
              setLongUrl(e.target.value);
            }}
          />
        </div>

        <button
          className="flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-5 py-3 font-medium text-[#3262DA] transition hover:bg-white/90"
          onClick={() => shortenUrl()}
        >
          {loading ? <Loader /> : "Shorten Link"}
          {!loading ? <ArrowRight size={17} strokeWidth={1.5} /> : null}
        </button>
      </div>

      {/* Advanced options */}
      {showAdvanced && (
        <div className="mt-5 border-t border-white/20 pt-5">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Custom Alias */}
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-left text-sm text-white/90">
                Custom Alias <span className="text-white/50">(optional)</span>
              </p>

              <div className="flex min-w-0 items-center overflow-hidden rounded-lg border border-white/10 bg-white/10">
                <span className="shrink-0 border-r border-white/20 px-3 py-3 text-sm text-white/90">
                  shrinkr.link/
                </span>

                <input
                  type="text"
                  placeholder="your-alias"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/40"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                />
              </div>
            </div>

            {/* Expiry Options */}
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-left text-sm text-white/90">Expiry Options</p>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Days */}
                <div className="flex min-w-0 flex-1 items-center gap-3 text-sm text-white/80">
                  <span>Days</span>

                  <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-white/10 bg-white/10">
                    <input
                      type="number"
                      value={expiresIn}
                      min={1}
                      onChange={(e) => setExpiresIn(Number(e.target.value))}
                      className="min-w-0 flex-1 bg-transparent px-3 py-2 text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <div className="flex shrink-0 flex-col border-l border-white/10">
                      <button
                        type="button"
                        onClick={() => changeValue(setExpiresIn, 1, 1)}
                        className="cursor-pointer px-2 py-0.5 text-white/60 transition hover:text-white"
                      >
                        <ChevronUp size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => changeValue(setExpiresIn, -1, 1)}
                        className="cursor-pointer px-2 py-0.5 text-white/60 transition hover:text-white"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clicks */}
                <div className="flex min-w-0 flex-1 items-center gap-3 text-sm text-white/80">
                  <span>Clicks</span>

                  <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-white/10 bg-white/10">
                    <input
                      type="number"
                      value={maxClicks}
                      min={-1}
                      onChange={(e) => setMaxClicks(Number(e.target.value))}
                      className="min-w-0 flex-1 bg-transparent px-3 py-2 text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <div className="flex shrink-0 flex-col border-l border-white/10">
                      <button
                        type="button"
                        onClick={() => changeValue(setMaxClicks, 1, -1)}
                        className="cursor-pointer px-2 py-0.5 text-white/60 transition hover:text-white"
                      >
                        <ChevronUp size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => changeValue(setMaxClicks, -1, -1)}
                        className="cursor-pointer px-2 py-0.5 text-white/60 transition hover:text-white"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-right text-xs text-white/40">
                -1 = unlimited clicks
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom row */}
      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-3 md:flex-row md:items-center md:justify-between md:border-t-0 md:pt-0">
        <div className="flex items-center gap-2 text-left text-xs leading-normal text-white/60 sm:text-sm">
          <ShieldCheck size={19} strokeWidth={1.5} className="shrink-0" />

          <p>
            By using shrinkr.link, you agree to our{" "}
            <Link
              to="/terms"
              className="text-white/80 underline transition hover:text-white"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-white/80 underline transition hover:text-white"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex shrink-0 cursor-pointer items-center gap-2 self-end text-sm text-white/70 transition hover:text-white md:self-auto"
        >
          {showAdvanced ? "Hide options" : "Advanced options"}

          {showAdvanced ? (
            <ChevronUp size={18} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={18} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
};

export default UrlGenerator;
