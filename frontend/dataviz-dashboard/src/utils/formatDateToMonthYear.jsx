
const formatDateToMonthYear = (input) => {
    if (!input) return '';
  
    const monthMap = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
  
    const str = input.trim().toLowerCase().replace(/[-/]/g, ' ').replace(/\s+/g, ' ');
    const parts = str.split(' ');
  
    // Case: Year only
    if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
      return `Jan ${parts[0]}`;
    }
  
    // Case: month (string) + year
    if (parts.length === 2 && isNaN(parts[0])) {
      const month = monthMap[parts[0].slice(0, 3)];
      const year = parts[1].length === 2 ? '20' + parts[1] : parts[1];
      if (!isNaN(month) && /^\d{4}$/.test(year)) {
        return new Date(+year, month).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      }
    }
  
    // Case: numeric month + year (e.g., 11 24 or 11 2024)
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      let [month, year] = parts.map(Number);
      if (year < 100) year += 2000; // Assume 21st century
      if (month >= 1 && month <= 12) {
        return new Date(year, month - 1).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      }
    }
  
    // Fallback: try to parse with Date
    const parsed = new Date(input);
    if (!isNaN(parsed)) {
      return parsed.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
  
    return input; // fallback if all else fails
  };

  export default formatDateToMonthYear;