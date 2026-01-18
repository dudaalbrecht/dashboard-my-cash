# performance

Otimize este código focando em performance.

## Checklist de otimização:

1. **Re-renderizações** — identificar e eliminar renders desnecessários
2. **Memoização** — aplicar useMemo/useCallback/React.memo onde fizer sentido
3. **Lazy loading** — componentes e dados que podem ser carregados sob demanda
4. **Bundle size** — imports que podem ser otimizados
5. **Operações custosas** — loops, cálculos e manipulações que podem ser otimizados

## Regras obrigatórias:

- Não otimizar prematuramente — só onde há impacto real
- Manter legibilidade do código
- Documentar trade-offs de cada otimização
- Não quebrar funcionalidade existente

## Formato da resposta:

```
⚡ OTIMIZAÇÃO DE PERFORMANCE

🔍 PROBLEMAS IDENTIFICADOS
- [lista de gargalos encontrados]

🛠️ OTIMIZAÇÕES APLICADAS
- [mudança]: [impacto esperado]

📈 IMPACTO ESTIMADO
- Renders evitados: [descrição]
- Bundle size: [descrição]
- Tempo de execução: [descrição]

⚠️ TRADE-OFFS
- [lista de trade-offs, se houver]
```
