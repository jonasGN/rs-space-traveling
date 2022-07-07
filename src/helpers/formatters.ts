import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function toLocaleDate(date: string): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: ptBR });
}

/**
 * Return the estimate time in minutes of a text based in `n`
 */
export function toEstimateReadingTime(n: number): string {
  const wordsPerMinute = 200;
  return `${Math.ceil(n / wordsPerMinute)} min`;
}
