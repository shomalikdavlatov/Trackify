export const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const money = (n: number) =>
new Intl.NumberFormat(undefined, { style: "currency", currency: "UZS" }).format(n);

export const monthKey = (iso: string) => new Date(iso).toISOString().slice(0, 7);