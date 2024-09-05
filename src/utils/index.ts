import { customAlphabet, nanoid } from 'nanoid';
import { format } from 'date-fns';

export const capitalizeFirstLetter = (words) => {
  let separateWord = words.toLowerCase().split('-');
  for (let i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  return separateWord.join('');
};

export const formatCurrency = (value: number): string => {
  if (isNaN(value)) value = 0;
  return Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export const randomCodeNano = () => {
  const date = format(new Date(), 'yyMMdd');
  const nanoid = customAlphabet('1234567890abcdef', 6);
  return date + nanoid().toUpperCase();
};
