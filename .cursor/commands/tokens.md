# tokens

Garanta que todos os valores visuais usem apenas variáveis existentes do design system.

## O que verificar:

- [ ] Cores usando tokens semânticos ou primitivos
- [ ] Espaçamentos usando escala do design system
- [ ] Tipografia usando tokens definidos
- [ ] Bordas e sombras usando variáveis
- [ ] Nenhum valor hardcoded (hex, px arbitrário)

## Valores proibidos:

```tsx
// ❌ NUNCA usar
color: '#E5E5E5'
padding: '28px'
font-size: '15px'
border: '1px solid #ccc'

// ✅ SEMPRE usar
color: 'var(--gray-200)'
padding: 'var(--spacing-lg)'
font-size: 'var(--text-base)'
border: '1px solid var(--border-color)'
```

## Formato da resposta:

```
🏷️ AUDITORIA DE TOKENS

📊 RESUMO
- Total de valores verificados: X
- Usando tokens: Y
- Hardcoded: Z

❌ VALORES HARDCODED
- [linha X]: [valor] → sugestão: [token]

🔧 CORREÇÕES APLICADAS
- [lista de substituições feitas]

✅ STATUS FINAL
- Conformidade: X% → 100%
```
