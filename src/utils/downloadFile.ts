export const downloadFile = (pdfUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
