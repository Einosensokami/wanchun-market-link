export class LiffConfigurationError extends Error {
  constructor() {
    super('LINE Login 尚未設定，請從已設定的 LIFF 入口重新開啟。')
    this.name = 'LiffConfigurationError'
  }
}

export async function getVerifiedLineIdToken(): Promise<string | null> {
  const liffId = import.meta.env.VITE_LIFF_ID
  if (!liffId) throw new LiffConfigurationError()

  const { default: liff } = await import('@line/liff')
  await liff.init({ liffId })
  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: window.location.href })
    return null
  }

  const idToken = liff.getIDToken()
  if (!idToken) throw new Error('無法取得 LINE Login token。')
  return idToken
}
