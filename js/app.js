const properties = [
    {
        id: 'apto1',
        title: 'Apartamento Cobertura Atalaia',
        type: 'apartamento',
        price: 850000,
        area: 145,
        bedrooms: 4,
        bathrooms: 3,
        parking: 3,
        badge: 'Destaque',
        neighborhood: 'Atalaia',
        image: '🏢'
    },
    {
        id: 'apto2',
        title: 'Apartamento Farolândia Luxo',
        type: 'apartamento',
        price: 620000,
        area: 120,
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        badge: null,
        neighborhood: 'Farolândia',
        image: '🏢'
    },
    {
        id: 'casa1',
        title: 'Casa Completa Stio',
        type: 'casa',
        price: 950000,
        area: 250,
        bedrooms: 4,
        bathrooms: 3,
        parking: 4,
        badge: 'Novo',
        neighborhood: 'Stio',
        image: '🏠'
    },
    {
        id: 'apto3',
        title: 'Apartamento Siqueira Jardim',
        type: 'apartamento',
        price: 430000,
        area: 85,
        bedrooms: 2,
        bathrooms: 1,
        parking: 1,
        badge: null,
        neighborhood: 'Siqueira',
        image: '🏢'
    },
    {
        id: 'ter1',
        title: 'Terreno Capitania Nobre',
        type: 'terreno',
        price: 320000,
        area: 500,
        bedrooms: null,
        bathrooms: null,
        parking: null,
        badge: 'Oportunidade',
        neighborhood: 'Capitânia',
        image: '🏗️'
    },
    {
        id: 'com1',
        title: 'Loja Comercial Centro',
        type: 'comercial',
        price: 280000,
        area: 95,
        bedrooms: null,
        bathrooms: 2,
        parking: null,
        badge: null,
        neighborhood: 'Centro',
        image: '🏪'
    },
    {
        id: 'apto4',
        title: 'Apartamento Aruana',
        type: 'apartamento',
        price: 540000,
        area: 110,
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        badge: 'Marítimo',
        neighborhood: 'Atalaia',
        image: '🏢'
    },
    {
        id: 'casa2',
        title: 'Casa Vila Serenidade',
        type: 'casa',
        price: 720000,
        area: 180,
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        badge: null,
        neighborhood: 'Farolândia',
        image: '🏠'
    }
];

const neighborhoodValorization = {
    ativa: { rate: 12, rank: '1º - Melhor bairro' },
    siqueira: { rate: 10, rank: '2º - Em alta' },
    stio: { rate: 9, rank: '3º - Tradicional' },
    farolandia: { rate: 11, rank: '2º - Crescente' },
    jabocardo: { rate: 8, rank: '4º - Em desenvolvimento' },
    coracao: { rate: 10, rank: '2º - Valorizado' },
    santa: { rate: 7, rank: '5º - Estável' },
    capitu: { rate: 9, rank: '3º - Promissor' }
};

const typeMultiplier = {
    apartamento: 1.0,
    casa: 1.15,
    terreno: 0.85,
    comercial: 1.25
};

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function animateCounter(element, target, suffix = '', duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        if (target >= 1000) {
            element.textContent = Math.floor(start).toLocaleString('pt-BR') + suffix;
        } else {
            element.textContent = start.toFixed(1) + suffix;
        }
    }, 16);
}

