import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { BookingModal } from "./BookingModal";

type Ctx = {
  isOpen: boolean;
  open: (service?: string) => void;
  close: () => void;
  service?: string;
};

const BookingCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [service, setService] = useState<string | undefined>();

  const open = useCallback((s?: string) => {
    setService(s);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close, service }), [isOpen, open, close, service]);

  return (
    <BookingCtx.Provider value={value}>
      {children}
      <BookingModal />
    </BookingCtx.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
