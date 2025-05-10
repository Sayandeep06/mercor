"use client"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function SigninPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-950 shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Intervue</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">AI-powered Interview Assistant</p>
        <Button type="submit" className="w-full cursor-pointer" onClick={() => signIn()}>
          Sign In with Google
        </Button>
      </div>
    </div>
  )
}