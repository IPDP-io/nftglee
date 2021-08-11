import { writable } from "svelte/store";

export const amount = writable();
export const address = writable();
export const full = writable();
export const loading = writable();
export const initialized = writable();
export const player = writable();
export const received = writable(0);
export const error = writable();
export const mnemonic = writable();
export const ticket = writable();
export const token = writable();
export const unit = writable();
export const ws = writable();
