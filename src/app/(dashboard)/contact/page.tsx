import React from "react";
import ContactLeadsTable from "@/components/contact/ContactSection";

export const metadata = {
  title: "Contact Leads | Admin Dashboard",
  description: "Manage general contact queries",
};

export default function ContactsPage() {
  return (
    <main className="w-full">
      <ContactLeadsTable/>
    </main>
  );
}