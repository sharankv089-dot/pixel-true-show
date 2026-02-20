import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LogIn, Lock, User } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, look up the user's email by username
      // We need to use a workaround: try signing in with email
      // But first find the email from kod_users using a public lookup
      // Since RLS requires auth, we sign in with email directly
      // The user needs to enter their email to login, or we use a server function
      
      // For simplicity, let's sign in with email (username field accepts email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.username,
        password: form.password,
      });

      if (error) throw error;

      // Store a custom token in user_tokens table
      const { data: kodUser } = await supabase
        .from("kod_users")
        .select("uid, username, role")
        .eq("user_id", data.user.id)
        .single();

      if (kodUser) {
        const token = data.session.access_token;
        const expiry = new Date(data.session.expires_at! * 1000).toISOString();

        await supabase.from("user_tokens").insert({
          token,
          uid: kodUser.uid,
          expiry,
        });
      }

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 glow-border">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4"
            >
              <LogIn className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome to <span className="text-primary glow-text">Kodbank</span>
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-secondary-foreground">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  type="email"
                  placeholder="john@example.com"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-muted border-border focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-secondary-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-muted border-border focus:ring-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground font-semibold h-12 text-base hover:opacity-90 transition-opacity"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
