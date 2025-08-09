// Configurações da API
const API_BASE_URL = 'http://localhost:3000/api';

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const buttonText = document.querySelector('.button-text');
const loadingSpinner = document.querySelector('.loading-spinner');
const resultsSection = document.getElementById('results');
const errorSection = document.getElementById('error');
const loadingSection = document.getElementById('loading');
const productsContainer = document.getElementById('productsContainer');
const resultsInfo = document.getElementById('resultsInfo');
const errorMessage = document.getElementById('errorMessage');
const retryButton = document.getElementById('retryButton');

// Estado da aplicação
let isLoading = false;
let currentKeyword = '';

/**
 * Inicializa os event listeners
 */
function initializeEventListeners() {
    // Evento do botão de busca
    searchButton.addEventListener('click', handleSearch);
    
    // Evento de Enter no input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSearch();
        }
    });
    
    // Evento do botão de retry
    retryButton.addEventListener('click', () => {
        if (currentKeyword) {
            performSearch(currentKeyword);
        }
    });
    
    // Auto-focus no input
    searchInput.focus();
}

/**
 * Manipula o evento de busca
 */
function handleSearch() {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        showError('Por favor, digite uma palavra-chave para buscar.');
        searchInput.focus();
        return;
    }
    
    if (keyword.length < 2) {
        showError('A palavra-chave deve ter pelo menos 2 caracteres.');
        searchInput.focus();
        return;
    }
    
    currentKeyword = keyword;
    performSearch(keyword);
}

/**
 * Realiza a busca na API
 * @param {string} keyword - Palavra-chave para buscar
 */
async function performSearch(keyword) {
    if (isLoading) return;
    
    try {
        setLoadingState(true);
        hideAllSections();
        showSection(loadingSection);
        
        console.log(`Buscando por: ${keyword}`);
        
        // Faz a requisição para a API
        const response = await fetch(`${API_BASE_URL}/scrape?keyword=${encodeURIComponent(keyword)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `Erro HTTP: ${response.status}`);
        }
        
        if (data.success) {
            displayResults(data);
        } else {
            throw new Error(data.error || 'Erro desconhecido na busca');
        }
        
    } catch (error) {
        console.error('Erro na busca:', error);
        handleSearchError(error);
    } finally {
        setLoadingState(false);
    }
}

/**
 * Exibe os resultados da busca
 * @param {Object} data - Dados retornados pela API
 */
function displayResults(data) {
    hideAllSections();
    
    const { products, totalProducts, keyword, timestamp } = data;
    
    // Atualiza informações dos resultados
    resultsInfo.innerHTML = `
        <strong>${totalProducts}</strong> produtos encontrados para "<strong>${keyword}</strong>"
        <br><small>Última busca: ${formatTimestamp(timestamp)}</small>
    `;
    
    // Limpa container anterior
    productsContainer.innerHTML = '';
    
    if (products && products.length > 0) {
        // Cria cards para cada produto
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    } else {
        // Mostra mensagem quando não há produtos
        productsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <h3>📦 Nenhum produto encontrado</h3>
                <p>Tente buscar com palavras-chave diferentes.</p>
            </div>
        `;
    }
    
    showSection(resultsSection);
    
    // Scroll suave para os resultados
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Cria um card de produto
 * @param {Object} product - Dados do produto
 * @returns {HTMLElement} Elemento DOM do card
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Trata valores padrão
    const title = product.title || 'Título não disponível';
    const rating = product.rating && product.rating !== 'N/A' ? product.rating : 'N/A';
    const reviews = product.reviews ? parseInt(product.reviews).toLocaleString('pt-BR') : '0';
    const imageUrl = product.imageUrl && product.imageUrl !== 'Imagem não encontrada' ? product.imageUrl : 'https://via.placeholder.com/200x200?text=Sem+Imagem';
    
    card.innerHTML = `
        <img 
            src="${imageUrl}" 
            alt="${title}"
            class="product-image"
            onerror="this.src='https://via.placeholder.com/200x200?text=Erro+na+Imagem'"
            loading="lazy"
        />
        <h3 class="product-title" title="${title}">${title}</h3>
        <div class="product-meta">
            <div class="product-rating">
                ${rating !== 'N/A' ? `⭐ ${rating}` : '⭐ N/A'}
            </div>
            <div class="product-reviews">
                ${reviews} avaliações
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Manipula erros na busca
 * @param {Error} error - Objeto de erro
 */
function handleSearchError(error) {
    hideAllSections();
    
    let errorText = 'Ocorreu um erro inesperado. Tente novamente.';
    
    if (error.message.includes('fetch')) {
        errorText = 'Erro de conexão. Verifique se o servidor está rodando e tente novamente.';
    } else if (error.message.includes('403')) {
        errorText = 'Acesso bloqueado pela Amazon. Aguarde alguns minutos antes de tentar novamente.';
    } else if (error.message.includes('timeout')) {
        errorText = 'A busca demorou muito para responder. Tente novamente.';
    } else if (error.message) {
        errorText = error.message;
    }
    
    errorMessage.textContent = errorText;
    showSection(errorSection);
}

/**
 * Define o estado de loading
 * @param {boolean} loading - Se está carregando
 */
function setLoadingState(loading) {
    isLoading = loading;
    searchButton.disabled = loading;
    
    if (loading) {
        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'inline-flex';
    } else {
        buttonText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
}

/**
 * Esconde todas as seções
 */
function hideAllSections() {
    resultsSection.style.display = 'none';
    errorSection.style.display = 'none';
    loadingSection.style.display = 'none';
}

/**
 * Mostra uma seção específica
 * @param {HTMLElement} section - Seção a ser mostrada
 */
function showSection(section) {
    section.style.display = 'block';
}

/**
 * Mostra erro simples
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
    hideAllSections();
    errorMessage.textContent = message;
    showSection(errorSection);
}

/**
 * Formata timestamp para exibição
 * @param {string} timestamp - Timestamp ISO
 * @returns {string} Data formatada
 */
function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Data não disponível';
    }
}

/**
 * Testa conexão com a API
 */
async function testAPIConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        
        if (data.status === 'online') {
            console.log('✅ API conectada:', data.message);
        } else {
            console.warn('⚠️ API com problemas:', data);
        }
    } catch (error) {
        console.error('❌ Erro ao conectar com a API:', error.message);
        console.error('Certifique-se de que o servidor backend está rodando em http://localhost:3000');
    }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Amazon Scraper Frontend iniciado');
    initializeEventListeners();
    testAPIConnection();
});

// Gerenciamento de estado da página
window.addEventListener('beforeunload', () => {
    if (isLoading) {
        return 'Uma busca está em andamento. Tem certeza que deseja sair?';
    }
});