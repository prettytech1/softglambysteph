export type Errors<T extends string> = Partial<Record<T, string>>;

export const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
/** Nigerian numbers: 080…, 0905…, +234…, 234… (10–11 local digits). */
export const isNgPhone = (v: string) => /^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/[\s-]/g, ""));
