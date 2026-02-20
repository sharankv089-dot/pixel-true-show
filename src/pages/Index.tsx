import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/3 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10 max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary mb-8 animate-pulse-glow"
        >
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
          Kod<span className="text-primary glow-text">bank</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto">
          Your secure digital banking experience. Fast, reliable, and beautiful.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            onClick={() => navigate("/register")}
            className="gradient-primary text-primary-foreground font-semibold h-13 px-8 text-base rounded-xl hover:opacity-90 transition-all hover:scale-105 active:scale-95"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="border-border text-foreground font-semibold h-13 px-8 text-base rounded-xl hover:bg-muted transition-all"
          >
            Sign In
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: "Secure", desc: "JWT protected" },
            { icon: Zap, title: "Fast", desc: "Instant access" },
            { icon: Sparkles, title: "Beautiful", desc: "Modern UI" },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass rounded-xl p-5"
            >
              <feature.icon className="w-6 h-6 text-primary mb-2 mx-auto" />
              <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
              <p className="text-muted-foreground text-xs mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
