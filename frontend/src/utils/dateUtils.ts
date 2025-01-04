export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString();
  };
  
  export const formatDateRange = (startDate: string, endDate: string): string => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };