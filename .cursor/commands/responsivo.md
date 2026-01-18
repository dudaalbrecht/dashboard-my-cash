# responsivo

Garanta que este layout seja totalmente fluido e responsivo em desktop, tablet e mobile, sem overflow horizontal.

## Checklist de responsividade:

1. **Mobile (< 768px)** — layout em coluna única, touch targets 44x44px
2. **Tablet (≥ 768px)** — 2 colunas quando fizer sentido
3. **Desktop (≥ 1280px)** — 3-4 colunas, sidebar visível
4. **Wide (≥ 1920px)** — max-width para evitar linhas longas

## Regras obrigatórias:

- `width: 100%` em containers principais (NUNCA fixo)
- `max-width` para limitar largura, nunca `width` fixa
- Zero overflow horizontal em qualquer resolução
- Sidebar só no desktop (≥ 1280px)
- Header mobile só em < 1280px
- Inputs com min-height 48px e font-size 16px no mobile

## Breakpoints Tailwind:

- `md:` → 768px (Tablet)
- `lg:` → 1280px (Desktop)
- `xl:` → 1920px (Wide)

## Formato da resposta:

```
📱 REVISÃO DE RESPONSIVIDADE

✅ VALIDAÇÃO POR BREAKPOINT
- 375px (Mobile): ✅/❌ [observações]
- 768px (Tablet): ✅/❌ [observações]
- 1280px (Desktop): ✅/❌ [observações]
- 1920px (Wide): ✅/❌ [observações]

🔧 CORREÇÕES APLICADAS
- [lista de ajustes feitos]

⚠️ PONTOS DE ATENÇÃO
- [lista de itens que precisam de teste manual]
```
