function verifyProjectName(name: string) {
  if (name.length > 40) {
    return 'NAME_TOO_LONG'
  }

  if (name === '') {
    return 'NAME_EMPTY'
  }

  return 'OK'
}

export default verifyProjectName
