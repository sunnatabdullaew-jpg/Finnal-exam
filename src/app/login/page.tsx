"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { loginUser } from "@/service/auth";


export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      Cookies.set("token", data.token, {
      });

      router.push("/");
    }
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      username,
      password
    });
  };

 return (
  <div className="min-h-screen bg-[#080808] flex items-center justify-center px-5">
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm flex flex-col gap-4"
    >
      <h1 className="text-3xl font-semibold text-white mb-4">
        Welcome Back
      </h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full bg-[#151515] border border-[#292929] rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-[#151515] border border-[#292929] rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
      >
        {isPending ? "Loading..." : "Login"}
      </button>

      {isError && (
        <p className="text-red-500 text-sm">
          {error.message}
        </p>
      )}
    </form>
  </div>
);
}
