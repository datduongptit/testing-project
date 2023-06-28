/* eslint-disable prefer-const */
import * as jwt from 'jsonwebtoken';

export const objectToQuerystring = (obj = {}) => {
  if (!obj || obj.constructor !== Object) return '';
  return Object.keys(obj)
    .reduce((result, key) => {
      if (obj[key] || obj[key] === 0 || obj[key] === false) {
        let value;
        if (obj[key].constructor === String) value = obj[key];
        else value = JSON.stringify(obj[key]);
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }

      return result;
    }, [])
    .join('&');
};

export const parseQueryFromUrl = (url) => {
  let querystring;
  const query = {};
  try {
    querystring = new URL(url).search;
  } catch (e) {
    return null;
  }
  const pairs = (
    querystring[0] === '?' ? querystring.substr(1) : querystring
  ).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const [key, value] = pairs[i].split('=');
    query[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  return query;
};

export const uid = (len = 6) => {
  let id = '',
    ALPHABET =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      Date.now();
  for (let i = 0; i < len; i++) {
    id += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return id;
};

export const unum = (len = 6) => {
  let num = '',
    NUMBER = '0123456789' + Date.now();
  for (let i = 0; i < len; i++) {
    num += NUMBER.charAt(Math.floor(Math.random() * NUMBER.length));
  }
  return num;
};

export const toSlug = (str, mark_space = '-') => {
  str = str.toLowerCase();
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  str = str.replace(/(đ)/g, 'd');
  str = str.replace(/([^0-9a-z-\s])/g, '');
  str = str.replace(/(\s+)/g, mark_space);
  str = str.replace(/^-+/g, '');
  str = str.replace(/-+$/g, '');
  return str;
};

export const convertWeight = (fromUnit, toUnit, value, toFixed) => {
  fromUnit = fromUnit.toUpperCase();
  toUnit = toUnit.toUpperCase();
  const pound = ['LB', 'LBS', 'POUND'];
  const kilogram = ['KG', 'KGS', 'KILOGRAM'];
  const gram = ['G', 'GR', 'GRAM'];
  if (pound.includes(fromUnit.toUpperCase())) {
    fromUnit = 'LB';
  }
  if (pound.includes(toUnit.toUpperCase())) {
    toUnit = 'LB';
  }
  if (kilogram.includes(fromUnit.toUpperCase())) {
    fromUnit = 'KG';
  }
  if (kilogram.includes(toUnit.toUpperCase())) {
    toUnit = 'KG';
  }
  if (gram.includes(fromUnit.toUpperCase())) {
    fromUnit = 'GR';
  }
  if (gram.includes(toUnit.toUpperCase())) {
    toUnit = 'GR';
  }
  if (!toFixed) value = parseInt(value);
  else value = parseFloat(value.toFixed(toFixed));
  if (fromUnit === toUnit) return { value, units: toUnit };
};

export const generateToken = (
  data,
  secret: string = process.env.SHOPIFY_CLIENT_SECRET,
  expiresIn?: number | string,
) => {
  if (expiresIn) return jwt.sign(data, secret, { expiresIn });
  else return jwt.sign(data, secret);
};

export const verifyToken = (
  token: string,
  secret: string = process.env.SHOPIFY_CLIENT_SECRET,
) => {
  return jwt.verify(token, secret);
};
