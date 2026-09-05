import { Link, useNavigate } from "react-router-dom";
import authBg from "../assets/auth-background.webp";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import Loader from "../components/loader.jsx";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const API_SERVER = import.meta.env.VITE_API_SERVER;

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");

  const handleSignUp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!username.trim()) {
      toast.error("Please enter your username");
      return;
    }

    if (!usernameRegex.test(username.trim())) {
      toast.error(
        "Username can only contain letters, numbers, and underscores",
      );
      return;
    }

    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    let res;

    try {
      setIsLoading(true);

      res = await axios.post(`${API_SERVER}/auth/register`, {
        username,
        email,
        password,
        name,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);

      if (res?.data?.success) {
        toast.success("Signed up successfully, redirecting to sign in...");

        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
    }
  };

  return (
    <div className="h-screen bg-[#131416] p-3 text-white">
      <div className="grid h-full overflow-hidden rounded-xl border border-white/10 xl:grid-cols-2">
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
                  Welcome!
                </h1>

                <p className="mt-2 text-sm text-white/50">
                  Sign up now for URL history and detailed analytics.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-2">
                {/* Name */}
                <div className="flex overflow-hidden rounded-md border border-white/30 bg-black">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 md:text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Username */}
                <div className="flex overflow-hidden rounded-md border border-white/30 bg-black">
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 md:text-base"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="flex overflow-hidden rounded-md border border-white/30 bg-black">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 md:text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="flex items-center gap-1 overflow-hidden rounded-md border border-white/30 bg-black">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 md:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    onClick={handleSignUp}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader /> : "Sign Up"}
                  </button>
                </div>
              </div>

              <p className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-white underline underline-offset-4"
                >
                  Sign in
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
                Sign up with Google
              </button>

              <button
                type="button"
                className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/8"
              >
                <FaGithub />
                Sign up with GitHub
              </button>
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

export { SignUp };
