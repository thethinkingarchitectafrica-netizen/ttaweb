import { ReactNode } from "react";
import Logo from "./Logo";
import ScrollReveal from "./ScrollReveal";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
  watermark?: boolean;
};

export default function Section({ id, eyebrow, title, kicker, children, className, watermark = false }: Props) {
  return (
    <section id={id} className={`section ${className || ""} relative overflow-hidden`}>
      {watermark && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none -z-10 select-none">
          <Logo variant="monogram" size={600} animate={false} />
        </div>
      )}
      <div className="container flex flex-col gap-8">
        <ScrollReveal>
          {(eyebrow || title || kicker) && (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col">
                {eyebrow ? <div className="section-eyebrow">{eyebrow}</div> : null}
                {title ? <h2 className="heading-2 max-w-[20ch]">{title}</h2> : null}
              </div>
              {kicker ? <div className="small-text opacity-50">{kicker}</div> : null}
            </div>
          )}
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          {children}
        </ScrollReveal>
      </div>
    </section>
  );
}
