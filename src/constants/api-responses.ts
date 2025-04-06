export const apiResponseSuccess = (obj: object = {}) => ({
  success: true,
  ...obj
});

export const apiResponseError = (error: string, obj: object = {}) => ({
  success: false,
  error,
  ...obj
});

export const apiResponseData = (obj: object | string = {}) => ({
  success: true,
  data: obj
});
