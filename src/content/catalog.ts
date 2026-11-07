const cycle='https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/internal-combustion-engine-otto-cycle/';
const timing='https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/timing-system/';
const operation='https://www.briggsandstratton.com/en-us/support/videos/4-stroke-theory';
export const catalog=[
 {id:'block',label:'Cilindro e cabeçote',detail:'O cilindro guia o pistão. O cabeçote fecha a câmara e recebe as válvulas e a vela.',note:'O corte revela o interior. Arrefecimento, lubrificação e fixações foram simplificados.',source:cycle,offset:[-3.2,0,-.5]},
 {id:'piston',label:'Pistão e pino',detail:'A pressão dos gases atua sobre o pistão. O pino permite que a biela se articule enquanto ele sobe e desce.',note:'O curso é duas vezes o raio da manivela; não há cálculo de pressão ou atrito.',source:cycle,offset:[0,1.5,1.6]},
 {id:'rod',label:'Biela',detail:'Liga o pino do pistão ao pino deslocado do virabrequim. Sua inclinação muda a cada volta.',note:'O comprimento entre os pinos é constante em todo o ciclo.',source:cycle,offset:[0,0,2.8]},
 {id:'crank',label:'Virabrequim e volante',detail:'O conjunto transforma o movimento do pistão em rotação. A inércia do volante ajuda a atravessar os outros tempos.',note:'A animação gira a velocidade constante; não calcula variações de torque ou inércia.',source:operation,offset:[0,-1.1,0]},
 {id:'intake',label:'Admissão',detail:'Com a válvula aberta e o pistão descendo, a mistura de ar e combustível entra no cilindro.',note:'Entrada ilustrativa de mistura já preparada; não há carburador ou injetor simulado.',source:operation,offset:[-2,2.4,1.5]},
 {id:'exhaust',label:'Escape',detail:'O pistão sobe com a válvula de escape aberta, conduzindo os gases para fora.',note:'Abertura limitada ao tempo de escape no diagrama idealizado; motores reais têm outros ajustes.',source:operation,offset:[1.7,.8,-1]},
 {id:'timing',label:'Comando e sincronismo',detail:'O comando faz uma volta para cada duas do virabrequim. Os cames pressionam os seguidores e abrem as válvulas.',note:'Perfil e levantamento autorais. Duas válvulas verticais, sem cruzamento ou ajuste variável.',source:timing,offset:[0,2.2,-1.3]},
 {id:'spark',label:'Vela de ignição',detail:'A centelha inicia a queima da mistura ao final da compressão. Os gases em expansão empurram o pistão.',note:'A centelha em 360° é didática. Motores reais usam avanço de ignição e a queima não é instantânea.',source:timing,offset:[3,2.6,1]},
] as const;
export type PartId=typeof catalog[number]['id'];
