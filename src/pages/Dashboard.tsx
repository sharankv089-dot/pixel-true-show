import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, LogOut, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: kodUser } = await supabase
        .from("kod_users")
        .select("username")
        .eq("user_id", session.user.id)
        .single();

      if (kodUser) {
        setUsername(kodUser.username);
      }
    };

    checkAuth();
  }, [navigate]);

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#22c55e", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#22c55e", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Big center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#10b981", "#34d399", "#fbbf24", "#f59e0b"],
    });

    frame();
  };

  const handleCheckBalance = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      // Verify token by checking user_tokens table
      const { data: kodUser } = await supabase
        .from("kod_users")
        .select("uid, balance")
        .eq("user_id", session.user.id)
        .single();

      if (!kodUser) {
        toast.error("User not found.");
        return;
      }

      // Check if token exists and is not expired
      const { data: tokenData } = await supabase
        .from("user_tokens")
        .select("*")
        .eq("uid", kodUser.uid)
        .gte("expiry", new Date().toISOString())
        .limit(1);

      if (!tokenData || tokenData.length === 0) {
        toast.error("Token expired or invalid. Please login again.");
        await supabase.auth.signOut();
        navigate("/login");
        return;
      }

      setBalance(kodUser.balance);
      setShowBalance(true);
      fireConfetti();
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Kod<span className="text-primary">bank</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">
            Welcome, <span className="text-primary font-medium">{username}</span>
          </span>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="glass rounded-3xl p-12 glow-border max-w-lg mx-auto">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl gradient-primary mb-8 animate-pulse-glow"
            >
              <Wallet className="w-12 h-12 text-primary-foreground" />
            </motion.div>

            <h1 className="text-4xl font-bold text-foreground mb-3">
              Your Dashboard
            </h1>
            <p className="text-muted-foreground mb-8">
              Check your account balance securely
            </p>

            <AnimatePresence mode="wait">
              {!showBalance ? (
                <motion.div
                  key="button"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    onClick={handleCheckBalance}
                    disabled={loading}
                    className="gradient-primary text-primary-foreground font-bold h-14 px-10 text-lg rounded-2xl hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      "Check Balance"
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="balance"
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="space-y-4"
                >
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">
                    Your Balance
                  </p>
                  <p className="text-6xl font-bold font-mono text-primary glow-text">
                    ₹{balance?.toLocaleString("en-IN")}
                  </p>
                  <p className="text-muted-foreground text-sm mt-4">
                    Token verified successfully ✓
                  </p>
                  <Button
                    onClick={() => setShowBalance(false)}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground mt-4"
                  >
                    Hide Balance
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
