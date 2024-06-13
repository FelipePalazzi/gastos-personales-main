# Gestión de Gastos e Ingresos

Esta es una aplicación móvil desarrollada con React Native para gestionar tus gastos e ingresos en las monedas uruguaya (UYU) y argentina (ARG).

## Características

- **Multi-moneda:** Soporte para pesos uruguayos (UYU) y pesos argentinos (ARG), en los ingresos acepta dolares (USD).
- **Gestión de ingresos y gastos:** Permite agregar, editar y eliminar ingresos y gastos.
- **Historial:** Visualiza el historial de tus transacciones.
- **Reportes:** Genera reportes de tus finanzas personales.
- **Interfaz amigable:** Fácil de usar y con un diseño intuitivo.
- **Motor de DB:** Utiliza un motor de base de datos para guardar los datos en la nube

## Requisitos

- Node.js
- npm o yarn
- React Native CLI
- Emulador de Android/iOS o dispositivo físico
- Expo en el caso de que se quiera visualizar

## Instalación

1. Clona el repositorio

    ```sh
    git clone https://github.com/FelipePalazzi/gastos-personales-main.git
    cd gastos-personales-main
    ```

2. Instala las dependencias

    ```sh
    npm install
    # o si usas yarn
    yarn install
    ```

## Uso

**Agregar una transacción:**

Abre la aplicación y selecciona "Ingresos" o "Gastos".
Visualiza la tabla de los ingresos o gastos
Dispone de un filtrar, para buscar por mes, por el tipo de gasto si es un gasto, o un responsable si es un ingreso
Selecciona "Agregar ingresos" o "Agregar gastos" en la parte inferior, completa el formulario con la información requerida.
Guarda la transacción.

**Visualizar resumenes:**

Navega a la sección "Resumen" para ver un resumen de los gastos.
Muestra tablas de los gastos e ingresos por meses con un filtrar

**Generar reportes:**

Una vez visualizado un resumen por mes y año abajo de todo saldra un boton para generar un reporte.


## Contacto

**Autor:** Felipe Palazzi

**Email:** felipepalazzi500@gmail.com

**GitHub:** https://github.com/FelipePalazzi

