import { FormContainer } from "@/components/form/FormContainer";

export default function Home() {
  return (
    <main>
      <header className="border-b border-line-soft">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-5 sm:px-8">
          <span className="font-serif text-[17px] tracking-tight text-ink">
            Buyer DNA
          </span>
          <span className="text-xs uppercase tracking-[0.14em] text-ink-faint">
            Property Preference Profile
          </span>
        </div>
      </header>
      <FormContainer />
    </main>
  );
}
