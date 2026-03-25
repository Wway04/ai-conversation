import qs from 'qs';

export const camelToSnakeCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
};

export const snakeToCamelCase = (str) => {
  return str.replace(/(_\w)/g, (match) => match[1].toUpperCase());
};

export function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function capitalizeFirstLetterOfEachWord(val) {
  return String(val)
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const buildQueryString = (requestParams, options = {}) => {
  const { mapSearchToKeyword = true } = options;
  const activeSorting = requestParams?.sorting?.[0];

  const params = {
    page: (requestParams?.pageIndex ?? 0) + 1,
    limit: requestParams?.pageSize,
    ...(activeSorting?.id && {
      sortBy: activeSorting.id,
      sortDir: activeSorting.desc ? 'desc' : 'asc',
    }),
  };

  requestParams?.columnFilters?.forEach(({ id, value }) => {
    const isEmptyValue =
      value == null || value === 'all' || (Array.isArray(value) ? !value.length : !String(value).length);
    if (isEmptyValue) return;
    params[mapSearchToKeyword && id === 'search' ? 'keyword' : id] = value;
  });

  return qs.stringify(params, { arrayFormat: 'comma', encode: false });
};

export const buildMessageErrorFromServer = (error = {}) => {
  const msgError =
    error?.response?.data?.message || 'Request failed. Please try again or contact administrator';
  return msgError;
};
