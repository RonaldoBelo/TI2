// Configuração centralizada de categorias de serviço
const SERVICE_CATEGORIES = {
    eletricista: {
        id: 'eletricista',
        name: 'Eletricista',
        description: 'Serviços de instalação e manutenção elétrica',
        keywords: ['eletrica', 'eletricista', 'instalação elétrica', 'manutenção elétrica']
    },
    encanador: {
        id: 'encanador',
        name: 'Encanador',
        description: 'Serviços de encanamento e hidráulica',
        keywords: ['hidraulica', 'encanador', 'encanamento', 'vazamento']
    },
    pedreiro: {
        id: 'pedreiro',
        name: 'Pedreiro',
        description: 'Serviços de construção e reparos',
        keywords: ['reparos', 'pedreiro', 'construção', 'reforma']
    },
    pintor: {
        id: 'pintor',
        name: 'Pintor',
        description: 'Serviços de pintura',
        keywords: ['pintura', 'pintor', 'pintar']
    },
    jardineiro: {
        id: 'jardineiro',
        name: 'Jardineiro',
        description: 'Serviços de jardinagem',
        keywords: ['jardinagem', 'jardineiro', 'poda', 'jardim']
    },
    diarista: {
        id: 'diarista',
        name: 'Diarista',
        description: 'Serviços de limpeza e organização',
        keywords: ['limpeza', 'diarista', 'faxina', 'organização']
    }
};

// Função para obter todas as categorias
function getAllCategories() {
    return Object.values(SERVICE_CATEGORIES);
}

// Função para obter uma categoria pelo ID
function getCategoryById(id) {
    return SERVICE_CATEGORIES[id];
}

// Função para encontrar uma categoria por palavra-chave
function findCategoryByKeyword(keyword) {
    keyword = keyword.toLowerCase();
    return Object.values(SERVICE_CATEGORIES).find(category => 
        category.keywords.some(k => k.toLowerCase().includes(keyword))
    );
}

// Função para verificar se uma categoria corresponde a um serviço
function isCategoryMatch(categoryId, serviceCategory) {
    const category = SERVICE_CATEGORIES[categoryId];
    if (!category) return false;
    
    return category.keywords.some(keyword => 
        serviceCategory.toLowerCase().includes(keyword.toLowerCase())
    );
} 