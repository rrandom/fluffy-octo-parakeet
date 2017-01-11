
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
}
