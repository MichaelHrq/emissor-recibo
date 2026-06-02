import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { InvoiceData } from '../types';

const PRIMARY_COLOR = '#29ABE2';
const BORDER_COLOR = '#000000';

const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontFamily: 'Helvetica', 
    fontSize: 10, 
    color: '#000' 
  },
  
  title: { 
    fontSize: 16, 
    color: PRIMARY_COLOR, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 15,
    textTransform: 'uppercase'
  },

  headerBox: {
    flexDirection: 'row',
    border: `1px solid ${BORDER_COLOR}`,
    height: 80,
  },
  logoCol: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  logoImage: {
    width: '90%',
    maxHeight: 65,
    objectFit: 'contain',
  },
  companyInfoCol: {
    width: '50%',
    borderLeft: `1px solid ${BORDER_COLOR}`,
    borderRight: `1px solid ${BORDER_COLOR}`,
    padding: 8,
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  smallText: {
    fontSize: 8,
    color: '#333',
  },
  companyAddress: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  datesCol: {
    width: '25%',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldTextCenter: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 9,
  },
  textCenter: {
    textAlign: 'center',
    fontSize: 9,
    marginBottom: 5,
  },

  clientBox: {
    border: `1px solid ${BORDER_COLOR}`,
    padding: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  clientLine: {
    fontSize: 9,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },

  tableContainer: { 
    width: '100%', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderColor: BORDER_COLOR, 
  },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: PRIMARY_COLOR, 
    borderBottomWidth: 1, 
    borderColor: BORDER_COLOR, 
    minHeight: 25, 
    alignItems: 'stretch' 
  },
  headerText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 9, 
    textAlign: 'center', 
    width: '100%' 
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: BORDER_COLOR, 
    minHeight: 25, 
    alignItems: 'stretch',
  },
  
  colQty: { width: '15%', borderRightWidth: 1, borderColor: BORDER_COLOR, justifyContent: 'center', paddingVertical: 4 },
  colDesc: { width: '50%', borderRightWidth: 1, borderColor: BORDER_COLOR, justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 4 },
  colUnit: { width: '17.5%', borderRightWidth: 1, borderColor: BORDER_COLOR, justifyContent: 'center', paddingVertical: 4 },
  colTotal: { width: '17.5%', borderRightWidth: 1, borderColor: BORDER_COLOR, justifyContent: 'center', paddingVertical: 4 },

  cellTextCenter: { textAlign: 'center', fontSize: 9 },
  cellTextLeft: { textAlign: 'left', fontSize: 9 },

  totalRow: { 
    flexDirection: 'row', 
    backgroundColor: PRIMARY_COLOR, 
    minHeight: 25, 
    alignItems: 'stretch',
    borderBottomWidth: 1, 
    borderRightWidth: 1, 
    borderColor: BORDER_COLOR 
  },
  totalLabelBox: {
    width: '82.5%', 
    justifyContent: 'center',
    paddingRight: 10,
  },
  totalLabel: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 12, 
    textAlign: 'center',
  },
  totalValueBox: { 
    width: '17.5%', 
    justifyContent: 'center', 
    backgroundColor: '#fff', 
    borderLeftWidth: 1,
    borderColor: BORDER_COLOR,
  },
  totalValueText: {
    fontWeight: 'bold', 
    fontSize: 10,
    textAlign: 'center'
  },

  // --- Observações ---
  observationsBox: {
    marginTop: 15,
    padding: 8,
    border: `1px solid ${BORDER_COLOR}`,
    backgroundColor: '#f9f9f9',
  },
  obsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: PRIMARY_COLOR,
  },
  obsText: {
    fontSize: 9,
    lineHeight: 1.4,
  },

  footerSection: { 
    marginTop: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'stretch', 
  },
  qrCodeBox: {
    width: '48%', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeImage: { 
    width: 120, 
    height: 120 
  },
  bankDetailsBox: {
    width: '48%', 
    justifyContent: 'center',
    paddingLeft: 20,
    borderLeftWidth: 1, 
    borderColor: '#ccc',
  },
  bankTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: PRIMARY_COLOR, 
  },
  bankText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bankLink: {
    textDecoration: 'underline',
  }
});

const formatDateBR = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const getVencimento = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + 15);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

