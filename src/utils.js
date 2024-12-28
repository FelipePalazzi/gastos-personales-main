import moment from 'moment'
import theme from './styles/theme'
import { symbols, predefinedColors } from './constants';
import chroma from 'chroma-js';
import { jwtDecode } from "jwt-decode";

export const filterData = (data, search, monedaProp, fechaProp, yearProp) => {
  if (!search) {
    return data;
  } else {
    const searchParts = search.split(' ');
    const totalSearch = searchParts[1] && parseFloat(searchParts[1]) > 0? parseFloat(searchParts[1]) : null;
    const monedaSearch = searchParts[0] && searchParts[1]? searchParts[0].toLowerCase() : null;
    const fechaRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+(\d{4}))?$/i;
    const añoRegex = /^(\d{4})?$/i;
    const fechaMatch = search.match(fechaRegex);
    const añoMatch = search.match(añoRegex);

    if (fechaMatch) {
      const mes = fechaMatch[1].toLowerCase();
      const año = fechaMatch[2]? parseInt(fechaMatch[2]) : null;
      const mesNumerico = moment.utc().month(mes).format('M');

    if (fechaProp) {
      return data.filter((dato) => {
        const fechaDato = moment.utc(dato[fechaProp]);
        return (
          (!año || fechaDato.year() === año) &&
          (fechaDato.month() + 1) === parseInt(mesNumerico)
        );
      });
    } else {
      return data;
    }
  }

    if (añoMatch) {
      const año = parseInt(añoMatch[1]);

    if (yearProp) {
      return data.filter((dato) => {
        const fechaDato = moment.utc(dato[yearProp]);
        return fechaDato.year() === año;
      });
    } else {
      return data
    }
  }

    return data.filter((dato) => {
      if (monedaSearch && totalSearch) {
        if (monedaProp !== '') { 
          return monedaProp.some((prop) => {
            if (!(prop in dato)) return false
            let valor = dato[prop];
            let valoringreso = dato.importe;
            if (monedaSearch === 'ar' && prop === 'totalar') {
              return valor >= totalSearch;
            } else if (monedaSearch === 'uy' && prop === 'total') {
              return valor >= totalSearch;
            } else if (monedaSearch === 'usd' && dato[prop]=='USD') {
              return valoringreso >= totalSearch;
            } else if (monedaSearch === 'uy' && dato[prop]=='UYU') {
              return valoringreso >= totalSearch;
            } else if (monedaSearch === 'ar') {
              if (dato[prop] === 'UYU') {
                valoringreso = (dato.importe / dato.tipocambio).toFixed(2);
              } else if (dato[prop] === 'USD') {
                valoringreso = (dato.importe * dato.tipocambio).toFixed(2);
              } else if (dato[prop] === 'ARG') {
                  valoringreso = dato.importe
              } else {
                valoringreso = 0;
              }
              return valoringreso >= totalSearch;
            }
            return false;
          });
          

      }}else {
        if (dato.responsable)
       { return (
          (dato.responsable.toLowerCase().includes(search.toLocaleLowerCase()) ||
          ('categoria' in dato && (
            dato.tipogasto.toLowerCase().includes(search.toLocaleLowerCase()) ||
            dato.categoria.toLowerCase().includes(search.toLocaleLowerCase())
          )) ||
          ('monedaingreso' in dato && (
            dato.descripcion.toLowerCase().includes(search.toLocaleLowerCase()) ||
            dato.fecha.toString().includes(search.toLocaleLowerCase())
          ))
        )
        );} else { return data }
      }
    });
    
      }
  
};
  export function sortData(data, orden, columna) {
    if (orden === 'no orden') {
      return data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else {
      return data.sort((a, b) => {
        if (columna === 'id') {
          if (a.id > b.id) {
            return orden === 'asc'? -1 : 1;
          }
          if (a.id < b.id) {
            return orden === 'asc'? 1 : -1;
          }
          return 0;
        } else {
          if (a[columna] < b[columna]) {
            return orden === 'asc'? -1 : 1;
          }
          if (a[columna] > b[columna]) {
            return orden === 'asc'? 1 : -1;
          }
          return 0;
        }
      });
    }
  }

  export function getSortIcon(columna, orden, columnaActual) {
    if (columna === columnaActual) {
      if (orden === 'no orden') {
        return theme.icons.minus;
      } else {
        return orden === 'asc'? theme.icons.arriba : theme.icons.abajo;
      }
    }
    return theme.icons.minus;
  }

  export const formatYLabel = (value, selectedMoneda) => {
    const decimalPlaces = selectedMoneda === 'USD' ? 1 : 0;
  
    if (value > 1000 || value < -1000) {
      const absValue = Math.abs(value);
      const formattedValue = `${symbols.peso}${(absValue / 1000).toFixed(decimalPlaces)}${symbols.mil}`;
      return value < 0 ? `-${formattedValue}` : formattedValue;
    } else {
      return `${symbols.peso}${value}`;
    }
  };

  export function getColor(text) {
    if (predefinedColors[text]) {
      return predefinedColors[text];
    }
  
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = Math.imul(31, hash) + text.charCodeAt(i) | 0;
    }
    const hue = (hash % 360);  // Tono
    const color = chroma.hsv(hue, 1, 1).hex();  // Saturación y valor
    return color;
  }

  export function decodeToken (token) {
    try {
        const decoded = jwtDecode(token);
        const keyIds = decoded.keyIds; 
        return keyIds;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
  }
  export function decodeTokenUserId (token) {
    try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId; 
        return userId;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
  }