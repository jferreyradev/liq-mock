export function financial(x) {
  return Number.parseFloat(x).toFixed(2)
}

export const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

export const getFechaDMY = (vto) => {
  if (vto) {
    const d = vto.substring(0, 10).split('-')
    return `${d[2]}/${d[1]}/${d[0]}`
  }
  return null
}
