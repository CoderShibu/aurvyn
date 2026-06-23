import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

type Common = { label: string; error?: string };

const baseField =
  "peer w-full bg-transparent px-0 pb-2 pt-5 text-sm text-text-primary placeholder-transparent focus:outline-none";

function Underline({ error }: { error?: string }) {
  return (
    <>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/12" />
      <span
        className={
          "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100 " +
          (error ? "bg-[color:var(--color-destructive)] scale-x-100" : "bg-gradient-brand")
        }
      />
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="pointer-events-none absolute left-0 top-5 text-sm text-text-tertiary transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-text-secondary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:text-text-secondary"
    >
      {children}
    </label>
  );
}

export const FloatingInput = forwardRef<HTMLInputElement, Common & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, ...props }, ref) => (
    <div className="relative">
      <input ref={ref} placeholder={label} {...props} className={baseField} />
      <Label>{label}</Label>
      <Underline error={error} />
      {error && <p className="mt-1.5 text-xs text-[color:var(--color-destructive)]">{error}</p>}
    </div>
  ),
);
FloatingInput.displayName = "FloatingInput";

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, Common & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, ...props }, ref) => (
    <div className="relative">
      <textarea ref={ref} placeholder={label} {...props} className={baseField + " resize-none"} />
      <Label>{label}</Label>
      <Underline error={error} />
      {error && <p className="mt-1.5 text-xs text-[color:var(--color-destructive)]">{error}</p>}
    </div>
  ),
);
FloatingTextarea.displayName = "FloatingTextarea";

export const FloatingSelect = forwardRef<HTMLSelectElement, Common & SelectHTMLAttributes<HTMLSelectElement>>(
  ({ label, error, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        {...props}
        className="peer w-full appearance-none bg-transparent px-0 pb-2 pt-5 text-sm text-text-primary focus:outline-none"
      >
        {children}
      </select>
      <label className="pointer-events-none absolute left-0 top-0 text-[10px] uppercase tracking-[0.18em] text-text-secondary">
        {label}
      </label>
      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-text-tertiary">▾</span>
      <Underline error={error} />
      {error && <p className="mt-1.5 text-xs text-[color:var(--color-destructive)]">{error}</p>}
    </div>
  ),
);
FloatingSelect.displayName = "FloatingSelect";
