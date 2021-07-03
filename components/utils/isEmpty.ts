const isEmpty = (val: unknown): boolean => {
  return typeof val === 'undefined' || val === null
}

export default isEmpty