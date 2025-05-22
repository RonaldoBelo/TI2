// Funções de autenticação usando localStorage

// Função para registrar um novo usuário
function registerUser(userData) {
    // Verifica se já existe um usuário com o mesmo email
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === userData.email)) {
        throw new Error('Email já cadastrado');
    }

    // Adiciona o novo usuário
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    // Cria a sessão do usuário
    const session = {
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        type: userData.type || 'client', // 'client' ou 'provider'
        isLoggedIn: true
    };
    localStorage.setItem('currentUser', JSON.stringify(session));

    return session;
}

// Função para fazer login
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Email ou senha inválidos');
    }

    // Cria a sessão do usuário
    const session = {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        type: user.type || 'client',
        isLoggedIn: true,
        address: user.address // Adiciona o endereço do usuário à sessão
    };
    localStorage.setItem('currentUser', JSON.stringify(session));

    return session;
}

// Função para fazer logout
function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    const session = JSON.parse(localStorage.getItem('currentUser'));
    return session && session.isLoggedIn;
}

// Função para obter o usuário atual
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Função para verificar se o usuário é um prestador
function isProvider() {
    const session = getCurrentUser();
    return session && session.type === 'provider';
}

// Função para verificar se o usuário é um cliente
function isClient() {
    const session = getCurrentUser();
    return session && session.type === 'client';
}

// Função para redirecionar baseado no tipo de usuário
function redirectBasedOnUserType() {
    const session = getCurrentUser();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    if (session.type === 'provider') {
        window.location.href = 'provider-dashboard.html';
    } else {
        window.location.href = 'solicitar-orcamento.html';
    }
} 