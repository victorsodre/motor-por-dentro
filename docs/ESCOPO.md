# Escopo — Motor por dentro

## Pergunta e resultado esperado

Como o movimento dentro do cilindro chega ao eixo? O visitante deve conseguir explicar o mecanismo depois de explorar a cena e acionar seus controles.

Um cilindro de um motor quatro tempos de tipo declarado, com pistão, biela, virabrequim e válvulas. Turbo entra só como esquema ilustrativo (09/11/2026, ver DECISOES.md); alimentação diesel fica para um módulo posterior, com apuração própria.

## Conjuntos da primeira versão

- Cilindro e cabeçote
- Pistão
- Biela
- Virabrequim
- Válvulas e comando
- Caminhos de admissão e escape

Implementado em oito grupos: block, piston, rod, crank, intake, exhaust, timing e spark. Admissão/escape incluem seus caminhos e válvulas; comando/sincronismo e vela têm seleção própria. Geometria autoral, sem promessa de réplica industrial.

## Ações principais

| Controle | Comportamento entregue |
|---|---|
| Girar o eixo | Ângulo 0–720°, pausa e repetição contínua; velocidades didáticas 0,5×, 1× e 2×. |
| Ver etapas | Admissão, compressão, expansão e escape; atalho para centelha em 360°. |
| Abrir e desmontar | Corte e separação 0–100%; separar pausa e remontar preserva o ângulo. |

Base de exploração: órbita, zoom, seleção por lista ou clique, isolamento, reenquadrar e reset. Desmontagem e corte só se aplicam aos conjuntos para os quais forem úteis e tecnicamente coerentes. Som, malha e captura são complementos, posteriores à clareza do mecanismo.

## Estado do mecanismo

`angle determina todas as poses; phase deriva do mesmo ângulo, sem relógios independentes para pistão e válvulas.`

## Critérios específicos de conclusão

- A pose é determinística para um mesmo ângulo, inclusive ao avançar e retroceder.
- O curso e o movimento da biela não se separam geometricamente do virabrequim.
- Escolher ignição por centelha ou compressão e documentar simplificações; não juntar ciclos incompatíveis.

- A pergunta inicial é respondida por uma interação observável, com texto curto e fontes acessíveis.
- Desktop e celular emulado foram validados, com reset/fallback conferidos; teste em telefone físico não integra a evidência disponível.
- Nenhum botão visível é apenas decorativo ou promete função pendente.

## Fora da primeira versão

- Simulação de combustão, emissões, desempenho e diagnóstico de veículo real.
- Diesel e motor boxer na mesma primeira versão; turbo além do esquema (intercooler, wastegate, pressão, atraso).

Ampliações entram no backlog após o piloto, com evidência de uso e esforço. Não incluir funcionalidades só para repetir todas as opções do Fusquinha.

## Aceite em 07/11/2026

Critérios atendidos em testes e navegador. A distância entre pinos e o contato came/seguidor são verificados numericamente; a geometria e a desmontagem foram conferidas em cena real. Inicial/reset em 90°, com admissão visível e mecanismo parado. Evidência e limites em VALIDACAO.md. Sem simulação de torque ou gases e sem publicação pública.
