import type { ConversionLogEntry } from "../type"

const STORAGE_KEY = "fx-log"

export function getLog(): ConversionLogEntry[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
}

export function setLog(log: ConversionLogEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
}

export function addLogEntry(log: ConversionLogEntry[], entry: ConversionLogEntry): ConversionLogEntry[] {
  return [...log, entry]
}
