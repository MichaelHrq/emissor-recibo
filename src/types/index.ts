// types.ts
export interface InvoiceItem {
  id: string;
  quantity: number;
  description: string;
  price: number;
}

export interface InvoiceData {
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientCnpj: string;
  items: InvoiceItem[];
}