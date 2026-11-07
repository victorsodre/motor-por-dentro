# Validação — 07/11/2026

Desenvolvimento validado localmente. Sem deploy público ou postagem social. A cena é um modelo educativo autoral: as limitações mecânicas e factuais estão em [APURACAO.md](APURACAO.md).

## Ambiente e reprodução

Mac, Node 26.7.0, npm 11.19.0 e Chrome com Playwright. Dependências exatas no lockfile; instalação limpa com `npm ci --ignore-scripts`. `npm test`, `npm run check` e `npm run build` passaram. A aplicação requer Node >=22.18 para desenvolvimento; a entrega é estática.

Build servido localmente em `/motor-por-dentro/`, com `base: './'`. Fontes, ícone e bibliotecas carregaram da própria origem. As cinco licenças acessíveis pela interface responderam com sucesso. Não houve erros de página ou respostas HTTP com falha nos fluxos de produção, antes da perda deliberada de contexto WebGL.

## Oito testes automatizados

| Contrato | Evidência |
|---|---|
| Quatro tempos e duas voltas | Fases, limites 0/180/360/540/720° e extremos do pistão |
| Biela rígida | Distância constante entre pinos em 1.441 amostras |
| Válvulas idealizadas | Sequência em 721 ângulos, sem abertura em compressão/expansão ou cruzamento |
| Came e seguidor | Perfil com 1.440 pontos, 73 posições por válvula e tolerância numérica de 0,00003 |
| Reversibilidade | Retorno ao mesmo ângulo, limites e entradas não finitas |
| Relógio | Pausa, ocultação, delta limitado e transição de 720° sem perder o excesso |
| Modelo montado/desmontado | Oito IDs, juntas coincidentes, folgas, 145 poses e restauração das origens |
| Enquadramento | Limites do motor e grupos separados cabem em paisagem, retrato e vista vertical |

Os testes de mecânica e modelo foram escritos antes das implementações correspondentes. Não medem combustão, resistência, torque ou precisão de fabricação.

## 105 verificações no navegador

81 verificações no servidor de desenvolvimento e 24 no build estático:

- Um canvas; estado inicial/reset em 90°; renderizador parado em repouso.
- Girar, pausar, escolher velocidade, avançar/retroceder pelo ângulo e completar as duas voltas.
- Saltar para as quatro etapas e a centelha; separar congela o mecanismo, montar preserva o ângulo e girar remonta primeiro.
- Busca, oito seleções/isolamentos com restauração da câmera, tour completo, clique na cena e órbita sem seleção acidental.
- Zoom, reenquadramento, corte, malha, reset por teclado, fontes e mudança de preferência de movimento reduzido.
- Menu de peças e isolamento em viewport móvel; layout sem transbordamento horizontal.
- Tela cheia, exports horizontal/vertical com restauração exata da câmera e carregamento em subpasta.
- Perda de contexto e WebGL indisponível: mensagem útil, reprodução/captura desabilitadas e catálogo HTML acessível; recarga recupera a cena.
- Handler de visibilidade: mecanismo e renderização param quando `document.hidden` é controlado no teste e retomam ao desfazer essa condição. Não houve confirmação da transição nativa entre abas.

O primeiro lote antecede o acabamento da cor dos gases. O segundo lote usa o build final com esse acabamento, incluindo renderização e exports. Logs locais em `output/browser-qa.log` e `output/production-qa.log`; não são dependências do aplicativo.

## Inspeção visual

Capturas reais do Chrome conferidas em desktop 1440×980, retrato 390×844 e paisagem 844×390. A paisagem usa layout rolável. Estados inspecionados: motor inteiro, corte, expansão, sincronismo isolado, biela isolada e desmontagem. Ajustados o espaço dos rótulos abaixo da cena, o contraste da corrente, o preenchimento do controle angular e a cor indicativa dos gases.

PNG final conferido nos dois formatos: 1920×1080 (1.547.429 bytes) e 1080×1920 (1.270.357 bytes). Marca, título, cena e rodapé permanecem no quadro. Arquivos em `output/playwright/export-horizontal-final.png` e `export-vertical-final.png`; capturas e logs ficam ignorados pelo Git.

## Medidas e limites

- JavaScript: 837.100 bytes, 226,93 kB gzip; CSS: 19.634 bytes, 4,85 kB gzip.
- Nas poses amostradas: 89–103 chamadas e 106.604–107.724 triângulos por quadro, incluindo sombras. Não equivalem a polígonos únicos do modelo.
- DPR limitado a 1,5 e atualização até 30 vezes/s. Isso não é um benchmark ou garantia de FPS em telefone.
- Vite emitiu aviso de chunk acima de 500 kB; build concluído. Three.js está no pacote inicial.
- Validação móvel por viewport no Chrome do Mac. Sem aparelho físico, Safari/iOS ou ensaio de rede lenta.
- Sem auditoria formal de acessibilidade ou homologação de engenharia. A interface declara ciclo idealizado, dimensões ilustrativas, ausência de avanço/cruzamento e velocidade didática.

Reproduzir os fluxos de [MANUTENCAO.md](MANUTENCAO.md) quando mecanismo, câmera, controles ou dependências mudarem. Divulgação e deploy permanecem posteriores.
