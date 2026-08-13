/** Public site mode. Env unlock forces storefront on for deploys. */
export const STOREFRONT_ENV_UNLOCKED =
  import.meta.env.VITE_STOREFRONT_UNLOCKED === 'true'

export const PREVIEW_PASSWORD = 'Ciggos123!'
export const PREVIEW_UNLOCK_KEY = 'cw_storefront_preview'

export function isPreviewUnlocked(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(PREVIEW_UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}

export function unlockPreview(): void {
  window.localStorage.setItem(PREVIEW_UNLOCK_KEY, '1')
  window.dispatchEvent(new Event('cw-preview-unlock'))
}

export function lockPreview(): void {
  window.localStorage.removeItem(PREVIEW_UNLOCK_KEY)
  window.dispatchEvent(new Event('cw-preview-unlock'))
}
