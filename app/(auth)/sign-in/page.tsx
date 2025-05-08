"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function SigninPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // You can use email and password here
    console.log({ email, password })
  }

  return (
    <div className="auth-layout">
      <form onSubmit={handleSignin} className="form max-w-md w-full space-y-6">
        <h2 className="text-center">Sign In</h2>
        <div>
          <label className="label p-2">Email</label>
          <br></br>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input my-2 w-full"
            required
          />
        </div>
        <div>
          <label className="label p-2">Password</label>
          <br></br>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input my-2 w-full"
            required
          />
        </div>
        <Button type="submit" className="btn">Sign In</Button>
      </form>
    </div>
  )
}