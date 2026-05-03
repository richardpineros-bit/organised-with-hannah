export function CertificationsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-8">Qualified, Certified & Trusted</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex flex-col items-center">
            <img src="/images/org-academy-badge.png" alt="The Organising Academy" className="h-24 w-24 object-contain mb-2" />
            <span className="text-xs text-center">The Organising Academy<br/>Professional Member</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/images/mhfa-badge.png" alt="Mental Health First Aider" className="h-24 w-24 object-contain mb-2" />
            <span className="text-xs text-center">Mental Health First Aider<br/>Accredited</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-8">
          NDIS Certified Provider • Mental Health First Aider • The Organising Academy Member • Fully Insured
        </p>
      </div>
    </section>
  );
}
