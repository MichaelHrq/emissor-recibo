export interface InvoiceItem {
  id: string;
  quantity: string;
  description: string;
  price: string;
}

export interface InvoiceData {
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientCnpj: string;
  serviceDate: string;
  documentType: "ORCAMENTO" | "RECIBO";
  observations: string;
  items: InvoiceItem[];
}