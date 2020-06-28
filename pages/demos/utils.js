export function downloadFile(fileData) {
  const { content, name, type } = fileData;
  const file = new File([content], name, { type });
  const data = window.URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = data;
  link.download = name;
  link.click();

  setTimeout(() => {
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
}
