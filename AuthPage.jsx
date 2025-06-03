import { useState } from "react"; import axios from "axios"; import { Input } from "@/components/ui/input"; import { Button } from "@/components/ui/button"; import { Card, CardContent } from "@/components/ui/card"; import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AuthPage() { const [mode, setMode] = useState("login"); const [username, setUsername] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState("");

const handleSubmit = async (e) => { e.preventDefault(); try { const url = mode === "signup" ? "/signup" : "/signin"; const res = await axios.post(url, { username, password }, { withCredentials: true }); setMessage(res.data.message); } catch (err) { setMessage(err.response?.data?.error || "Something went wrong"); } };

return ( <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-4"> <Card className="w-full max-w-md shadow-2xl border border-neutral-800 bg-[#1a1a1a]"> <CardContent className="p-6"> <Tabs defaultValue="login" className="w-full" onValueChange={setMode}> <TabsList className="grid grid-cols-2 mb-4 bg-neutral-900 text-white"> <TabsTrigger value="login">Log In</TabsTrigger> <TabsTrigger value="signup">Sign Up</TabsTrigger> </TabsList>

<form onSubmit={handleSubmit}>
          <TabsContent value="login">
            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Log In
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Sign Up
              </Button>
            </div>
          </TabsContent>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-red-400">{message}</p>
        )}
      </Tabs>
    </CardContent>
  </Card>
</div>

); }
