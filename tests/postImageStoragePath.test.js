import assert from "node:assert/strict"
import test from "node:test"
import { postImageStoragePath } from "../src/services/postImageStoragePath.js"

const base = "https://example.supabase.co"
const owned = `${base}/storage/v1/object/public/imagens-posts/user-123/abc.jpg`

test("returns the path only for the signed-in owner's post image", () => {
  assert.equal(postImageStoragePath(owned, base, "user-123"), "user-123/abc.jpg")
  assert.equal(postImageStoragePath(owned, base, "user-999"), null)
})

test("does not delete assets in another bucket or on another host", () => {
  assert.equal(postImageStoragePath(owned.replace("imagens-posts", "avatars"), base, "user-123"), null)
  assert.equal(postImageStoragePath(owned.replace("example.supabase.co", "attacker.example"), base, "user-123"), null)
})

test("does not guess ownership for legacy flat paths", () => {
  assert.equal(postImageStoragePath(`${base}/storage/v1/object/public/imagens-posts/123-old.jpg`, base, "user-123"), null)
})

test("rejects encoded paths, nested files, malformed URLs and missing inputs", () => {
  assert.equal(postImageStoragePath(`${base}/storage/v1/object/public/imagens-posts/user-123/a%2Fb.jpg`, base, "user-123"), null)
  assert.equal(postImageStoragePath(`${owned}/nested.jpg`, base, "user-123"), null)
  assert.equal(postImageStoragePath("not a URL", base, "user-123"), null)
  assert.equal(postImageStoragePath(owned, base, ""), null)
})
