export function CertificationsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm uppercase tracking-wider text-gray-500 mb-8">
          Mental Health First Aid Certified
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
          <div className="w-32 h-32">
            <img src="/images/org-academy-badge.png" alt="The Organising Academy Professional Member" className="w-full h-full object-contain" />
          </div>
          <div className="w-32 h-32">
            <img src="/images/mhfa-badge.png" alt="Mental Health First Aider Accredited" className="w-full h-full object-contain" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-8">
          Mental Health courses Australia &amp; Worldwide, both online and face-to-face
        </p>
      </div>
    </section>
  );
}
