import { writable } from "svelte/store";

export const amount = writable();
export const address = writable();
export const pending = writable(0);
export const received = writable(0);
export const error = writable();
export const mnemonic = writable();
export const unit = writable();
export const ws = writable();
