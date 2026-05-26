import { royalEdgeStore } from '@vercel/edge-config';

// Base de dados simulada estável integrada para o plano Hobby gratuito
let bancoDeDadosGlobal = [];
let pastasArtistasGlobal = [];

export default async function handler(request, response) {
  try {
    const { acao, dados } = request.body || {};
    const urlParams = new URL(request.url, `http://${request.headers.host}`);
    const acaoGet = urlParams.searchParams.get('acao');

    // Leitura pública dos dados para os ouvintes
    if (request.method === 'GET') {
      if (acaoGet === 'get_banco') return response.status(200).json(bancoDeDadosGlobal);
      if (acaoGet === 'get_artistas') return response.status(200).json(pastasArtistasGlobal);
      return response.status(200).json(bancoDeDadosGlobal);
    }

    // Gravação vinda do painel administrativo
    if (acao === 'artistas') {
      pastasArtistasGlobal.unshift(dados);
      return response.status(200).json(pastasArtistasGlobal);
    }
    
    if (acao === 'banco') {
      bancoDeDadosGlobal.unshift(dados);
      return response.status(200).json(bancoDeDadosGlobal);
    }

    if (acao === 'salvar_tudo_banco') {
      bancoDeDadosGlobal = dados;
      return response.status(200).json(bancoDeDadosGlobal);
    }

    if (acao === 'get_artistas') return response.status(200).json(pastasArtistasGlobal);
    if (acao === 'get_banco') return response.status(200).json(bancoDeDadosGlobal);

    return response.status(200).json(bancoDeDadosGlobal);
  } catch (error) {
    return response.status(200).json([]); // Evita travar a tela em caso de indisponibilidade
  }
}
