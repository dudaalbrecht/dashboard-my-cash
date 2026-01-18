# layout-fluido

Revise garantindo `width: 100%` em containers principais e uso correto de `max-width`.

## Regras críticas:

1. **Containers de página** — sempre `width: 100%`, nunca largura fixa
2. **Limitação de largura** — usar `max-width`, nunca `width` fixa
3. **Overflow horizontal** — proibido em qualquer resolução
4. **Frames do Figma** — NÃO representam containers fixos no código

## O que verificar:

- [ ] Containers principais usam `w-full` ou `width: 100%`
- [ ] Larguras fixas substituídas por `max-w-*`
- [ ] Nenhum elemento causa scroll horizontal
- [ ] Layout se adapta ao viewport em todas as resoluções

## Padrões corretos:

```tsx
// ✅ CORRETO
<div className="w-full max-w-[1400px] mx-auto">

// ❌ ERRADO
<div className="w-[1400px]">
<div style={{ width: '1400px' }}>
```

## Formato da resposta:

```
🌊 REVISÃO DE LAYOUT FLUIDO

🔍 PROBLEMAS ENCONTRADOS
- [linha X]: [descrição do problema]

🔧 CORREÇÕES APLICADAS
- [antes] → [depois]

✅ VALIDAÇÃO
- Containers principais: ✅/❌
- Uso de max-width: ✅/❌
- Overflow horizontal: ✅/❌
```
