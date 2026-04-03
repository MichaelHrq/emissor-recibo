export function generateDynamicPix(chave: string, nome: string, cidade: string, valor: number): string {
  const formatValue = (id: string, value: string) => {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  };

  const payloadFormat = '000201';
  const merchantAccountInformation = formatValue('26', 
    formatValue('00', 'BR.GOV.BCB.PIX') + 
    formatValue('01', chave)
  );
  const merchantCategoryCode = formatValue('52', '0000');
  const transactionCurrency = formatValue('53', '986');
  const transactionAmount = valor > 0 ? formatValue('54', valor.toFixed(2)) : '';
  const countryCode = formatValue('58', 'BR');
  
  const merchantName = formatValue('59', nome.substring(0, 25));
  const merchantCity = formatValue('60', cidade.substring(0, 15));
  const additionalDataField = formatValue('62', formatValue('05', '***'));

  const payload = payloadFormat +
    merchantAccountInformation +
    merchantCategoryCode +
    transactionCurrency +
    transactionAmount +
    countryCode +
    merchantName +
    merchantCity +
    additionalDataField +
    '6304';

  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }

  const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return payload + crcHex;
}