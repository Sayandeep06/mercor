"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const [name, setName] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit =()=>{
    //submitting to the be
  }

  return (
    <div className="auth-layout">
      <form onSubmit={handleSubmit} className="form max-w-md w-full space-y-6">
        <h2 className="text-center">Sign Up</h2>
        
        <div>
          <label className="label p-2">Name</label>
          <br></br>
          <input
            type="text"
            className="input w-full my-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label p-2">Username</label>
          <input
            type="text"
            className="input w-full my-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label p-2">Password</label>
          <input
            type="password"
            className="input w-full my-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>


        <Button type="submit" className="btn">Sign Up</Button>
      </form>
    </div>
  )
}