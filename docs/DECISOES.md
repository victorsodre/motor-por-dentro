# Decisões e estado

## 2026-11-07 — documentação inicial

- Victor solicitou salvar o plano no VicMind, criar uma pasta para cada projeto, preparar guias de desenvolvimento/identidade, enviar ao GitHub e escrever posts do X para uso posterior.
- Planejamento detalhado criado; prioridade recomendada **5/10**. A prioridade pode mudar após o piloto e a validação de assets.
- Identidade: ovictorlab.com / Laboratório noturno. Interações: referência Fusquinha, adaptadas à pergunta do projeto.
- Repositório inicialmente privado por escolha operacional conservadora nesta fase. O pedido autoriza o envio dos guias; não foi tratado como solicitação de implementar e publicar os aplicativos.
- Nenhuma postagem no X enviada. Textos de protótipo e lançamento têm condições explícitas de uso.

## 2026-11-07 — implementação e aceite local

O pedido posterior de desenvolver todos os projetos autorizou a aplicação. A limitação inicial a documentos foi substituída para desenvolvimento; publicação continua fora desta rodada.

- Um cilindro, centelha, quatro tempos e comando no cabeçote; geometria autoral. OHC genérico, sem copiar OHV Briggs ou configuração histórica Wright.
- Ângulo único 0–720°, slider-crank exato, comando 2:1 e came/seguidor com contato verificado. Válvulas idealizadas sem cruzamento, centelha em 360°.
- Desmontagem por poses de origem; pausa e preservação do ângulo ao remontar. Gases coloridos indicam fase/caminho, não pressão ou vazão.
- Marca oficial, fontes locais e oito grupos. Corte, isolamento, tour, malha, tela cheia, PNG horizontal/vertical. Áudio dispensado para não sugerir RPM real.
- Oito testes, 105 verificações Chrome e build em subpasta aprovados. Celular emulado; sem teste em aparelho físico ou homologação de engenharia.
- Guias e rascunho de bastidor atualizados. Nenhuma postagem enviada; sem deploy.

Próximo da coleção: Amazonas em camadas. Evidência canônica em VALIDACAO.md.

## Como registrar mudanças

Acrescentar data, decisão, motivo, fonte/evidência, arquivos afetados e consequência para o escopo. Separar proposta, implementação, validação e publicação. Preservar decisões antigas com indicação de substituição quando necessário.

## 2026-11-08 — repositório público e GitHub Pages

Victor autorizou aprimorar e tornar públicos os dez projetos com HTML funcional e identidade oficial. Esta decisão substitui a restrição histórica de publicação acima. Incluídos navegação entre os dez sites, canonical/OG/X, prévia real, sitemap, página 404, verificação de caminhos e workflow com testes/build antes do deploy. URL: https://victorsodre.github.io/motor-por-dentro/. Conteúdo e modelo educativo preservados; nenhum post enviado ao X. Procedimento e reversão em PUBLICACAO.md.

## 2026-11-08 — vídeo do canal incorporado

Pedido de Victor: embed abaixo do experimento e thumbnail clicável no README. Vídeo `Cq8wFJlB6Gk`, autoria ovictorlab confirmada pelo oEmbed público. O vídeo explica o turbo. O experimento mostra a base do movimento em um motor de quatro tempos, sem simular o turbo. Player `youtube-nocookie.com`, criado só por clique, `autoplay=0`, controles nativos, referrer de origem e link direto sempre disponível. Capa local para não carregar o YouTube na abertura; layout portrait. Cabeçalho leva à seção `#video`. Identidade preservada; nenhum upload ou alteração de vídeo no canal.

## 2026-11-09 — revisão: turbo, centelha, celular, câmera e SEO

Pedido de Victor ("faça tudo") a partir da revisão dos dez labs. O vídeo de turbo continua (é o mais próximo publicado).

- Modo **Com turbo** (aspirado/turbo): turbina no fim do escape e compressor no mesmo eixo, com duto até a admissão. Fatos só da apuração do EP312 (Garrett, consultada em 28/10/2026). Ilustrativo: sem intercooler, wastegate, pressão ou rotação real; ar mais denso indicado só pela cor. Substitui a exclusão de turbo do escopo inicial.
- Cabeçalho deixou de dizer "Vídeo relacionado: turbo"; contexto do vídeo reescrito.
- Centelha: núcleo, halos aditivos e luz pontual na câmara; "Ver centelha" remonta e abre o corte, onde a faísca é visível.
- Celular: descrição da fase visível, textos ≥ 11 px, alvos ≥ 44 px, ferramentas abaixo do modelo, canvas com `touch-action: pan-y`.
- Câmera: resize, tela cheia e mudanças de modo preservam a órbita; seleção só por toque curto num conjunto, sem pausar.
- SEO: título com termo de busca, texto estático gerado no build (`src/content/seo.ts`) e JSON-LD VideoObject.
- Validação: testes, build e check:pages. Sem conferência visual em navegador nesta rodada (o Chrome estava reservado a outro agente).
