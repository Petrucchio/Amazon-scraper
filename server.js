import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do axios com headers para simular um navegador real
const axiosConfig = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  },
  timeout: 10000,
};

/**
 * Função para extrair dados dos produtos da página da Amazon
 * @param {string} html - HTML da página da Amazon
 * @returns {Array} Array com os dados dos produtos extraídos
 */
function extractProductData(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const products = [];
  
  // Seletores comuns para produtos da Amazon (podem variar)
  const productSelectors = [
    '[data-component-type="s-search-result"]',
    '.s-result-item',
    '[data-asin]:not([data-asin=""])'
  ];
  
  let productElements = [];
  
  // Tenta diferentes seletores para encontrar produtos
  for (const selector of productSelectors) {
    productElements = document.querySelectorAll(selector);
    if (productElements.length > 0) break;
  }
  
  productElements.forEach((element, index) => {
    try {
      // Extrai título do produto
      const titleElement = element.querySelector('h2 a span, [data-cy="title-recipe-title"], .a-size-mini span');
      const title = titleElement?.textContent?.trim() || 'Título não encontrado';
      
      // Extrai avaliação (estrelas)
      const ratingElement = element.querySelector('.a-icon-alt, [aria-label*="star"]');
      const ratingText = ratingElement?.getAttribute('aria-label') || ratingElement?.textContent || '';
      const rating = ratingText.match(/(\d+\.?\d*)/)?.[1] || 'N/A';
      
      // Extrai número de avaliações/reviews
      const reviewsElement = element.querySelector('a[href*="#customerReviews"] span, .a-size-base');
      const reviewsText = reviewsElement?.textContent?.trim() || '';
      const reviews = reviewsText.match(/\(?([\d,]+)\)?/)?.[1]?.replace(/,/g, '') || '0';
      
      // Extrai URL da imagem
      const imgElement = element.querySelector('img');
      let imageUrl = imgElement?.src || imgElement?.getAttribute('data-src') || 'Imagem não encontrada';
      
      // Remove parâmetros desnecessários da URL da imagem
      if (imageUrl && imageUrl.includes('http')) {
        imageUrl = imageUrl.split('._')[0] + '._AC_UL320_.jpg';
      }
      
      // Só adiciona produtos com dados válidos
      if (title !== 'Título não encontrado') {
        products.push({
          id: index + 1,
          title: title.substring(0, 200), // Limita o título
          rating: rating,
          reviews: reviews,
          imageUrl: imageUrl
        });
      }
    } catch (error) {
      console.error(`Erro ao extrair dados do produto ${index + 1}:`, error.message);
    }
  });
  
  return products;
}

/**
 * Endpoint principal para realizar o scraping
 */
app.get('/api/scrape', async (req, res) => {
  const { keyword } = req.query;
  
  // Validação do parâmetro
  if (!keyword) {
    return res.status(400).json({
      error: 'Parâmetro keyword é obrigatório',
      example: '/api/scrape?keyword=smartphone'
    });
  }
  
  try {
    console.log(`Iniciando scraping para: ${keyword}`);
    
    // Constrói URL de busca da Amazon
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    
    // Adiciona delay para ser mais respeitoso com o servidor
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Faz a requisição para a Amazon
    const response = await axios.get(searchUrl, axiosConfig);
    
    // Extrai os dados dos produtos
    const products = extractProductData(response.data);
    
    // Log para debugging
    console.log(`Produtos encontrados: ${products.length}`);
    
    // Retorna os dados
    res.json({
      success: true,
      keyword: keyword,
      totalProducts: products.length,
      products: products,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro no scraping:', error.message);
    
    // Tratamento específico de erros
    let errorMessage = 'Erro interno do servidor';
    let statusCode = 500;
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Timeout na requisição - tente novamente';
      statusCode = 408;
    } else if (error.response?.status === 403) {
      errorMessage = 'Acesso bloqueado pela Amazon - tente mais tarde';
      statusCode = 403;
    } else if (error.response?.status === 404) {
      errorMessage = 'Página não encontrada';
      statusCode = 404;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      keyword: keyword,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'Amazon Scraper API está funcionando'
  });
});

// Middleware de tratamento de erro global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/scrape?keyword=exemplo`);
});