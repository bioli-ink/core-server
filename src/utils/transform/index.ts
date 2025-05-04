/**
 * 二次封装 JSON.parse
 * 给报错时兜底
 */
export const parseJSON = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return typeof jsonString === 'object' ? jsonString : {};
  }
};
