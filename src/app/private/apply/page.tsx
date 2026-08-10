"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { useNova } from "@/context/NovaContext";
import { residences } from "@/data/residences";

const locations = [
  { id: "logansport", label: "Logansport, IN", icon: "pin" },
  { id: "lafayette", label: "Lafayette, IN", icon: "pin" },
  { id: "kokomo", label: "Kokomo, IN", icon: "pin" },
  { id: "flexible", label: "Soy flexible", icon: "map" },
];

const ranges = ["Under $350k", "$350k – $500k", "$500k – $750k", "$750k+"];

export default function PrivateApplyPage() {
  const router = useRouter();
  const { membership, submitMembership } = useNova();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("logansport");
  const [purchaseWithin12, setPurchaseWithin12] = useState<"yes" | "no" | "unsure">("yes");
  const [preApproved, setPreApproved] = useState<"yes" | "no" | "in_process">("in_process");
  const [purchaseRange, setPurchaseRange] = useState(ranges[1]);
  const [interest, setInterest] = useState("001");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const progressSteps = useMemo(() => [1, 2, 3, 4], []);

  if (membership.status === "pending" || membership.status === "approved") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-5">
        <Logo />
        <p className="mt-8 text-sm text-muted">Ya tienes una solicitud en curso.</p>
        <Link
          href="/private/status"
          className="mt-6 rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-gold-soft uppercase"
        >
          Ver estado →
        </Link>
      </main>
    );
  }

  function next() {
    setStep((s) => Math.min(4, s + 1));
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submitMembership({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      location,
      purchaseWithin12,
      preApproved,
      purchaseRange,
      interest,
      submittedAt: new Date().toISOString(),
    });
    router.push("/private/status");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] bg-cover bg-center md:block mask-fade-left"
        style={{ backgroundImage: "url(/images/monroe.jpg)" }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col px-5 py-6 md:mx-0 md:max-w-lg md:px-10 md:py-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step === 1 ? router.push("/private") : back())}
            className="rounded-full p-2 text-ink"
            aria-label="Atrás"
          >
            <ArrowLeft size={20} />
          </button>
          <Logo size="sm" href="/" />
          <div className="w-9" />
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          {progressSteps.slice(0, 3).map((n) => (
            <div key={n} className="flex items-center gap-6">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] tracking-wider ${
                  step >= n
                    ? "border border-gold text-gold"
                    : "border border-border text-muted"
                }`}
              >
                {String(n).padStart(2, "0")}
              </span>
              {n < 3 && <span className="hidden h-px w-8 bg-border sm:block" />}
            </div>
          ))}
        </div>

        <div className="mt-10 flex-1">
          <h1 className="text-3xl font-light leading-tight text-ink md:text-4xl">
            CUÉNTANOS QUÉ ESTÁS{" "}
            <span className="script text-gold">buscando</span>.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Para ofrecerte acceso a las mejores oportunidades, necesitamos conocerte un poco
            mejor.
          </p>

          <p className="mt-8 text-[11px] tracking-[0.28em] text-gold uppercase">
            Paso {step} de 4
          </p>

          {step === 1 && (
            <div className="mt-4">
              <h2 className="text-lg font-medium tracking-wide text-ink uppercase">
                ¿Dónde te gustaría vivir?
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {locations.map((loc) => {
                  const selected = location === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setLocation(loc.id)}
                      className={`relative rounded-2xl border px-4 py-5 text-left transition ${
                        selected
                          ? "border-gold bg-gold/[0.06]"
                          : "border-border bg-white hover:border-ink/20"
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-white">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                      <MapPin size={18} className={selected ? "text-gold" : "text-muted"} />
                      <p className="mt-3 text-sm font-medium tracking-wide text-ink">
                        {loc.label}
                      </p>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={next}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[12px] tracking-[0.22em] text-gold-soft uppercase"
              >
                Siguiente <ArrowRight size={16} />
              </button>
              <p className="mt-3 text-center text-xs text-muted">Puedes cambiar esto más adelante</p>
            </div>
          )}

          {step === 2 && (
            <div className="mt-4 space-y-8">
              <fieldset>
                <legend className="text-sm font-medium tracking-wide text-ink uppercase">
                  ¿Planeas comprar en los próximos 12 meses?
                </legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(
                    [
                      ["yes", "Yes"],
                      ["no", "No"],
                      ["unsure", "Not sure"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPurchaseWithin12(value)}
                      className={`rounded-full px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase ${
                        purchaseWithin12 === value
                          ? "bg-ink text-gold-soft"
                          : "border border-border text-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-medium tracking-wide text-ink uppercase">
                  Are you currently pre-approved?
                </legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(
                    [
                      ["yes", "Yes"],
                      ["no", "No"],
                      ["in_process", "In process"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPreApproved(value)}
                      className={`rounded-full px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase ${
                        preApproved === value
                          ? "bg-ink text-gold-soft"
                          : "border border-border text-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="flex-1 rounded-full border border-border py-4 text-[11px] tracking-[0.2em] uppercase"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-ink py-4 text-[12px] tracking-[0.22em] text-gold-soft uppercase"
                >
                  Siguiente <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-4 space-y-8">
              <fieldset>
                <legend className="text-sm font-medium tracking-wide text-ink uppercase">
                  Estimated purchase range
                </legend>
                <div className="mt-4 grid gap-2">
                  {ranges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setPurchaseRange(range)}
                      className={`rounded-2xl border px-4 py-3.5 text-left text-sm ${
                        purchaseRange === range
                          ? "border-gold bg-gold/[0.06] text-ink"
                          : "border-border text-muted"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-medium tracking-wide text-ink uppercase">
                  Which residence interests you?
                </legend>
                <div className="mt-4 grid gap-2">
                  {residences.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setInterest(r.id)}
                      className={`rounded-2xl border px-4 py-3.5 text-left ${
                        interest === r.id
                          ? "border-gold bg-gold/[0.06]"
                          : "border-border"
                      }`}
                    >
                      <p className="text-sm font-medium text-ink">
                        {r.code} — {r.name}
                      </p>
                      <p className="text-xs text-muted">{r.location}</p>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setInterest("future")}
                    className={`rounded-2xl border px-4 py-3.5 text-left text-sm ${
                      interest === "future"
                        ? "border-gold bg-gold/[0.06] text-ink"
                        : "border-border text-muted"
                    }`}
                  >
                    Any future residence
                  </button>
                </div>
              </fieldset>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="flex-1 rounded-full border border-border py-4 text-[11px] tracking-[0.2em] uppercase"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-ink py-4 text-[12px] tracking-[0.22em] text-gold-soft uppercase"
                >
                  Siguiente <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <label className="block">
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Nombre</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-gold"
                />
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Teléfono</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-gold"
                />
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-gold"
                />
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={back}
                  className="flex-1 rounded-full border border-border py-4 text-[11px] tracking-[0.2em] uppercase"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex flex-[1.6] items-center justify-center rounded-full bg-ink py-4 text-[11px] tracking-[0.18em] text-gold-soft uppercase"
                >
                  Submit Private Access Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
