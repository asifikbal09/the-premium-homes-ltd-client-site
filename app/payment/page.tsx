import { redirect } from "next/navigation";

export default function PaymentPage() {
  redirect("/dashboard?tab=payment");
}
