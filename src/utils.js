import moment from 'moment'
import theme from './styles/theme'

export const filterData = (data, search, monedaProp, fechaProp) => {
    if (!search) {
      return data;
    } else {
      const searchParts = search.split(' ');
      const totalSearch = searchParts[1] && parseFloat(searchParts[1]) > 0? parseFloat(searchParts[1]) : null;
      const monedaSearch = searchParts[0] && searchParts[1]? searchParts[0].toLowerCase() : null;
      const fechaRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+(\d{4}))?$/i;
      const fechaMatch = search.match(fechaRegex);

      if (fechaMatch) {
        const mes = fechaMatch[1].toLowerCase();
        const año = fechaMatch[2]? parseInt(fechaMatch[2]) : null;
        const mesNumerico = moment.utc().month(mes).format('M');
  
        return data.filter((dato) => {
          const fechaDato = moment.utc(dato[fechaProp]);
          return (
            (!año || fechaDato.year() === año) &&
            (fechaDato.month() + 1) === parseInt(mesNumerico)
          );
        });
      }
  
      return data.filter((dato) => {
        if (monedaSearch && totalSearch) {
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
          } 
          return (
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
          );
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
  
  export function handlePress(gastoId, index, setSelectedGasto, scrollViewRef) {
    setSelectedGasto(gastoId);
    const itemHeight = theme.fontSizes.cell;
    const yOffset = index * itemHeight;
    const newOffset = yOffset;
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: newOffset,
        animated: true,
      });
    }
  }