import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Check your email
        </h1>
        <p className="text-foreground-secondary mb-8">
          We've sent a verification link to your email address. Click the link
          to activate your account and start your free trial.
        </p>
        <Link href="/login">
          <Button variant="outline">Back to sign in</Button>
        </Link>
      </div>
    </div>
  );
}
