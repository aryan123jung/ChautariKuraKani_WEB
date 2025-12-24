import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="space-y-6 w-full">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Create your account</h1>
                <p className="mt-1 text-sm text-foreground/70    pt-2">Signup to get started</p>
            </div>
            <RegisterForm/>
        </div>
    );
}