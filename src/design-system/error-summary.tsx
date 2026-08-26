"use client";

import { useEffect, useRef } from "react";

export type FormError = {
  fieldId?: string;
  message: string;
};

type ErrorSummaryProps = {
  title?: string;
  errors: FormError[];
};

export function ErrorSummary({
  title = "Terdapat kesalahan pada formulir",
  errors,
}: ErrorSummaryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errors.length > 0 && containerRef.current) {
      containerRef.current.focus();
    }
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <div
      ref={containerRef}
      role="alert"
      tabIndex={-1}
      aria-labelledby="error-summary-title"
      className="error-summary"
    >
      <h2 id="error-summary-title" className="error-summary__title">
        {title}
      </h2>
      <ul className="error-summary__list">
        {errors.map((error, index) => (
          <li key={index}>
            {error.fieldId ? (
              <a href={`#${error.fieldId}`} className="error-summary__link">
                {error.message}
              </a>
            ) : (
              <span>{error.message}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