interface InvoicePDFProps {
  data: InvoiceData;
  pixPayload: string;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ data, pixPayload }) => {
  const totalGeral = data.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);

  const qrCodeUrl = pixPayload 
    ? `https://quickchart.io/qr?text=${encodeURIComponent(pixPayload)}&size=200&margin=0` 
    : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* TÍTULO DINÂMICO AQUI */}
        <Text style={styles.title}>
          {data.documentType === 'RECIBO' ? 'RECIBO' : 'ORÇAMENTO'}
        </Text>

        <View style={styles.headerBox}>
          <View style={styles.logoCol}>
            <Image src="/logo-sc.jpeg" style={styles.logoImage} />
          </View>
          
          <View style={styles.companyInfoCol}>
            <Text style={styles.companyName}>Silvestre Climatização</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.smallText}>Cnpj: 66.543.983/0001-10</Text>
              <Text style={styles.smallText}>(92) 9160-2490</Text>
            </View>
            <Text style={styles.companyAddress}>R. Jacamim, 324 - Tarumã - Manaus-AM</Text>
            <Text style={styles.smallText}>Cep: 69021-530</Text>
          </View>
          
          <View style={styles.datesCol}>
            <Text style={styles.boldTextCenter}>Data de criação</Text>
            <Text style={styles.textCenter}>{formatDateBR(data.serviceDate)}</Text>
            
            <Text style={styles.boldTextCenter}>Data de vencimento</Text>
            <Text style={styles.textCenter}>{getVencimento(data.serviceDate)}</Text>
          </View>
        </View>

        <View style={styles.clientBox}>
          <Text style={styles.clientLine}>
            <Text style={styles.boldText}>{data.clientName || 'Nome não informado'}</Text>
          </Text>
          <Text style={styles.clientLine}>
            <Text style={styles.boldText}>CNPJ|CPF: {data.clientCnpj || 'Não informado'}</Text>
          </Text>
          <Text style={[styles.clientLine, { marginTop: 4 }]}>
            <Text style={styles.boldText}>{data.clientAddress || 'Endereço não informado'}</Text>
          </Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={styles.colQty}>
              <Text style={styles.headerText}>QUANTIDADE</Text>
            </View>
            <View style={styles.colDesc}>
              <Text style={styles.headerText}>DESCRIÇÃO</Text>
            </View>
            <View style={styles.colUnit}>
              <Text style={styles.headerText}>VL. UNIT</Text>
            </View>
            <View style={styles.colTotal}>
              <Text style={styles.headerText}>VALOR TOTAL</Text>
            </View>
          </View>

          {data.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.colQty}>
                <Text style={styles.cellTextCenter}>{item.quantity}</Text>
              </View>
              <View style={styles.colDesc}>
                <Text style={styles.cellTextLeft}>{item.description}</Text>
              </View>
              <View style={styles.colUnit}>
                <Text style={styles.cellTextCenter}>
                  {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.colTotal}>
                <Text style={styles.cellTextCenter}>
                  {(Number(item.quantity) * Number(item.price)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.totalRow}>
             <View style={styles.totalLabelBox}>
                <Text style={styles.totalLabel}>TOTAL</Text>
             </View>
             <View style={styles.totalValueBox}>
                <Text style={styles.totalValueText}>
                  {totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
             </View>
          </View>
        </View>

        {/* Bloco de Observações Dinâmico */}
        {data.observations && data.observations.trim() !== '' && (
          <View style={styles.observationsBox}>
            <Text style={styles.obsTitle}>Observações:</Text>
            <Text style={styles.obsText}>{data.observations}</Text>
          </View>
        )}

        <View style={styles.footerSection}>
          {qrCodeUrl && (
            <View style={styles.qrCodeBox}>
              <Image src={qrCodeUrl} style={styles.qrCodeImage} />
            </View>
          )}

          <View style={styles.bankDetailsBox}>
            <Text style={styles.bankTitle}>Dados bancários</Text>
            <Text style={styles.bankText}>
              Agência: {process.env.NEXT_PUBLIC_BANK_AGENCY}
            </Text>
            <Text style={styles.bankText}>
              Conta: {process.env.NEXT_PUBLIC_BANK_ACCOUNT}
            </Text>
            <Text style={styles.bankText}>
              {process.env.NEXT_PUBLIC_BANK_NAME}
            </Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};