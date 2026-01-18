# design-system

Ajuste este componente para seguir rigorosamente o design system e tokens.

## Hierarquia de variáveis (OBRIGATÓRIA):

1. **Variável SEMÂNTICA** → usar diretamente (`--color-primary`, `--spacing-container`)
2. **Variável PRIMITIVA** → usar diretamente (`--gray-900`, `--lime-500`)
3. **Valor local (hex, px)** → converter para token mais próximo
4. **Hardcoded** → NUNCA permitido

## Regras de conversão:

### Cores HEX:
- Comparar com primitivas da mesma família
- Escolher a MAIS PRÓXIMA (ex: `#E5E5E5` → `--gray-200`)
- NUNCA inventar tokens (`--gray-195` ❌)

### Espaçamentos:
- Arredondar para escala existente
- Escolher o MAIS PRÓXIMO (ex: `28px` → `--spacing-lg`)
- NUNCA usar valores quebrados (`--spacing-28` ❌)

### Tipografia:
- 400 → normal, 600 → semibold, 700 → bold
- Mapear para escala tipográfica existente

## Formato da resposta:

```
🎨 REVISÃO DE DESIGN SYSTEM

🔍 VALORES HARDCODED ENCONTRADOS
- [linha X]: [valor] — deveria ser [token]

🔧 CONVERSÕES REALIZADAS
- [valor original] → [token] (justificativa)

✅ CONFORMIDADE
- Cores: ✅/❌
- Espaçamentos: ✅/❌
- Tipografia: ✅/❌
- Bordas/Sombras: ✅/❌
```
