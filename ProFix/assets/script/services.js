// Classe para gerenciar os serviços
class ServiceManager {
    constructor() {
        this.services = this.loadServices();
        this.currentProvider = this.loadCurrentProvider();
    }

    // Carrega os serviços do localStorage
    loadServices() {
        const services = localStorage.getItem('services');
        return services ? JSON.parse(services) : [];
    }

    // Carrega o prestador atual do localStorage
    loadCurrentProvider() {
        const provider = localStorage.getItem('currentProvider');
        return provider ? JSON.parse(provider) : null;
    }

    // Adiciona um novo serviço
    addService(service) {
        service.id = Date.now().toString();
        service.status = 'pending';
        service.createdAt = new Date().toISOString();
        this.services.push(service);
        this.saveServices();
        return service;
    }

    // Obtém todos os serviços
    getAllServices() {
        return this.loadServices(); // Sempre retorna os dados mais recentes
    }

    // Obtém serviços por categoria
    getServicesByCategory(category) {
        const services = this.loadServices();
        return services.filter(service => 
            isCategoryMatch(category, service.category)
        );
    }

    // Obtém serviços para o prestador atual
    getServicesForCurrentProvider() {
        if (!this.currentProvider) return [];
        const services = this.loadServices();
        return services.filter(service => 
            isCategoryMatch(this.currentProvider.serviceType, service.category)
        );
    }

    // Atualiza o status de um serviço
    updateServiceStatus(serviceId, status) {
        const services = this.loadServices();
        const serviceIndex = services.findIndex(s => s.id === serviceId);
        
        if (serviceIndex !== -1) {
            services[serviceIndex].status = status;
            localStorage.setItem('services', JSON.stringify(services));
            this.services = services; // Atualiza a instância atual
            return true;
        }
        return false;
    }

    // Salva os serviços no localStorage
    saveServices() {
        localStorage.setItem('services', JSON.stringify(this.services));
    }
}

// Inicializa o gerenciador de serviços
const serviceManager = new ServiceManager();

// Função para criar um card de serviço
function createServiceCard(service) {
    // Garantir que os campos estejam preenchidos corretamente
    const clientName = service.clientName && service.clientName !== 'null' ? service.clientName : 'Cliente';
    const description = service.description && service.description !== 'null' ? service.description : 'Sem descrição';
    const availability = service.availability && service.availability !== 'null - null' ? service.availability : 'Não informado';
    const address = service.address && service.address !== 'null' ? service.address : 'Não informado';
    const budget = service.budget && service.budget !== 'null' ? service.budget : 'Não informado';
    const category = service.category ? service.category.charAt(0).toUpperCase() + service.category.slice(1) : '';

    const card = document.createElement('div');
    card.className = 'col-lg-4 col-md-6';
    card.innerHTML = `
      <div class="service-card custom-service-card">
        <div class="service-card-header d-flex justify-content-between align-items-start">
          <span class="service-icon"><i class="bi bi-tools"></i></span>
          <span class="service-category">${category}</span>
        </div>
        <div class="service-card-body">
          <h5 class="service-client">Solicitado por <span>${clientName}</span></h5>
          <div class="service-description">${description}</div>
          <div class="service-info mt-3">
            <div class="service-info-item"><i class="bi bi-geo-alt"></i> ${address}</div>
            <div class="service-info-item"><i class="bi bi-clock"></i> ${availability}</div>
            <div class="service-info-item"><i class="bi bi-currency-dollar"></i> R$ ${budget}</div>
          </div>
        </div>
        <div class="service-card-footer">
          <a href="#" class="service-link" onclick="handleServiceAction('${service.id}', 'accepted'); return false;">Ver Detalhes / Aceitar</a>
          <a href="#" class="service-link text-danger ms-3" onclick="handleServiceAction('${service.id}', 'rejected'); return false;">Recusar</a>
        </div>
      </div>
    `;
    return card;
}

// Função para lidar com ações de serviço (aceitar/rejeitar/concluir)
function handleServiceAction(serviceId, status) {
    if (serviceManager.updateServiceStatus(serviceId, status)) {
        // Atualiza a lista de serviços na página atual
        loadServices();
        
        // Se estiver na página do dashboard, atualiza o dashboard
        if (window.location.pathname.includes('provider-dashboard.html')) {
            updateDashboard();
        }
        
        // Se aceitou um serviço e não está no dashboard, redireciona para o dashboard
        if (status === 'accepted' && !window.location.pathname.includes('provider-dashboard.html')) {
            window.location.href = 'provider-dashboard.html';
        }
    }
}

