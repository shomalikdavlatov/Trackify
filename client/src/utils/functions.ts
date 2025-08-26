export const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const money = (n: number) =>
new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);

export const monthKey = (iso: string) => new Date(iso).toISOString().slice(0, 7); // YYYY-MM