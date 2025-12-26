"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "../schema";
import { startTransition, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors,isSubmitting}
    }= useForm<LoginData>(
        {
            resolver: zodResolver(loginSchema),
            mode: "onSubmit",
        }
    );
    const [isPending, startTransition] = useTransition()


    const Submit = async (values: LoginData) => {
        startTransition(async()=>{
            await new Promise((resolve)=> setTimeout(resolve, 2000));
            router.push("/home");
        })
        // alert("Successfully Logged in");
    };

  return (
    <div className="px-10">
      <form className="space-y-5" onSubmit={handleSubmit(Submit)}>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="you@gmail.com"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "
           />
           {errors.email?.message&&(
                <p className="text-xs text-red-500">{errors.email.message}</p>
           )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            placeholder="••••••"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "/>
            {errors.password?.message&&(
                <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
        </div>

        <button
          className=" mt-4 h-11 w-full rounded-md
            bg-[#76C05D]
            text-white text-sm font-semibold
            transition
            hover:opacity-90
            active:scale-[0.98] "

          type="submit"
          disabled = {isSubmitting||isPending}
        >
          {isSubmitting||isPending ? "Logging in...": "Login"}  
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#76C05D] hover:underline"
          >
            Signup
          </Link>
        </p>

      </form>
    </div>
  );
}
