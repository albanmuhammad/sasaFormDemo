import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">

      {/* Panggil komponen di sini */}
      <ContactForm />

    </main>
  );
}