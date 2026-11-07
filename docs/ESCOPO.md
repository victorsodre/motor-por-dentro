# Escopo — Motor por dentro

## Pergunta e resultado esperado

Como o movimento dentro do cilindro chega ao eixo? O visitante deve conseguir explicar o mecanismo depois de explorar a cena e acionar seus controles.

Um cilindro de um motor quatro tempos de tipo declarado, com pistão, biela, virabrequim e válvulas. Turbo e alimentação diesel ficam em módulos posteriores, com sua própria apuração.

## Conjuntos da primeira versão

- Cilindro e cabeçote
- Pistão
- Biela
- Virabrequim
- Válvulas e comando
- Caminhos de admissão e escape

Esses grupos são uma proposta semântica; validar sua correspondência com a geometria e as fontes antes de nomear peças como reais.

## Ações principais

| Controle | Comportamento planejado |
|---|---|
| Girar o eixo | Percorre o ciclo com controle contínuo e pausa. |
| Ver etapas | Seleciona uma fase e mostra o que muda no conjunto. |
| Abrir e desmontar | Alterna corte e vista de conjuntos separados, sem perder a pose de referência. |

Base de exploração: órbita, zoom, seleção por lista ou clique, isolamento, reenquadrar e reset. Desmontagem e corte só se aplicam aos conjuntos para os quais forem úteis e tecnicamente coerentes. Som, malha e captura são complementos, posteriores à clareza do mecanismo.

## Estado do mecanismo

`angle determina todas as poses; phase deriva do mesmo ângulo, sem relógios independentes para pistão e válvulas.`

## Critérios específicos de conclusão

- A pose é determinística para um mesmo ângulo, inclusive ao avançar e retroceder.
- O curso e o movimento da biela não se separam geometricamente do virabrequim.
- Escolher ignição por centelha ou compressão e documentar simplificações; não juntar ciclos incompatíveis.

- A pergunta inicial é respondida por uma interação observável, com texto curto e fontes acessíveis.
- O modelo funciona no desktop e no celular de referência, com reset e fallback conferidos.
- Nenhum botão visível é apenas decorativo ou promete função pendente.

## Fora da primeira versão

- Simulação de combustão, emissões, desempenho e diagnóstico de veículo real.
- Turbo, diesel e motor boxer na mesma primeira versão.

Ampliações entram no backlog após o piloto, com evidência de uso e esforço. Não incluir funcionalidades só para repetir todas as opções do Fusquinha.
