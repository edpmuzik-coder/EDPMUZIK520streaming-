export default async function handler(request, response) {
  // Base de Dados Cloud ativa criada especificamente para a EDPMUZIK
  const FIREBASE_URL = 'https://firebaseio.com';

  try {
    // Configurações de permissão (CORS) para o Painel e o Index conversarem com a API
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
      return response.status(200).end();
    }

    const urlParams = new URL(request.url, `http://${request.headers.host}`);
    const acaoGet = urlParams.searchParams.get('acao');

    // 1. MÉTODO GET: O site lê as informações guardadas na Nuvem
    if (request.method === 'GET') {
      if (acaoGet === 'get_artistas') {
        const res = await fetch(`${FIREBASE_URL}/pastas.json`);
        const dados = await res.json();
        if (!dados) return response.status(200).json([]);
        // Converte o objeto do Firebase em uma lista/array limpa para o JavaScript
        const listaPastas = Object.keys(dados).map(key => ({ id: key, ...dados[key] }));
        return response.status(200).json(listaPastas);
      }

      // Buscar músicas salvas
      const res = await fetch(`${FIREBASE_URL}/musicas.json`);
      const dados = await res.json();
      if (!dados) return response.status(200).json([]);
      return response.status(200).json(dados);
    }

    // 2. MÉTODO POST: O Painel Administrativo envia novas informações para guardar
    if (request.method === 'POST') {
      const { acao, dados } = request.body || {};

      if (acao === 'artistas') {
        // Salva a nova pasta/projeto dentro do nó 'pastas' no Firebase
        const resFirebase = await fetch(`${FIREBASE_URL}/pastas.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
        const resultado = await resFirebase.json();
        return response.status(200).json(resultado);
      }

      if (acao === 'salvar_tudo_banco') {
        // Atualiza a lista completa de músicas com os novos lançamentos ou downloads
        await fetch(`${FIREBASE_URL}/musicas.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
        return response.status(200).json(dados);
      }
    }

    return response.status(400).json({ erro: 'Ação ou método não suportado.' });

  } catch (error) {
    // Retorna o erro em formato JSON caso falte alguma configuração externa
    return response.status(500).json({ erro: error.message });
  }
}
