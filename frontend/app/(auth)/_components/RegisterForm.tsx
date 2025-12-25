// import Link from "next/link";

// export default function RegisterForm() {
//     return (
//         <div className="px-10">
//         <form className="space-y-4 ">
//             <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-600">
//                     First Name</label>
//                 <input 
//                     id="email"
//                     type="email"
//                     className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
//                     placeholder="John"></input>
//             </div>
//             <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-600">
//                     Last Name</label>
//                 <input 
//                     id="email"
//                     type="email"
//                     className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
//                     placeholder="Doe"></input>
//             </div>
//             <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-600">
//                     Email</label>
//                 <input 
//                     id="email"
//                     type="email"
//                     className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
//                     placeholder="you@gmail.com"></input>
//             </div>
//             <div className="">
//                 <label className="text-sm font-medium text-gray-600">Password</label>
//                 <input 
//                     id="email"
//                     type="email"
//                     className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
//                     placeholder="••••••"></input>
//             </div>
//             <div className="">
//                 <label className="text-sm font-medium text-gray-600">Confirm Password</label>
//                 <input 
//                     id="email"
//                     type="email"
//                     className="h-10 rounded-md w-full border border-[#B9B9B9] bg-white p-3 text=sm outline-none focus:border-foreground/80"
//                     placeholder="••••••"></input>
//             </div>

//             <div className="flex justify-center py-5">
//             <button className="h-10 w-full rounded-md bg-[#76C05D] text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">Signup</button>
//             </div>
//             <div className="text-center text-sm">
//                 Already have an account? <Link href="/login" className="font-semibold hover:underline">Login</Link>
//             </div>
//         </form>
//         </div>
//     );
// }


import Link from "next/link";

export default function RegisterForm() {
  return (
    <div className="px-10">
      <form className="space-y-5">

        <div className="space-y-1">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-600">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="John"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "/>
        </div>

        <div className="space-y-1">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-600">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Doe"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D] "/>
        </div>

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

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••"
            className=" h-11 w-full rounded-md
              border border-[#B9B9B9]
              bg-white px-3 text-sm
              outline-none
              focus:border-[#76C05D]
              focus:ring-1 focus:ring-[#76C05D]"/>
        </div>

        <button
          type="submit"
          className=" mt-4 h-11 w-full rounded-md
            bg-[#76C05D]
            text-white text-sm font-semibold
            transition
            hover:opacity-90
            active:scale-[0.98] ">
          Signup
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
