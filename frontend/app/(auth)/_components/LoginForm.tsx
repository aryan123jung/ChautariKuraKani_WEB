import { Form, useForm } from "react-hook-form";


export default function LoginForm() {
    return (
        <form className="space-y-4 ">
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                    Email</label>
                <input 
                    id="email"
                    type="email"
                    className="h-10 rounded w-full  border border-[#B9B9B9]"></input>
            </div>
            <div className="">
                <label className="text-sm font-medium text-gray-600">Password</label>
                <input 
                    id="email"
                    type="email"
                    className="h-10 rounded w-full border border-[#B9B9B9]"></input>
            </div>

            <div className="flex justify-center">
            <button className="h-10 w-full rounded-md bg-[#76C05D] text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">Login</button>
            </div>
            <div className="text-center text-sm">Don't have an account?</div>
        </form>
    );
}

