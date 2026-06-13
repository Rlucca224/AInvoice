export interface InvoiceLineItem {
  description: string;
  quantity: number;
  price: number;
}

export interface UploadResponse {
  invoiceId: string;
  fileName: string;
  extractedData: ExtractedInvoiceData;
}

export interface ExtractedInvoiceData {
  provider: string;
  date: string;
  total: number;
  tax: number;
  currency: string;
  category: string;
  paymentMethod: string;
  transactionNumber: string;
  lineItems: InvoiceLineItem[];
}

export interface ConfirmInvoiceRequest {
  invoiceId: string;
  provider: string;
  date: string;
  total: number;
  tax: number;
  currency: string;
  category: string;
  paymentMethod: string;
  transactionNumber: string;
  lineItems: InvoiceLineItem[];
}

export interface ConfirmInvoiceResponse {
  message: string;
}

export interface InvoiceResponse {
  id: string;
  provider: string;
  date: string;
  total: number;
  tax: number;
  currency: string;
  usdTotal: number;
  category: string;
  paymentMethod: string;
  transactionNumber: string;
  lineItems: InvoiceLineItem[];
  createdAt: string;
}
