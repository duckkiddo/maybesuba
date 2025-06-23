import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Lock, Mail } from "lucide-react"

interface AdminLoginProps {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResetLoading, setIsResetLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetMessage, setResetMessage] = useState("")
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const validUsername = "admin"
      const validPassword = "password"

      if (username === validUsername && password === validPassword) {
        sessionStorage.setItem("adminLoggedIn", "true")
        sessionStorage.setItem("adminUsername", username)
        sessionStorage.setItem("loginTime", new Date().toISOString())
        onLogin()
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsResetLoading(true)
    setResetMessage("")
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setResetMessage("If the email is registered, a password reset link has been sent.")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your credentials to access the dashboard</p>
          </div>

          {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                  aria-label="Username"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-label="User icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  aria-label="Password"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Forgot password?
                </Button>
              </DialogTrigger>
              <DialogContent className="ml-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">Reset Password</DialogTitle>
                  <DialogDescription className="text-base">
                    Enter your email address to receive a password reset link.
                  </DialogDescription>
                </DialogHeader>
                {resetMessage && (
                  <div className="bg-green-100 text-green-800 p-3 rounded-md mb-6">{resetMessage}</div>
                )}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</div>}
                <form onSubmit={handleResetSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-10 text-base"
                        required
                        aria-label="Email address"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Mail className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-10 text-base" disabled={isResetLoading}>
                    {isResetLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}