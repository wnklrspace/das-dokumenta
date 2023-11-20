function checkData(data: unknown) {
  if (data === undefined || data == null || JSON.stringify(data) === '{}') {
    return false
  } else {
    return true
  }
}

export default checkData
