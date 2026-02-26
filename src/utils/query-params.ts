export function valueOrUndefined(value: string) {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

export function dateInputToIso(value: string) {
  if (!value) {
    return undefined
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed.toISOString()
}

