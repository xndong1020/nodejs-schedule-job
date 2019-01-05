exports.getBasicAuthHeader = (username, password) => {
  const token = Buffer.from(`${username}:${password}`).toString('base64')
  return {
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'text/xml'
    }
  }
}
