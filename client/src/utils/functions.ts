export const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const money = (balance: number, currency?: string | null) => {
    if (!currency) currency = "UZS";
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency as string }).format(balance);
}

export const monthKey = (iso: string) => new Date(iso).toISOString().slice(0, 7);