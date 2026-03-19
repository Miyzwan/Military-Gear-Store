import { useState } from "react";
import { useLocation, Redirect } from "wouter";
import { ShieldCheck, LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Already logged in — redirect to dashboard
  if (!isLoading && isAuthenticated) {
    return <Redirect to="/admin" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      await login(username, password);
      setLocation("/admin");
    } catch (err: any) {
      setError(err.message || "Login gagal.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background tactical pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <img
          src={`${import.meta.env.BASE_URL}images/tactical-pattern.png`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-primary/30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-primary/30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-accent text-accent-foreground flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-widest text-foreground uppercase">
            Command Center
          </h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">
            Admin Portal — Warzone Tactical
          </p>
        </div>

        {/* Login card */}
        <div className="bg-card border border-border shadow-2xl">
          <div className="p-2 bg-primary/10 border-b border-border">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="ml-2 font-mono text-xs text-muted-foreground uppercase tracking-widest">
                SECURE LOGIN
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-sm font-bold uppercase tracking-wider">
                ⚠ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                className="w-full bg-background border border-border px-4 py-3 text-foreground font-bold focus:outline-none focus:border-accent transition-colors"
                placeholder="Username admin"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-background border border-border px-4 py-3 pr-12 text-foreground font-bold focus:outline-none focus:border-accent transition-colors"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !username || !password}
              className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  MEMVERIFIKASI...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  MASUK KE DASHBOARD
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            ← Kembali ke Toko
          </a>
        </div>
      </div>
    </div>
  );
}
