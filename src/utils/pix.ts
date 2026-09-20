import { createStaticPix, hasError, parsePix } from "pix-utils";

export function generateDynamicPix(valor = 0): string {
  const payload = process.env.NEXT_PUBLIC_PIX_PAYLOAD?.trim();
  if (!payload) {
    throw new Error("NEXT_PUBLIC_PIX_PAYLOAD nao esta definido.");
  }

  const parsedPix = parsePix(payload);
  if (hasError(parsedPix)) {
    throw new Error(`Payload PIX invalido: ${parsedPix.message}`);
  }

  if (!("pixKey" in parsedPix)) {
    throw new Error("Payload PIX invalido: o codigo nao e um PIX estatico.");
  }

  const pix = createStaticPix({
    merchantName: parsedPix.merchantName,
    merchantCity: parsedPix.merchantCity,
    pixKey: parsedPix.pixKey,
    transactionAmount: valor,
    infoAdicional: parsedPix.infoAdicional,
    txid: parsedPix.txid,
    fss: parsedPix.fss,
    urlRec: parsedPix.urlRec,
    isTransactionUnique: parsedPix.oneTime,
  });

  if (hasError(pix)) {
    throw new Error(`Nao foi possivel gerar o PIX: ${pix.message}`);
  }

  return pix.toBRCode();
}
