# Arquitetura implementada

Aplicação estática React 19.2.6, TypeScript 5.9.3, Three.js 0.187.0 e Vite 8.3.6. Node >=22.18; lockfile com versões exatas. Modelagem procedural local, sem backend ou download de modelo.

## Responsabilidades

| Arquivo | Responsabilidade |
|---|---|
| src/App.tsx | Estados de exploração, ângulo, velocidade, desmontagem, pausa e fallback |
| src/simulation/engine.ts | Slider-crank, fases, levantamento de válvulas, envoltória dos cames e relógio |
| src/scene/model.ts | Oito grupos, geometria de corte, cames, válvulas, molas, sincronismo e gases ilustrativos |
| src/scene/rig.ts | Aplica o ângulo e deslocamentos de desmontagem a partir das origens |
| src/scene/runtime.ts | Câmera, renderização, seleção por raio, isolamento, resize e descarte |
| src/scene/camera.ts | Enquadramento por projeção e limites, incluindo vista vertical |
| src/scene/capture.ts | PNG horizontal/vertical e restauração da câmera/renderizador |
| src/content/ | Catálogo, fontes, escopo factual e vídeo relacionado |
| src/ui/ e src/styles.css | Controles HTML, fontes, marca e layout responsivo |

## Contratos

Um ângulo determina toda a mecânica. A biela tem comprimento fixo; seus dois olhos coincidem com os pinos do pistão e da manivela. O comando gira à metade da velocidade. Seu perfil autoral mantém contato com o seguidor plano. Movimento, válvulas e centelha não usam relógios independentes.

0–180° admissão; 180–360° compressão; 360–540° expansão; 540–720° escape. Diagrama idealizado, sem cruzamento. Inicial/reset em 90°, parado. A animação percorre 45°/s em 1×; esse tempo não representa RPM real. Delta limitado a 0,1 s, velocidade 0,5×/1×/2×.

Separar pausa a mecânica. Cada grupo recebe o deslocamento definido no catálogo, multiplicado pelo progresso; a pose angular permanece. Montar retorna ao mesmo ângulo. Girar ou escolher uma etapa remonta o conjunto. O corte e os gases são ocultados durante desmontagem; isolamento oculta contexto e preserva a câmera anterior.

A corrente e as rodas dentadas representam o caminho do sincronismo; proporções, dentes e folgas são educativos, sem projeto de transmissão. Partículas mostram o caminho dos gases, sem dinâmica de fluidos. Não selecionar chão, partículas ou preenchimento de gás.

## Desempenho e falhas

DPR máximo 1,5; até 30 atualizações/s, renderização desligada em repouso e durante ocultação. Sem órbita automática. Geometrias estáticas agrupadas por material; elos usam InstancedMesh. Não há texturas ou áudio externos.

Falha de WebGL mantém catálogo e fontes HTML. Perda de contexto interrompe a animação e oferece recarga. Fontes tipográficas e licenças são locais. PNG é produzido no navegador, sem upload.

Build com base `./`, testado em `/motor-por-dentro/`. Medidas e limites em VALIDACAO.md. Sem pacote compartilhado, publicação automática ou dependência dos outros projetos da coleção.
