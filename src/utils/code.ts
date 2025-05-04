export const statusTextTransform = (text: string) => {
  return text.replace(/_/g, ' ').toLowerCase();
};
