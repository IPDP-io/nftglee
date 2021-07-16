import { writable } from "svelte/store";

export const address = writable(0);
export const pending = writable(0);
export const received = writable(0);
export const unit = writable('BTC');
export const ws = writable();
