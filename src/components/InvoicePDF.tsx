import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { InvoiceData } from '../types';

// Cores baseadas na imagem
const PRIMARY_COLOR = '#29ABE2'; 
const BORDER_COLOR = '#000000';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#000',
  },
  // --- Cabeçalho ---
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Alinha o topo do telefone com o topo da logo
    marginBottom: 20,
    height: 100, // Altura fixa para caber a logo grande sem empurrar tudo
  },
  logoSection: {
    alignItems: 'center',
    width: '60%', // Aumentei a largura da seção da logo para ela ter espaço
    // Centraliza a logo na página (ajuste visual para esquerda se preferir)
    marginLeft: 40, 
  },
  logoImage: {
    width: 180, // AUMENTEI AQUI (era 120)
    height: 'auto', 
    marginBottom: 5,
    objectFit: 'contain', // Garante que a imagem não estique
  },
  // Texto pequeno abaixo da logo
  subHeaderBar: {
    backgroundColor: PRIMARY_COLOR,
    color: '#FFF',
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontSize: 7,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 2,
    borderRadius: 2, // Leve arredondamento se suportado (visual)
  },
  phoneText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20, 
    width: '30%', // Reserva espaço para o telefone na direita
  },
  
  // --- Título RECIBO ---
  reciboTitle: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 30, // Mais espaço após a logo grande
  },

  // ... (RESTANTE DOS ESTILOS IGUAL) ...
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
  totalValueBox: { width: '17.5%', height: '100%', justifyContent: 'center', borderLeftWidth: 1, borderColor: BORDER_COLOR, backgroundColor: '#fff' }
});

export const InvoicePDF: React.FC<{ data: InvoiceData }> = ({ data }) => {
  const totalGeral = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Cabeçalho */}
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            <Image src="/logo-sc.png" style={styles.logoImage} />
            
          </View>
          
          <Text style={styles.phoneText}>92 99160-2490</Text>
        </View>

        <Text style={styles.reciboTitle}>RECIBO DE SERVIÇO</Text>

        {/* Dados do Cliente */}
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
            <Text style={styles.label}>CNPJ</Text>
            <Text style={styles.valueLine}>{data.clientCnpj}</Text>
          </View>
        </View>

        {/* Tabela */}
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
                  {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.colTotal}>
                <Text style={styles.cellText}>
                  {(item.quantity * item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
      </Page>
    </Document>
  );
};