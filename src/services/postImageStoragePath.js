// Only post images under the authenticated owner's Storage prefix are
// eligible for deletion. Public URLs are not proof of object ownership.
export function postImageStoragePath(imageUrl, supabaseBaseUrl, userId) {
  if (typeof imageUrl !== "string" || !imageUrl ||
      typeof supabaseBaseUrl !== "string" ||
      typeof userId !== "string" || !userId) return null

  try {
    const asset = new URL(imageUrl)
    const base = new URL(supabaseBaseUrl)
    if (asset.origin !== base.origin || asset.username || asset.password) return null

    const prefix = `${base.pathname.replace(/\/$/, "")}/storage/v1/object/public/imagens-posts/${encodeURIComponent(userId)}/`
    if (!asset.pathname.startsWith(prefix)) return null

    const filename = decodeURIComponent(asset.pathname.slice(prefix.length))
    // Reject nested paths, dot segments and encoded separators.
    if (!filename || filename === "." || filename === ".." ||
        filename.includes("/") || filename.includes("\\") || filename.includes("\0")) {
      return null
    }
    return `${userId}/${filename}`
  } catch {
    return null
  }
}
