import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function toLocaleDate(date: string): string {
  return format(new Date(date), 'PP', { locale: ptBR });
}
