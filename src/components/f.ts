import { Todos } from "@prisma/client";

export async function fetcher(url : string | URL ): Promise<Todos[]>  {
  const
    response = await fetch(url);
  if (!response.ok) throw new Error('fetch' + response.status);
  return await response.json();
}