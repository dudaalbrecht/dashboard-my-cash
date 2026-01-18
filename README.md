# mycash+ 💰

Sistema de gestão financeira familiar desenvolvido com React, TypeScript, Tailwind CSS e preparado para integração com Supabase.

## 🚀 Tecnologias

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **React Router** - Navegação
- **Recharts** - Gráficos
- **Supabase** - Backend (preparado para integração)

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta
cd mycash-plus

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Verificar linting
```

## 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── dashboard/     # Componentes do dashboard
│   │   ├── BalanceCard.tsx
│   │   ├── IncomeCard.tsx
│   │   ├── ExpenseCard.tsx
│   │   ├── CategoryCarousel.tsx
│   │   ├── FlowChart.tsx
│   │   ├── CreditCardsWidget.tsx
│   │   ├── NextExpensesWidget.tsx
│   │   ├── TransactionsTable.tsx
│   │   └── DashboardHeader.tsx
│   ├── layout/        # Componentes de layout
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── HeaderMobile.tsx
│   └── modals/        # Modais
│       ├── NewTransactionModal.tsx
│       ├── AddMemberModal.tsx
│       ├── AddCardModal.tsx
│       ├── CardDetailsModal.tsx
│       └── FiltersMobileModal.tsx
├── contexts/
│   └── FinanceContext.tsx  # Estado global
├── hooks/
│   ├── useMediaQuery.ts
│   └── useSidebar.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Cartoes.tsx
│   ├── Transacoes.tsx
│   ├── Objetivos.tsx
│   └── Perfil.tsx
├── styles/
│   ├── globals.css
│   └── tokens.css
├── types/
│   └── index.ts
├── utils/
│   ├── currency.ts
│   ├── date.ts
│   ├── validation.ts
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 🎨 Design System

O projeto segue um design system baseado no Figma com tokens de:

### Cores
- **Neutral:** #FFFFFF, #E5E7EB, #9CA3AF, #080B12
- **Primary:** #D7FF00 (lime)
- **Semantic:** #2A89EF (blue), #15BE78 (green), #E61E32 (red)

### Espaçamentos
- 0, 8, 12, 16, 20, 24, 32, 56px

### Tipografia
- Font: Inter
- Weights: 400 (Regular), 600 (Semi Bold), 700 (Bold)

### Shapes (Border Radius)
- 2px, 20px, 100px (pill)

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:

| Breakpoint | Range | Tailwind |
|------------|-------|----------|
| Mobile | < 768px | default |
| Tablet | ≥ 768px e < 1280px | `md:` |
| Desktop | ≥ 1280px e < 1920px | `lg:` |
| Wide/4K | ≥ 1920px | `xl:` |

### Navegação
- **Desktop (≥1280px):** Sidebar lateral com estados expanded/collapsed
- **Mobile/Tablet (<1280px):** Header mobile com menu dropdown

## 🗃️ Entidades

### Transaction
Transações financeiras (receitas e despesas)

### Goal
Objetivos financeiros da família

### CreditCard
Cartões de crédito

### BankAccount
Contas bancárias

### FamilyMember
Membros da família

## ✨ Funcionalidades

- ✅ Dashboard com resumo financeiro
- ✅ Gráfico de fluxo financeiro (receitas vs despesas)
- ✅ Carrossel de gastos por categoria
- ✅ Widget de cartões de crédito
- ✅ Widget de próximas despesas
- ✅ Tabela de transações com paginação
- ✅ Filtros globais (membro, período, tipo)
- ✅ Modal de nova transação
- ✅ Modal de adicionar membro
- ✅ Modal de adicionar cartão/conta
- ✅ View completa de cartões
- ✅ View completa de transações
- ✅ View de perfil com configurações
- ✅ Navegação responsiva (sidebar + header mobile)
- ✅ Animações e transições suaves

## 🔮 Próximos Passos

- [ ] Integração com Supabase
- [ ] Autenticação de usuários
- [ ] Sincronização em tempo real
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Exportação de relatórios

## 📄 Licença

Este projeto é privado e de uso exclusivo.

---

Desenvolvido com ❤️ para gestão financeira familiar
