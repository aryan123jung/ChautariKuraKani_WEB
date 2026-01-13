"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { RegisterData, registerSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { error } from "console";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterForm() {

  const {
    register,
    handleSubmit,
    formState: {errors,isSubmitting}
  }= useForm<RegisterData>({
    resolver:zodResolver(registerSchema),
    mode:"onSubmit"
  });

  const [isPending,startTransition] = useTransition()
  const [error, setError] = useState("")
  const router = useRouter();

  const Submit = async (values: RegisterData) => {
    setError("")
    try{
      const response = await handleRegister(values);
      if(!response.success){
        throw new Error(response.message);
      }
      startTransition(() => router.push("/login"))
    }catch(err: any){
      setError(err.message || "Registration Failed")
    }
    
    // startTransition(async()=>{
    //   await new Promise((resolve)=> setTimeout(resolve,2000))
    //   // router.push("/")
    // })
    // alert("Successfully registered")
  }
  return (
    <div className="px-10">
      <form className="space-y-5" onSubmit={handleSubmit(Submit)}>

        <div className="space-y-1">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-600">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            placeholder="John"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "/>
              {errors.firstName?.message &&(
                <p className="text-xs text-red-500">{errors.firstName.message}</p>
              )}
        </div>

        <div className="space-y-1">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-600">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            placeholder="Doe"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "/>
              {errors.lastName?.message &&(
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="you@gmail.com"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "/>
              {errors.email?.message &&(
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
            {...register("password")}
            placeholder="••••••"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "/>
              {errors.password?.message &&(
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder="••••••"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D]"/>
              {errors.confirmPassword?.message &&(
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
        </div>

        <button
          type="submit"
          disabled = {isSubmitting || isPending}
          className=" mt-4 h-11 w-full rounded-md
            bg-[#76C05D]
            text-white text-sm font-semibold
            transition
            hover:opacity-90
            active:scale-[0.98] ">
          {isSubmitting||isPending ? "Signing up...": "Signup"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#76C05D] hover:underline"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}
