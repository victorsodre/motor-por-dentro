/** The four strokes of the idealized cycle and the crank angle that shows each one. */
export const stages = [
  {id: 'intake', label: 'Admissão', angle: 90, detail: 'O pistão desce e a mistura entra.'},
  {id: 'compression', label: 'Compressão', angle: 270, detail: 'O pistão sobe com as válvulas fechadas.'},
  {id: 'power', label: 'Expansão', angle: 450, detail: 'Depois da centelha, os gases empurram o pistão.'},
  {id: 'exhaust', label: 'Escape', angle: 630, detail: 'O pistão sobe e expulsa os gases.'},
] as const;

/** Didactic summary of the illustrative turbo mode (Garrett Motion, see project sources). */
export const turboNote = 'Esquema ilustrativo: o gás de escape gira a turbina e, no mesmo eixo, o compressor empurra ar mais denso para a admissão. Mais ar permite queimar mais combustível.';
