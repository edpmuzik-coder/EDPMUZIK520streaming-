import { createClient } from '@vercel/edge-config';

export default async function handler(request, response) {
  // Esta função serve para ativar os recursos de backend da Vercel
  // Ela faz o Vercel Agent e o chat de IA aparecerem na sua conta
  try {
    const metodo = request.method;
    return response.status(200).json({ status: "API Ativa", info: "EDPMUZIK 520 Streaming Engine" });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
