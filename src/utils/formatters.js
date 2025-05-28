const numberToWords = (num) => {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  
  const convertToWords = (n) => {
    if (n < 11) return units[n];
    if (n < 20) return teens[n-11];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + units[n%10] : '');
    return units[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + convertToWords(n%100) : '');
  };

  return convertToWords(num);
};

export const formatAmount = (amount, currency = 'INR') => {
  if (!amount) return '₹0';

  const numAmount = Number(amount);
  
  // Format with commas (Indian numbering system)
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(numAmount);

  let amountInWords = '';
  
  // Add words for large amounts
  if (numAmount >= 10000000) {
    const crores = Math.floor(numAmount / 10000000);
    const remainingLakhs = Math.floor((numAmount % 10000000) / 100000);
    amountInWords = `(${numberToWords(crores)} Crore${crores > 1 ? 's' : ''}${remainingLakhs > 0 ? ' ' + numberToWords(remainingLakhs) + ' Lakh' + (remainingLakhs > 1 ? 's' : '') : ''})`;
  } else if (numAmount >= 100000) {
    const lakhs = Math.floor(numAmount / 100000);
    amountInWords = `(${numberToWords(lakhs)} Lakh${lakhs > 1 ? 's' : ''})`;
  } else if (numAmount >= 1000) {
    const thousands = Math.floor(numAmount / 1000);
    amountInWords = `(${numberToWords(thousands)} Thousand${thousands > 1 ? 's' : ''})`;
  }

  return `${formattedAmount} ${amountInWords}`;
};
