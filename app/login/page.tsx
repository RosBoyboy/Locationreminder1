"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl rounded-[2rem] bg-white shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        
        {/* Left Side: Branding & Features (Hidden on mobile generally, but keeping responsive) */}
        <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-10 text-white flex-col justify-between relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] rounded-full border-[1px] border-white/10" />
          <div className="absolute top-[-10%] left-[5%] w-[100%] h-[100%] rounded-full border-[1px] border-white/5" />
          
          {/* Header */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">GeoRemind</span>
          </div>

          {/* Hero Copy */}
          <div className="relative z-10 mt-12 mb-8">
            <h1 className="text-4xl font-bold leading-tight mb-4 text-white">
              Never forget what matters,<br />wherever you are.
            </h1>
            <p className="text-indigo-200 text-sm leading-relaxed max-w-[85%]">
              Smart location-based reminders that trigger when you arrive at the right place at the right time.
            </p>
          </div>

          {/* Mock Map UI */}
          <div className="relative z-10 mt-auto w-full aspect-[2/1] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden p-4 flex flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:1rem_1rem]" />
            <div className="relative flex-1">
               {/* Map Pins */}
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
               <div className="absolute top-[15%] left-[75%]">
                 <div className="relative flex items-center justify-center">
                   <div className="absolute w-10 h-10 rounded-full bg-rose-400/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                   <div className="h-5 w-5 rounded-full bg-rose-400 border-2 border-white flex items-center justify-center shadow-md">
                     <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                   </div>
                 </div>
               </div>
               {/* Crosshair logic */}
               <div className="absolute top-0 bottom-0 left-[33%] w-1 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
               <div className="absolute left-0 right-0 top-[50%] h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
            
            <div className="relative mt-auto flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="text-xs font-medium text-white/90">3 active reminders nearby</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="relative z-10 mt-6 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center border border-white/5">
              <div className="text-lg font-bold text-white">12k+</div>
              <div className="text-[10px] text-indigo-200">Users</div>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center border border-white/5">
              <div className="text-lg font-bold text-white">98%</div>
              <div className="text-[10px] text-indigo-200">Uptime</div>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center border border-white/5">
              <div className="text-lg font-bold text-white">4.9★</div>
              <div className="text-[10px] text-indigo-200">Rating</div>
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 rounded-xl bg-slate-100/80">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 outline-none">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-slate-600 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 border"
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
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 border tracking-widest"
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

              <div className="flex justify-end pt-1">
                <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md mt-2 flex items-center justify-center gap-2">
                Sign In <ArrowRight className="h-4 w-4" />
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 outline-none">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-slate-600 font-medium">Full Name</Label>
                <Input 
                  id="signup-name" 
                  type="text" 
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
                    placeholder="you@example.com" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 border"
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
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-slate-50 border tracking-widest"
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

              <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md mt-6 flex items-center justify-center gap-2">
                Create Account <ArrowRight className="h-4 w-4" />
              </Button>
            </TabsContent>
          </Tabs>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-400 text-xs font-medium uppercase tracking-wider">or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-center gap-2 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-8 text-center text-sm text-slate-500">
            {activeTab === "login" ? (
               <>
                 Don't have an account?{" "}
                 <button onClick={() => setActiveTab("signup")} className="font-semibold text-indigo-600 hover:text-indigo-500 outline-none">
                   Sign up free
                 </button>
               </>
            ) : (
               <>
                 Already have an account?{" "}
                 <button onClick={() => setActiveTab("login")} className="font-semibold text-indigo-600 hover:text-indigo-500 outline-none">
                   Sign in
                 </button>
               </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}