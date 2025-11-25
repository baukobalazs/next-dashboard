import { Suspense } from "react";
import SignUpForm from "../ui/signup-form";

export default function SignupPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
