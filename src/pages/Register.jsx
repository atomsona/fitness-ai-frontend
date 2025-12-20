import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import GoogleButton from "../components/GoogleButton";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Join Fitness AI</CardTitle>
            <p className="text-gray-400">Start your fitness journey</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

              <Button className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-white/20" />
              <span className="px-4 text-gray-400 text-sm">OR</span>
              <div className="flex-1 border-t border-white/20" />
            </div>

            <GoogleButton
              onClick={googleLogin}
              text="Continue with Google"
            />

            <p className="text-center text-gray-400 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 font-semibold">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
