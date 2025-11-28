"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CreditCardContextValue {
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}

const CreditCardContext = React.createContext<CreditCardContextValue>({
  isFlipped: false,
  setIsFlipped: () => {},
});

const CreditCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <CreditCardContext.Provider value={{ isFlipped, setIsFlipped }}>
      <div
        ref={ref}
        className={cn("relative w-full max-w-sm", className)}
        style={{ perspective: "1000px" }}
        {...props}
      />
    </CreditCardContext.Provider>
  );
});
CreditCard.displayName = "CreditCard";

const CreditCardFlipper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isFlipped } = React.useContext(CreditCardContext);

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-56 w-full transition-transform duration-600",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
      {...props}
    >
      {children}
    </div>
  );
});
CreditCardFlipper.displayName = "CreditCardFlipper";

const CreditCardFront = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-0 rounded-xl p-6 shadow-xl",
      "flex flex-col justify-between",
      className
    )}
    style={{ backfaceVisibility: "hidden" }}
    {...props}
  />
));
CreditCardFront.displayName = "CreditCardFront";

const CreditCardBack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-0 rounded-xl p-6 shadow-xl",
      "flex flex-col justify-between",
      className
    )}
    style={{
      backfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
    }}
    {...props}
  />
));
CreditCardBack.displayName = "CreditCardBack";

const CreditCardChip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-10 w-14 rounded bg-gradient-to-br from-yellow-200 to-yellow-400",
      "absolute left-6 top-16",
      className
    )}
    {...props}
  >
    <div className="grid h-full w-full grid-cols-3 gap-px p-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-sm bg-yellow-300/50" />
      ))}
    </div>
  </div>
));
CreditCardChip.displayName = "CreditCardChip";

const CreditCardNumber = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-mono text-xl tracking-wider text-white",
      "p-6",
      className
    )}
    {...props}
  >
    {children || "•••• •••• •••• ••••"}
  </div>
));
CreditCardNumber.displayName = "CreditCardNumber";

const CreditCardName = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm font-semibold uppercase tracking-wide text-white",
      "p-6",
      className
    )}
    {...props}
  >
    {children || "CARDHOLDER NAME"}
  </div>
));
CreditCardName.displayName = "CreditCardName";

const CreditCardExpiry = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
    <div className="text-xs text-white/70">VALID THRU</div>
    <div className="font-mono text-sm text-white">{children || "MM/YY"}</div>
  </div>
));
CreditCardExpiry.displayName = "CreditCardExpiry";

const CreditCardCvv = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
    <div className="text-xs text-white/70">CVV</div>
    <div className="font-mono text-sm text-white">{children || "•••"}</div>
  </div>
));
CreditCardCvv.displayName = "CreditCardCvv";

const CreditCardMagStripe = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute left-0 top-8 h-12 w-full bg-black", className)}
    {...props}
  />
));
CreditCardMagStripe.displayName = "CreditCardMagStripe";

const CreditCardLogo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute right-6 top-6 h-12 w-12", className)}
    {...props}
  />
));
CreditCardLogo.displayName = "CreditCardLogo";

interface CreditCardServiceProviderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type?: "Visa" | "Mastercard" | "Amex" | "Discover";
  format?: "logo" | "text";
}

const CreditCardServiceProvider = React.forwardRef<
  HTMLDivElement,
  CreditCardServiceProviderProps
>(({ className, type = "Visa", format = "logo", ...props }, ref) => {
  if (format === "text") {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute bottom-6 right-6 text-xl font-bold text-white",
          className
        )}
        {...props}
      >
        {type}
      </div>
    );
  }

  // Simple logo representations
  const logos = {
    Visa: (
      <svg viewBox="0 0 48 16" className={cn("h-full w-full", className)}>
        <text
          x="0"
          y="12"
          className="fill-current font-bold"
          style={{ fontSize: "12px" }}
        >
          VISA
        </text>
      </svg>
    ),
    Mastercard: (
      <svg viewBox="0 0 48 32" className={cn("h-full w-full", className)}>
        <circle cx="16" cy="16" r="12" className="fill-red-500" opacity="0.8" />
        <circle
          cx="32"
          cy="16"
          r="12"
          className="fill-yellow-500"
          opacity="0.8"
        />
      </svg>
    ),
    Amex: (
      <svg viewBox="0 0 48 16" className={cn("h-full w-full", className)}>
        <text
          x="0"
          y="12"
          className="fill-current font-bold"
          style={{ fontSize: "10px" }}
        >
          AMEX
        </text>
      </svg>
    ),
    Discover: (
      <svg viewBox="0 0 48 16" className={cn("h-full w-full", className)}>
        <text
          x="0"
          y="12"
          className="fill-current font-bold"
          style={{ fontSize: "9px" }}
        >
          DISCOVER
        </text>
      </svg>
    ),
  };

  return (
    <div
      ref={ref}
      className={cn("absolute bottom-6 right-6 h-8 w-16", className)}
      {...props}
    >
      {logos[type]}
    </div>
  );
});
CreditCardServiceProvider.displayName = "CreditCardServiceProvider";

export {
  CreditCard,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardBack,
  CreditCardChip,
  CreditCardNumber,
  CreditCardName,
  CreditCardExpiry,
  CreditCardCvv,
  CreditCardMagStripe,
  CreditCardLogo,
  CreditCardServiceProvider,
};
