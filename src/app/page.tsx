"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { InvoiceData, InvoiceItem } from "@/types";
import { InvoicePDF } from "@/components/InvoicePDF";
import {
  FileDown,
  Pencil,
  PlusCircle,
  Receipt,
  Save,
  Trash2,
  X,
} from "lucide-react";

// Importação dinâmica do PDF para evitar erros de SSR
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <span className="text-white">Carregando...</span>,
  }
);

// --- FUNÇÃO AUXILIAR DE FORMATAÇÃO (VISUAL) ---
// Transforma "1550" em "R$ 15,50"
const formatCurrencyDisplay = (value: string) => {
  if (!value) return "";
  const number = Number(value) / 100;
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function Home() {
  const [data, setData] = useState<InvoiceData>({
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientCnpj: "",
    items: [],
  });

  // Estado dos inputs (strings puras para facilitar edição)
  const [currentItem, setCurrentItem] = useState({
    quantity: "1",
    description: "",
    price: "0", // Guarda apenas números: "1550" (centavos)
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // Atualizar campos do cliente
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // --- SALVAR ITEM (ADICIONAR OU EDITAR) ---
  const handleSaveItem = () => {
    if (!currentItem.description.trim()) return;
    if (!currentItem.price) return;
    if (!currentItem.quantity) return;

    // CONVERSÃO IMPORTANTE:
    // O input tem "1550" (centavos), mas a tabela precisa de "15.50" (decimal)
    const priceDecimal = (Number(currentItem.price) / 100).toFixed(2);

    if (editingId) {
      // Modo Edição
      setData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === editingId
            ? { ...item, ...currentItem, price: priceDecimal }
            : item
        ),
      }));
      setEditingId(null);
    } else {
      // Modo Adição
      const newItem: InvoiceItem = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        quantity: currentItem.quantity,
        description: currentItem.description,
        price: priceDecimal, // Salva como "15.00"
      };
      setData((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
    }

    // Limpa o formulário
    setCurrentItem({ quantity: "", description: "", price: "" });
  };

  // --- INICIAR EDIÇÃO ---
  const startEditing = (item: InvoiceItem) => {
    setEditingId(item.id);
    setCurrentItem({
      quantity: String(item.quantity),
      description: item.description,
      // CONVERSÃO INVERSA:
      // A tabela tem "15.50", o input precisa de "1550"
      price: (Number(item.price) * 100).toFixed(0),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setCurrentItem({ quantity: "", description: "", price: "" });
  };

  const removeItem = (id: string) => {
    if (id === editingId) cancelEditing();
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
        
        {/* --- CABEÇALHO --- */}
        <div className="bg-linear-to-r from-cyan-600 to-blue-600 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="w-8 h-8 opacity-90" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Emissor de Recibo
            </h1>
          </div>
          <p className="text-cyan-100 text-sm sm:text-base opacity-90">
            Preencha os dados abaixo para gerar recibos personalizados em PDF.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* --- 1. DADOS DO CLIENTE --- */}
          <section>
            <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b pb-2">
              <span className="bg-cyan-100 text-cyan-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Dados do Cliente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">
                  Nome do Cliente
                </label>
                <input
                  name="clientName"
                  value={data.clientName}
                  onChange={handleClientChange}
                  className="w-full text-slate-800 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition placeholder:text-slate-400"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">
                  CPF / CNPJ
                </label>
                <input
                  name="clientCnpj"
                  value={data.clientCnpj}
                  onChange={handleClientChange}
                  className="w-full text-slate-800 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition placeholder:text-slate-400"
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-600">
                  Endereço Completo
                </label>
                <input
                  name="clientAddress"
                  value={data.clientAddress}
                  onChange={handleClientChange}
                  className="w-full text-slate-800 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition placeholder:text-slate-400"
                  placeholder="Rua, Número, Bairro, Cidade"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">
                  Telefone / WhatsApp
                </label>
                <input
                  name="clientPhone"
                  value={data.clientPhone}
                  onChange={handleClientChange}
                  className="w-full text-slate-800 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition placeholder:text-slate-400"
                  placeholder="(00) 90000-0000"
                />
              </div>
            </div>
          </section>

          {/* --- 2. SERVIÇOS / PRODUTOS --- */}
          <section>
            <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b pb-2">
              <span className="bg-cyan-100 text-cyan-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Serviços / Produtos
            </h2>

            {/* FORMULÁRIO DE ITEM */}
            <div
              className={`p-4 rounded-xl border shadow-sm mb-6 transition-colors ${
                editingId
                  ? "bg-blue-50 border-blue-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="mb-2 flex justify-between items-center">
                <span className={`text-xs font-bold uppercase ${editingId ? "text-blue-600" : "text-slate-500"}`}>
                  {editingId ? "Editando Item Selecionado" : "Novo Item"}
                </span>
                {editingId && (
                  <button
                    onClick={cancelEditing}
                    className="text-xs flex items-center text-red-500 hover:text-red-700 font-bold"
                  >
                    <X size={14} className="mr-1" /> Cancelar Edição
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                {/* QTD */}
                <div className="w-full md:w-24">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Qtd
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={currentItem.quantity}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        quantity: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="w-full text-slate-800 border border-slate-300 rounded-lg p-2 focus:ring-cyan-500 outline-none"
                    placeholder="1"
                  />
                </div>

                {/* DESCRIÇÃO */}
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Descrição do Serviço
                  </label>
                  <input
                    type="text"
                    value={currentItem.description}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        description: e.target.value,
                      })
                    }
                    className="w-full text-slate-800 border border-slate-300 rounded-lg p-2 focus:ring-cyan-500 outline-none placeholder:text-slate-400"
                    placeholder="Ex: Instalação de Ar Condicionado"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveItem()}
                  />
                </div>

                {/* VALOR UNITÁRIO (MÁSCARA DE MOEDA) */}
                <div className="w-full md:w-36">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Valor Unit. (R$)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    // Mostra formatado: "R$ 15,50"
                    value={formatCurrencyDisplay(currentItem.price)}
                    // Guarda puro: "1550"
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, "");
                      setCurrentItem({ ...currentItem, price: onlyDigits });
                    }}
                    className="w-full text-slate-800 border border-slate-300 rounded-lg p-2 focus:ring-cyan-500 outline-none"
                    placeholder="R$ 0,00"
                  />
                </div>

                {/* BOTÃO ADICIONAR/SALVAR */}
                <button
                  onClick={handleSaveItem}
                  className={`
                    w-full md:w-auto font-bold py-2.5 px-6 rounded-lg transition shadow-md flex items-center justify-center gap-2
                    ${
                      editingId
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }
                  `}
                >
                  {editingId ? <Save size={18} /> : <PlusCircle size={18} />}
                  <span className="md:hidden">
                    {editingId ? "Salvar Alteração" : "Adicionar"}
                  </span>
                </button>
              </div>
            </div>

            {/* TABELA DE LISTAGEM */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {data.items.length === 0 ? (
                <div className="p-8 text-center bg-white">
                  <p className="text-slate-400 italic">
                    Nenhum item adicionado ainda.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left bg-white min-w-[600px]">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs">
                      <tr>
                        <th className="px-6 py-3 text-center w-20">Qtd</th>
                        <th className="px-6 py-3">Descrição</th>
                        <th className="px-6 py-3 text-right">Unitário</th>
                        <th className="px-6 py-3 text-right">Total</th>
                        <th className="px-6 py-3 w-32 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.items.map((item) => (
                        <tr
                          key={item.id}
                          className={`
                            transition-colors 
                            ${
                              editingId === item.id
                                ? "bg-blue-50"
                                : "hover:bg-slate-50"
                            }
                          `}
                        >
                          <td className="px-6 py-4 text-center font-medium text-slate-700">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-600">
                            {/* Exibe o decimal salvo ("15.50") formatado */}
                            {(Number(item.price) || 0).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-slate-800">
                            {(
                              (Number(item.quantity) || 0) * (Number(item.price) || 0)
                            ).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => startEditing(item)}
                                className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition"
                                title="Editar Item"
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition"
                                title="Remover Item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold text-slate-800">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-4 text-right uppercase text-xs tracking-wider"
                        >
                          Total Geral
                        </td>
                        <td className="px-6 py-4 text-right text-lg text-cyan-700">
                          {data.items
                            .reduce(
                              (acc, i) =>
                                acc + (Number(i.price) || 0) * (Number(i.quantity) || 0),
                              0
                            )
                            .toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* --- 3. BOTÃO DE DOWNLOAD --- */}
          <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-4">
            {data.items.length > 0 && (
              <PDFDownloadLink
                key={JSON.stringify(data)}
                document={<InvoicePDF data={data} />}
                fileName={`Recibo_${data.clientName.split(" ")[0] || "Cliente"}.pdf`}
                className="w-full md:w-auto"
              >
                {({ loading }) => (
                  <button
                    disabled={loading}
                    className={`
                      w-full md:w-auto min-w-[250px] flex items-center justify-center gap-3
                      px-8 py-4 rounded-xl font-bold text-lg duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all
                      ${
                        loading
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-linear-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500"
                      }
                    `}
                  >
                    {loading ? "Gerando Documento..." : (
                      <>
                        <FileDown size={24} />
                        GERAR RECIBO
                      </>
                    )}
                  </button>
                )}
              </PDFDownloadLink>
            )}

            {data.items.length === 0 && (
               <p className="text-sm text-slate-400">
                 Adicione itens para liberar o download.
               </p>
            )}
          </div>
        </div>
      </div>
      <footer className="text-center text-slate-400 text-sm mt-8">
        <p>© {new Date().getFullYear()} • Gerador de Recibos • Michael Henrique</p>
      </footer>
    </div>
  );
}