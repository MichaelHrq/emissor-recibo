import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { InvoiceData } from '../types';

const PRIMARY_COLOR = '#29ABE2';
const BORDER_COLOR = '#000000';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10, color: '#000' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoSection: { flexDirection: 'column', alignItems: 'flex-start' },
  logoImage: { width: 'auto', height: 150, marginBottom: 5, objectFit: 'contain' },
  phoneText: { fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
  reciboTitle: { fontSize: 16, color: PRIMARY_COLOR, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginTop: 10 },
  clientInfoContainer: { marginBottom: 15 },
  infoRow: { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-end' },
  label: { width: 60, fontWeight: 'bold', fontSize: 9 },
  valueLine: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#000', paddingLeft: 5, fontSize: 10 },
  tableContainer: { width: '100%', borderTopWidth: 1, borderLeftWidth: 1, borderColor: BORDER_COLOR, marginTop: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: PRIMARY_COLOR, borderBottomWidth: 1, borderColor: BORDER_COLOR, height: 20, alignItems: 'center' },
  headerText: { color: '#FFF', fontWeight: 'bold', fontSize: 9, textAlign: 'center', width: '100%' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: BORDER_COLOR, height: 20, alignItems: 'center' },
  colQty: { width: '15%', borderRightWidth: 1, borderColor: BORDER_COLOR, height: '100%', justifyContent: 'center' },
  colDesc: { width: '50%', borderRightWidth: 1, borderColor: BORDER_COLOR, height: '100%', justifyContent: 'center', paddingLeft: 5 },
  colUnit: { width: '17.5%', borderRightWidth: 1, borderColor: BORDER_COLOR, height: '100%', justifyContent: 'center' },
  colTotal: { width: '17.5%', borderRightWidth: 1, borderColor: BORDER_COLOR, height: '100%', justifyContent: 'center' },
  cellText: { textAlign: 'center', fontSize: 9 },
  cellTextLeft: { textAlign: 'left', fontSize: 9 },
  totalRow: { flexDirection: 'row', backgroundColor: PRIMARY_COLOR, height: 25, alignItems: 'center', borderBottomWidth: 1, borderRightWidth: 1, borderColor: BORDER_COLOR },
  totalLabel: { flex: 1, color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  totalValueBox: { width: '17.5%', height: '100%', justifyContent: 'center', borderLeftWidth: 1, borderColor: BORDER_COLOR, backgroundColor: '#fff' },
  footerSection: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' },
  pixContainer: { width: '40%', alignItems: 'center', border: `1px solid ${PRIMARY_COLOR}`, padding: 10, borderRadius: 5 },
  pixTitle: { fontSize: 10, fontWeight: 'bold', color: PRIMARY_COLOR, marginBottom: 5 },
  qrCode: { width: 100, height: 100 },
  signatureContainer: { width: '50%', alignItems: 'center', marginTop: 40 },
  signatureLine: { width: '100%', borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 5 },
  signatureText: { fontSize: 9 }
});

const formatDateBR = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

interface InvoicePDFProps {
  data: InvoiceData;
  pixPayload: string;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ data, pixPayload }) => {
  const totalGeral = data.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);

  const qrCodeUrl = pixPayload 
    ? `https://quickchart.io/qr?text=${encodeURIComponent(pixPayload)}&size=150&margin=1` 
    : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            <Image src="/logo-sc.jpeg" style={styles.logoImage} />
          </View>
          <Text style={styles.phoneText}>92 99160-2490</Text>
        </View>

        <Text style={styles.reciboTitle}>RECIBO DE SERVIÇO</Text>

        <View style={styles.clientInfoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>CLIENTE</Text>
            <Text style={styles.valueLine}>{data.clientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>ENDEREÇO</Text>
            <Text style={styles.valueLine}>{data.clientAddress}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>FONE</Text>
            <Text style={styles.valueLine}>{data.clientPhone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>CNPJ/CPF</Text>
            <Text style={styles.valueLine}>{data.clientCnpj}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>DATA</Text>
            <Text style={styles.valueLine}>{formatDateBR(data.serviceDate)}</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={styles.colQty}><Text style={styles.headerText}>QUANTIDADE</Text></View>
            <View style={styles.colDesc}><Text style={styles.headerText}>DESCRIÇÃO</Text></View>
            <View style={styles.colUnit}><Text style={styles.headerText}>VL. UNIT</Text></View>
            <View style={styles.colTotal}><Text style={styles.headerText}>VALOR TOTAL</Text></View>
          </View>

          {data.items.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <View style={styles.colQty}>
                <Text style={styles.cellText}>{item.quantity}</Text>
              </View>
              <View style={styles.colDesc}>
                <Text style={styles.cellTextLeft}>{item.description}</Text>
              </View>
              <View style={styles.colUnit}>
                <Text style={styles.cellText}>
                  {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.colTotal}>
                <Text style={styles.cellText}>
                  {(Number(item.quantity) * Number(item.price)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <View style={styles.totalValueBox}>
               <Text style={[styles.cellText, { fontWeight: 'bold' }]}>
                 {totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
               </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection}>
          {qrCodeUrl && (
            <View style={styles.pixContainer}>
              <Text style={styles.pixTitle}>PAGUE VIA PIX</Text>
              <Image src={qrCodeUrl} style={styles.qrCode} />
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};