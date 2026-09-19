import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Commande",
  description: "Finalisez votre commande MAISON.",
};

export default function CheckoutPage() {
  return (
    <div className="py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Tunnel de commande" title="Finaliser ma commande" />
        <div className="mt-12">
          <CheckoutFlow />
        </div>
      </Container>
    </div>
  );
}