function renderProperties(filter = 'all') {
    const grid = document.getElementById('propertiesGrid');
    const filtered = filter === 'all' ? properties : properties.filter(p => p.type === filter);
    grid.innerHTML = '';
    filtered.forEach((property, index) => {
        const card = document.createElement('div');
        card.className = 'property-card fade-in';
        card.style.transitionDelay = `${index * 0.1}s`;
        card.dataset.type = property.type;
        card.innerHTML = `
            <div class="property-image">
                ${property.image}
                ${property.badge ? `<span class="property-badge">${property.badge}</span>` : ''}
            </div>
            <div class="property-info">
                <h3>${property.title}</h3>
                <div class="property-meta">
                    ${property.area ? `<span>📐 ${property.area}m²</span>` : ''}
                    ${property.bedrooms ? `<span>🛏️ ${property.bedrooms}</span>` : ''}
                    ${property.bathrooms ? `<span>🚿 ${property.bathrooms}</span>` : ''}
                    ${property.parking ? `<span>🅿️ ${property.parking}</span>` : ''}
                    <span>📍 ${property.neighborhood}</span>
                </div>
                <div class="property-price">${formatCurrency(property.price)}</div>
                <div class="property-actions">
                    <button class="btn btn-outline" onclick="openModal('${property.id}')">Agendar Visita</button>
                    <button class="btn btn-primary" onclick="showToast('Interesse registrado! Vamos te contatar.', 'success')">Detalhes</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }, 50);
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProperties(btn.dataset.filter);
        });
    });
}

function calculateValuation() {
    const value = parseFloat(document.getElementById('propertyValue').value);
    const type = document.getElementById('propertyType').value;
    const area = parseFloat(document.getElementById('propertyArea').value);
    const year = parseInt(document.getElementById('propertyYear').value);
    const neighborhood = document.getElementById('propertyNeighborhood').value;

    if (!value || value <= 0) {
        showToast('Por favor, insira um valor válido para o imóvel.', '');
        return;
    }

    const multiplier = typeMultiplier[type] || 1.0;
    const neighborhoodData = neighborhoodValorization[neighborhood] || { rate: 8 };
    const rate = neighborhoodData.rate * multiplier;
    const currentYear = new Date().getFullYear();
    const age = year ? Math.max(1, currentYear - year) : 10;
    const ageFactor = Math.max(0.7, 1 - (age * 0.005));
    const adjustedRate = rate * ageFactor;

    const projectedValue = Math.round(value * Math.pow(1 + adjustedRate / 100, 5));
    const totalGrowth = projectedValue - value;
    const annualRate = adjustedRate;

    document.getElementById('projectedValue').textContent = formatCurrency(projectedValue);
    document.getElementById('valueGrowth').textContent = `Crescimento: ${formatCurrency(totalGrowth)} em 5 anos`;
    document.getElementById('annualRate').textContent = `${annualRate.toFixed(1)}% ao ano`;
    document.getElementById('marketInfo').textContent = `${neighborhoodData.rank} em Aracaju`;
    document.getElementById('totalReturn').textContent = `+${((projectedValue / value - 1) * 100).toFixed(0)}%`;
    document.getElementById('roiDetail').textContent = `Retorno sobre investimento em 5 anos`;
    document.getElementById('neighborhoodRank').textContent = neighborhoodData.rank;
    document.getElementById('rankDetail').textContent = `Baseado em tendências de ${neighborhood.charAt(0).toUpperCase() + neighborhood.slice(1)}`;

    const results = document.getElementById('analysisResults');
    results.style.opacity = '0';
    results.style.transform = 'translateY(20px)';
    setTimeout(() => {
        results.style.transition = 'all 0.5s ease';
        results.style.opacity = '1';
        results.style.transform = 'translateY(0)';
    }, 100);

    showToast('Análise concluída! Veja os resultados.', 'success');
}

function initAnalysis() {
    document.getElementById('calculateBtn').addEventListener('click', calculateValuation);
}

function openModal(propertyId) {
    document.getElementById('visitProperty').value = propertyId || '';
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function initModal() {
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalOverlay')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    document.getElementById('visitForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('visitName').value;
        const date = document.getElementById('visitDate').value;
        closeModal();
        showToast(`Visita agendada para ${name} em ${date}!`, 'success');
        e.target.reset();
    });
}

function initContact() {
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Mensagem enviada! Entraremos em contato em breve.', 'success');
        e.target.reset();
    });
}

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast' + (type ? ` ${type}` : '');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initNavToggle() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initCounters() {
    const statProps = document.getElementById('statProperties');
    const statSatisfaction = document.getElementById('statSatisfaction');
    const statValorization = document.getElementById('statValorization');

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(statProps, 247);
                animateCounter(statSatisfaction, 1800, '+');
                animateCounter(statValorization, 0, '%');
                statValorization.textContent = '8.5%';
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    heroObserver.observe(document.getElementById('home'));
}

document.addEventListener('DOMContentLoaded', () => {
    renderProperties();
    initFilters();
    initAnalysis();
    initModal();
    initContact();
    initNavbar();
    initNavToggle();
    initScrollAnimations();
    initCounters();

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visitDate').min = today;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.property-card, .result-card, .trend-card, .contact-item').forEach(el => observer.observe(el));
});
