import Link from "next/link";
import { Form, useForm } from "react-hook-form";

export default function LoginForm() {
  return (
    <div className="px-10">
      <form className="space-y-5">

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@gmail.com"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "/>
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "/>
        </div>

        <button
          className=" mt-4 h-11 w-full rounded-md
            bg-[#76C05D]
            text-white text-sm font-semibold
            transition
            hover:opacity-90
            active:scale-[0.98] ">
          Login
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
