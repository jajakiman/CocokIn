"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { CaretUpDown, Check } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
  disabled?: boolean;
}

const SelectContext = createContext<SelectContextType | null>(null);

function useSelect() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a <Select /> provider");
  }
  return context;
}

export interface SelectProps {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

export function Select({
  children,
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  name,
  disabled = false,
}: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        selectedLabel,
        setSelectedLabel,
        disabled,
      }}
    >
      <div ref={containerRef} className="relative w-full">
        {name && <input type="hidden" name={name} value={currentValue} />}
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function SelectTrigger({
  className = "",
  children,
  ...props
}: SelectTriggerProps) {
  const { open, setOpen, disabled } = useSelect();

  return (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls="select-listbox"
      disabled={disabled}
      onClick={() => !disabled && setOpen(!open)}
      className={`flex h-11 w-full items-center justify-between rounded-xl border border-[#D8E1EE] bg-white px-3.5 py-2 text-sm text-[#001040] shadow-sm transition-all hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#006FE6] focus:border-[#006FE6] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <CaretUpDown size={16} weight="bold" className="text-[#53647A] opacity-70 shrink-0 ml-2" />
    </button>
  );
}

export function SelectValue({ placeholder = "Pilih opsi..." }: { placeholder?: string }) {
  const { selectedLabel, value } = useSelect();
  return (
    <span className={`truncate text-left block ${!value && !selectedLabel ? "text-[#53647A]" : "font-medium text-[#001040]"}`}>
      {selectedLabel || value || placeholder}
    </span>
  );
}

export function SelectContent({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { open } = useSelect();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          role="listbox"
          className={`absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-y-auto rounded-xl border border-[#D8E1EE] bg-white p-1.5 shadow-xl ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SelectGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`space-y-0.5 ${className}`}>{children}</div>;
}

export function SelectLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-2.5 py-1.5 text-xs font-bold text-[#53647A] uppercase tracking-wider ${className}`}>
      {children}
    </div>
  );
}

export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function SelectItem({
  value,
  children,
  disabled = false,
  className = "",
  ...props
}: SelectItemProps) {
  const { value: selectedValue, onValueChange, setSelectedLabel } = useSelect();
  const isSelected = selectedValue === value;

  // Sync label when selected
  useEffect(() => {
    if (isSelected && typeof children === "string") {
      setSelectedLabel(children);
    }
  }, [isSelected, children, setSelectedLabel]);

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => {
        if (!disabled) {
          if (typeof children === "string") setSelectedLabel(children);
          onValueChange(value);
        }
      }}
      className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors ${
        isSelected
          ? "bg-[#EAF3FF] font-bold text-[#006FE6]"
          : "text-[#001040] hover:bg-[#F1F5FB] hover:text-[#001040]"
      } ${disabled ? "pointer-events-none opacity-50" : ""} ${className}`}
      {...props}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check size={16} weight="bold" className="text-[#006FE6] shrink-0 ml-2" />}
    </div>
  );
}

export function SelectSeparator() {
  return <div className="my-1 h-px bg-[#D8E1EE]" />;
}
