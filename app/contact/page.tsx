import type { Metadata } from "next";
import ContactForm from "./form";

export const metadata: Metadata = {
  title: "Contact AIPlayLand",
  description: "Get in touch with the team behind AIPlayLand.",
};

export default function ContactPage() {
  return <ContactForm />;
}
