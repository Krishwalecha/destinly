import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import Loader from "../components/loader.jsx";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import authBg from "../assets/auth-background.webp";

const API_SERVER = import.meta.env.VITE_API_SERVER;

const Signin = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    let res;

    try {
      setIsLoading(true);

      res = await axios.post(
        `${API_SERVER}/auth/login`,
        {
          id: identifier,
          password,
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);

      if (res?.data?.success) {
        toast.success("Logged in successfully, redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  };

  return (
    <div className="h-screen bg-[#131416] p-3 text-white">
      <div className="grid xl:grid-cols-2 h-full overflow-hidden rounded-xl border border-white/10">
        <div
          className="hidden bg-cover bg-center xl:block"
          style={{ backgroundImage: `url(${authBg})` }}
        />
        <div className="flex h-full flex-col bg-[#111214] p-6 md:px-10 md:py-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft size={17} />
          </button>
          <div className="text-2xl font-semibold mt-3">Shrinkr.</div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">
              <div className="text-center">
                <h1 className="text-3xl font-medium tracking-tighter">
                  Welcome back!
                </h1>

                <p className="mt-2 text-sm text-white/50">
                  Sign in now for URL history and detailed analytics.
                </p>
              </div>

              <div className="mt-8">
                {step === 1 ? (
                  <div className="flex overflow-hidden rounded-md border border-white/30 bg-black">
                    <input
                      type="text"
                      placeholder="Enter your username or email"
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 md:text-base"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      autoFocus
                    />

                    <button
                      type="button"
                      className="m-1 shrink-0 cursor-pointer rounded bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
                      onClick={() =>
                        identifier.trim()
                          ? setStep(2)
                          : toast.error(
                              "Please enter a valid email or username",
                            )
                      }
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex overflow-hidden rounded-md border border-white/30 bg-black">
                      <input
                        type="text"
                        placeholder="Enter your username or email"
                        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 md:text-base"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-1 overflow-hidden rounded-md border border-white/30 bg-black">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 md:text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="cursor-pointer p-2 text-white/50 transition hover:text-white/90"
                      >
                        {showPassword ? (
                          <EyeOff strokeWidth={1.5} size={20} />
                        ) : (
                          <Eye strokeWidth={1.5} size={20} />
                        )}
                      </button>

                      <button
                        type="button"
                        className="m-1 flex h-9 min-w-[88px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={handleLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "Sign in"}
                      </button>
                    </div>
                  </div>
                )}

                <p className="mt-4 text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-white underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </p>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-white/35">OR</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/8"
                >
                  <FaGoogle />
                  Sign in with Google
                </button>

                <button
                  type="button"
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/8"
                >
                  <FaGithub />
                  Sign in with GitHub
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-white/30">
            <Link to="/terms" className="transition hover:text-white/60">
              Terms of Service
            </Link>

            <Link to="/privacy" className="transition hover:text-white/60">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Signin };