// Função para atualizar o dashboard
function updateDashboard() {
    const provider = serviceManager.currentProvider;
    
    if (provider && provider.serviceType) {
        // Obtém todos os serviços atualizados
        const allServices = serviceManager.getAllServices();
        
        // Filtra serviços por categoria do prestador
        const providerServices = allServices.filter(s => 
            isCategoryMatch(provider.serviceType, s.category)
        );

        // Atualiza contadores
        const pendingCount = providerServices.filter(s => s.status === 'pending').length;
        const acceptedCount = providerServices.filter(s => s.status === 'accepted').length;
        const completedCount = providerServices.filter(s => s.status === 'completed').length;

        document.getElementById('pendingServicesCount').textContent = pendingCount;
        document.getElementById('acceptedServicesCount').textContent = acceptedCount;
        document.getElementById('completedServicesCount').textContent = completedCount;

        // Exibe serviços aceitos
        const acceptedServices = providerServices.filter(s => s.status === 'accepted');
        const container = document.getElementById('acceptedServicesContainer');
        
        if (acceptedServices.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum serviço aceito no momento.</p>';
        } else {
            container.innerHTML = acceptedServices.map(service => `
                <div class="dashboard-next-service mb-4 p-3 rounded" style="background:#e3f2fd; box-shadow:0 2px 8px rgba(13,110,253,0.06);">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">${service.category ? service.category.charAt(0).toUpperCase() + service.category.slice(1) : ''}</span>
                        <span class="badge bg-success">Aceito</span>
                    </div>
                    <div><b>Cliente:</b> ${service.clientName || '-'}</div>
                    <div><b>Endereço:</b> ${service.address || '-'}</div>
                    <div><b>Horário:</b> ${service.availability || '-'}</div>
                    <div><b>Orçamento:</b> R$ ${service.budget || '-'}</div>
                    <div><b>Descrição:</b> ${service.description || '-'}</div>
                    <div class="mt-3">
                        <button class="btn btn-success btn-sm" onclick="handleServiceAction('${service.id}', 'completed')">
                            <i class="bi bi-check-circle"></i> Marcar como Concluído
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Função para carregar os serviços
function loadServices() {
    const allServicesContainer = document.getElementById('allServices');
    const categoryServicesContainer = document.getElementById('categoryServices');
    const otherServicesContainer = document.getElementById('otherServices');

    if (allServicesContainer) {
        allServicesContainer.innerHTML = '';
        // Exibe apenas serviços pendentes
        const services = serviceManager.getAllServices().filter(s => s.status === 'pending');
        services.forEach(service => {
            allServicesContainer.appendChild(createServiceCard(service));
        });
    }

    if (categoryServicesContainer) {
        categoryServicesContainer.innerHTML = '';
        // Exibe apenas serviços pendentes da categoria do prestador
        const services = serviceManager.getServicesForCurrentProvider().filter(s => s.status === 'pending');
        services.forEach(service => {
            categoryServicesContainer.appendChild(createServiceCard(service));
        });
    }

    if (otherServicesContainer) {
        otherServicesContainer.innerHTML = '';
        // Exibe apenas serviços pendentes de outras categorias
        const services = serviceManager.getAllServices().filter(service => 
            !isCategoryMatch(serviceManager.currentProvider?.serviceType, service.category) && service.status === 'pending'
        );
        services.forEach(service => {
            otherServicesContainer.appendChild(createServiceCard(service));
        });
    }
}

// Carrega os serviços ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    // Se estiver na página do dashboard, atualiza o dashboard
    if (window.location.pathname.includes('provider-dashboard.html')) {
        updateDashboard();
    }
    // Adicione o CSS customizado para o novo visual dos cards
    if (!document.getElementById('custom-service-card-style')) {
        const style = document.createElement('style');
        style.id = 'custom-service-card-style';
        style.innerHTML = `
          .custom-service-card {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.07);
            padding: 24px 20px 16px 20px;
            margin-bottom: 24px;
            min-height: 320px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .custom-service-card .service-card-header {
            width: 100%;
            margin-bottom: 8px;
          }
          .custom-service-card .service-icon {
            font-size: 2rem;
            color: #222;
          }
          .custom-service-card .service-category {
            font-size: 1rem;
            color: #6c757d;
            font-weight: 600;
            margin-top: 2px;
          }
          .custom-service-card .service-client {
            color: #6c3a5c;
            font-size: 1.15rem;
            font-weight: 500;
            margin-bottom: 4px;
          }
          .custom-service-card .service-client span {
            color: #6c3a5c;
            font-weight: 600;
          }
          .custom-service-card .service-description {
            color: #444;
            font-size: 1rem;
            margin-bottom: 8px;
          }
          .custom-service-card .service-info {
            font-size: 0.98rem;
            color: #555;
          }
          .custom-service-card .service-info-item {
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .custom-service-card .service-card-footer {
            border-top: 1px solid #eee;
            margin-top: 16px;
            padding-top: 10px;
            display: flex;
            align-items: center;
          }
          .custom-service-card .service-link {
            color: #1a237e;
            font-weight: 600;
            text-decoration: none;
            font-size: 1rem;
            transition: color 0.2s;
          }
          .custom-service-card .service-link:hover {
            color: #0d47a1;
            text-decoration: underline;
          }
          .custom-service-card .service-link.text-danger {
            color: #b71c1c;
          }
          .custom-service-card .service-link.text-danger:hover {
            color: #d32f2f;
          }
        `;
        document.head.appendChild(style);
    }
}); 