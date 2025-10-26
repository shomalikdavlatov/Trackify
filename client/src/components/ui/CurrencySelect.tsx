import { useState, useRef, useEffect } from "react";
import { currencies, currencyNames } from "../../utils/constants";

const CurrencySelect: React.FC<
    React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setSelectedValue(value || "");
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;
            const dropdownHeight = 240; 

            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropdownPosition('top');
            } else {
                setDropdownPosition('bottom');
            }
        }
    }, [isOpen]);

    const handleSelect = (currency: string) => {
        setSelectedValue(currency);
        setIsOpen(false);
        
        if (onChange) {
            const syntheticEvent = {
                target: { value: currency },
                currentTarget: { value: currency },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange(syntheticEvent);
        }
    };

    const getDisplayText = () => {
        if (!selectedValue) return "Please select a currency";
        return `${selectedValue} - ${currencyNames[selectedValue as keyof typeof currencyNames]}`;
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700">
                Preferred Currency
            </label>
            <div className="relative mt-1" ref={dropdownRef}>
                <button
                    ref={buttonRef}
                    type="button"
                    className="block w-full rounded-lg border border-slate-300 p-2 text-left focus:border-brand-600 focus:ring focus:ring-brand-200 bg-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={!selectedValue ? "text-slate-400" : ""}>
                        {getDisplayText()}
                    </span>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                </button>
                
                {isOpen && (
                    <div 
                        className={`absolute z-10 w-full bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-auto ${
                            dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                        }`}
                    >
                        {currencies.map((c) => (
                            <div
                                key={c}
                                className="p-2 hover:bg-slate-100 cursor-pointer"
                                onClick={() => handleSelect(c)}
                            >
                                {`${c} - ${currencyNames[c]}`}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencySelect;