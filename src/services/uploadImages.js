import { supabase } from "../supabase/supabase";

export async function envImagensStorage(nomeDobalde, arquivo) {
  // verifica se realmente foi passado um arquivo
  if (!arquivo) return null
  // cria e define um nome para o arquivo
  let fileName = `${Date.now()}-${arquivo.name}`
  // Post images live below the authenticated owner's prefix so cleanup cannot
  // target an arbitrary user's image by substituting a public Storage URL.
  if (nomeDobalde === "imagens-posts") {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return null
    const extension = arquivo.type === "image/png" ? ".png" :
      arquivo.type === "image/jpeg" ? ".jpg" : null
    if (!extension) return null
    fileName = `${user.id}/${crypto.randomUUID()}${extension}`
  }
  // aqui ele vai chamar a função para acessar os bucktes do banco
  const { data, error } = await supabase.storage
    .from(nomeDobalde)
    .upload(fileName, arquivo)

  if (error) {
    console.error(error)
    return null
  }
  // se o envio der certo ele busca o Url e retorna pro usuário
  const { data: publicUrlData } = supabase.storage
    .from(nomeDobalde)
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}