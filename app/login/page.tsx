"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      if (user) router.push("/dashboard");
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      await authService.signInWithEmail(email, password);
      router.push("/dashboard"); 
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      await authService.signUpWithEmail(email, password, fullName);
      router.push("/dashboard"); 
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl rounded-[2rem] bg-white shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        
        {/* Left Side: Branding & Features (Hidden on mobile) */}
        <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-10 text-white flex-col justify-between relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] rounded-full border-[1px] border-white/10" />
          <div className="absolute top-[-10%] left-[5%] w-[100%] h-[100%] rounded-full border-[1px] border-white/5" />
          
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">GeoRemind</span>
          </div>

          <div className="relative z-10 mt-12 mb-8">
            <h1 className="text-4xl font-bold leading-tight mb-4 text-white">
              Never forget what matters,<br />wherever you are.
            </h1>
            <p className="text-indigo-200 text-sm leading-relaxed max-w-[85%]">
              Smart location-based reminders that trigger when you arrive at the right place at the right time.
            </p>
          </div>

          <div className="relative z-10 mt-auto w-full aspect-[2/1] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden p-4 flex flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:1rem_1rem]" />
            <div className="relative flex-1">
               <div className="absolute top-[20%] left-[30%]">
                 <div className="relative flex items-center justify-center">
                   <div className="absolute w-8 h-8 rounded-full bg-yellow-400/20 animate-ping"></div>
                   <div className="h-5 w-5 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center shadow-md">
                     <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                   </div>
                 </div>
               </div>
               <div className="absolute top-[45%] left-[55%]">
                 <div className="relative flex items-center justify-center">
                   <div className="absolute w-12 h-12 rounded-full bg-green-400/20 animate-ping" style={{ animationDelay: '1s' }}></div>
                   <div className="h-5 w-5 rounded-full bg-green-400 border-2 border-white flex items-center justify-center shadow-md">
                     <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="relative mt-auto flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="text-xs font-medium text-white/90">Active mapping system</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex flex-1 flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-20">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              {activeTab === "login" ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-sm text-slate-500">
              {activeTab === "login" 
                ? "Sign in to your account to continue" 
                : "Start your location-based reminder journey"}
            </p>
          </div>

          {errorMsg && (
             <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
               {errorMsg}
             </div>
          )}

            <Tabs value={activeTab} onValueChange={(val) => {
              setActiveTab(val);
              setErrorMsg("");
              setEmail("");
              setPassword("");
              setFullName("");
            }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 rounded-xl bg-slate-100/80">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 outline-none">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-slate-600 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="login-email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" 
                      className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 border"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="login-password" className="text-slate-600 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="login-password" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 border tracking-widest"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button disabled={isLoading} type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md mt-6 flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 outline-none">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-slate-600 font-medium">Full Name</Label>
                  <Input 
                    id="signup-name" 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Johnson" 
                    className="h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 border px-4"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="signup-email" className="text-slate-600 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="signup-email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" 
                      className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 border"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="signup-password" className="text-slate-600 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="signup-password" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 border tracking-widest"
                      required
                      minLength={6}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button disabled={isLoading} type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md mt-6 flex items-center justify-center gap-2">
                   {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
