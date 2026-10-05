import React from 'react';
import { Monitor, Wrench, Users, ShoppingCart, Folder } from 'lucide-react';

// Agora bate EXATAMENTE com o Enum do Java (tudo em maiúsculo)
export const INITIAL_CATEGORIES = [
  'TI', 
  'INFRAESTRUTURA', 
  'RH', 
  'COMPRAS', 
  'FINANCEIRO',
];

// Função para devolver o ícone visual nas tabelas
export const getCategoryIcon = (categoria) => {
  // Garantimos que a string será lida em maiúsculo por precaução
  const catFormatada = categoria ? categoria.toUpperCase() : '';

  switch (catFormatada) {
    case 'TI': 
      return <Monitor className="w-3.5 h-3.5" />;
    case 'INFRAESTRUTURA': 
      return <Wrench className="w-3.5 h-3.5" />;
    case 'RH': 
      return <Users className="w-3.5 h-3.5" />;
    case 'COMPRAS': 
      return <ShoppingCart className="w-3.5 h-3.5" />;
    case 'FINANCEIRO': 
      return <Folder className="w-3.5 h-3.5" />;
    default: 
      return <Folder className="w-3.5 h-3.5" />;
  }
};