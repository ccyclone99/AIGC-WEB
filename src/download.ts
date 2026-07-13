const triggerDownload = (url: string, fileName: string) => {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export async function downloadMedia(url: string, fileName: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Download failed with ${response.status}`)

    const objectUrl = URL.createObjectURL(await response.blob())
    triggerDownload(objectUrl, fileName)
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000)
    return true
  } catch {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    return false
  }
}
