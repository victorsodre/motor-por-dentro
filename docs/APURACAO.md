# Apuração e contrato educativo — 07/11/2026

Recorte: um cilindro de motor de quatro tempos, ignição por centelha, comando no cabeçote e duas válvulas verticais. Geometria e acionamento autorais; não é réplica de motor do Fusquinha, Briggs, Honda ou Wright. Turbo e diesel permanecem fora da versão.

## Fontes verificadas

- [NASA Glenn — Otto Cycle](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/internal-combustion-engine-otto-cycle/): admissão, compressão, expansão e escape; distinção entre ciclo ideal e perdas reais. Usado no diagrama de fases, sem simular pressão, temperatura ou potência.
- [Briggs & Stratton — 4-stroke theory](https://www.briggsandstratton.com/en-us/support/videos/4-stroke-theory), atualizado 21/01/2026: abertura das válvulas, centelha, duas voltas e papel da inércia do volante. Sua disposição OHV com varetas não é copiada nesta cena OHC.
- [NASA Glenn — Timing System](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/timing-system/): relação 2:1 e came/seguidor; avanço de ignição real. A configuração histórica dos Wright não é a configuração geométrica adotada aqui.
- [Honda — OHC](https://w3.honda-engines-eu.com/en/engines/ohc): comando no cabeçote como arquitetura distinta de OHV. A solução específica Honda usa balancim; a cena adota seguidores planos diretos e não representa esse produto.

## Ângulo único

0–180° admissão; 180–360° compressão; 360–540° expansão; 540–720° escape. Nos pontos de transição as válvulas estão fechadas. Centelha em 360° e ausência de cruzamento/avanços são simplificações explícitas. Um motor real tem duração de queima, abertura/fechamento antecipados ou atrasados e folgas.

Biela de comprimento L=2,7 e raio de manivela R=0,8, em unidades ilustrativas: pino inferior (-R sen θ, R cos θ); pino superior (0, R cos θ + √(L² − R² sen² θ)). A distância entre pinos permanece L. O curso vale 2R. Dimensões não são especificação de motor.

O comando gira θ/2. Levantamento idealizado h = 0,08 sen²(θ − início da fase) somente durante admissão/escape. Perfil de came autoral obtido pela envoltória de seguidor plano: no referencial girado, o contato está em (-dh/dφ, -Rbase-h), com Rbase=0,65 e φ=θ/2. Teste numérico verifica contato em todo o ciclo; não é um projeto para fabricação.

Cores/partículas indicam caminho e etapa; não medem composição ou fluxo. Velocidade é didática, não RPM real. Desmontagem congela a fase e desloca grupos a partir da pose original; não é procedimento de manutenção. Sem cálculo de torque, atrito, lubrificação, resfriamento, emissões ou eficiência.
