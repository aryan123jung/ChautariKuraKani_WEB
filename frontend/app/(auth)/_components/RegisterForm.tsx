export default function RegisterForm() {
    return (
        <div className="px-10">
        <form className="space-y-4 ">
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                    First Name</label>
                <input 
                    id="email"
                    type="email"
                    className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
                    placeholder="John"></input>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                    Last Name</label>
                <input 
                    id="email"
                    type="email"
                    className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
                    placeholder="Doe"></input>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                    Email</label>
                <input 
                    id="email"
                    type="email"
                    className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
                    placeholder="you@gmail.com"></input>
            </div>
            <div className="">
                <label className="text-sm font-medium text-gray-600">Password</label>
                <input 
                    id="email"
                    type="email"
                    className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
                    placeholder="••••••"></input>
            </div>
            <div className="">
                <label className="text-sm font-medium text-gray-600">Confirm Password</label>
                <input 
                    id="email"
                    type="email"
                    className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
                    placeholder="••••••"></input>
            </div>

            <div className="flex justify-center py-5">
            <button className="h-10 w-full rounded-md bg-[#76C05D] text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">Login</button>
            </div>
            <div className="text-center text-sm">Already have an account?</div>
        </form>
        </div>
    );
}