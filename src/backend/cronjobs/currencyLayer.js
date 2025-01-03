const axios = require('axios');
const cron = require('node-cron');
const pool = require('../db/dbConnection.js');
require('dotenv').config();

cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando actualización de tipos de cambio USD...');

    try {
        const responseUSD = await axios.get(`${process.env.PAGINA_API_MONEDA_CAMBIO}`, {
            params: {
                access_key: process.env.KEY_API_MONEDA_CAMBIO,
                currencies: 'USD,UYU,ARS',
                source: 'USD',
                format: 1
            }
        });

        if (responseUSD.data.success) {
            const ratesUSD = responseUSD.data.quotes;
            const usdToUyu = ratesUSD['USDUYU'];
            const usdToArs = ratesUSD['USDARS'];

            await pool.query(`
                INSERT INTO cambio (fecha, moneda_origen, moneda_destino, cambio)
                VALUES (NOW(), 2, 1, $1),
                (NOW(), 2, 3, $2)
            `, [usdToUyu, usdToArs]);

            console.log('Cambio actualizado: USD', { usdToUyu, usdToArs});
        } else {
            console.error('Error en la respuesta de CurrencyLayer para USD:', responseUSD.data.error);
        }
    } catch (error) {
        console.error('Error al actualizar USD:', error.message);
    }
});

cron.schedule('1 0 * * *', async () => {
    console.log('Ejecutando actualización de tipos de cambio ARS...');

    try {
        const responseARS = await axios.get(`${process.env.PAGINA_API_MONEDA_CAMBIO}`, {
            params: {
                access_key: process.env.KEY_API_MONEDA_CAMBIO,
                currencies: 'USD,UYU,ARS',
                source: 'ARS',
                format: 1
            }
        });

        if (responseARS.data.success) {
            const ratesARS = responseARS.data.quotes;
            const arsToUsd = ratesARS['ARSUSD'];
            const arsToUyu = ratesARS['ARSUYU'];

            await pool.query(`
                INSERT INTO cambio (fecha, moneda_origen, moneda_destino, cambio)
                VALUES (NOW(), 3, 2, $1),
                (NOW(), 3, 1, $2)
            `, [arsToUsd, arsToUyu]);

            console.log('Cambio actualizado: ARS', { arsToUsd, arsToUyu });
        } else {
            console.error('Error en la respuesta de CurrencyLayer para ARS:', responseARS.data.error);
        }
    } catch (error) {
        console.error('Error al actualizar ARS:', error.message);
    }
});

cron.schedule('2 0 * * *', async () => {
    console.log('Ejecutando actualización de tipos de cambio UYU...');

    try {
        const responseUYU = await axios.get(`${process.env.PAGINA_API_MONEDA_CAMBIO}`, {
            params: {
                access_key: process.env.KEY_API_MONEDA_CAMBIO,
                currencies: 'USD,UYU,ARS',
                source: 'UYU',
                format: 1
            }
        });

        if (responseUYU.data.success) {
            const ratesUYU = responseUYU.data.quotes;
            const uyuToArs = ratesUYU['UYUARS'];
            const uyuToUsd = ratesUYU['UYUUSD'];

            await pool.query(`
                INSERT INTO cambio (fecha, moneda_origen, moneda_destino, cambio)
                VALUES (NOW(), 1, 3, $1),
                (NOW(), 1, 2, $2)
            `, [uyuToArs, uyuToUsd]);

            console.log('Cambio actualizado: UYU', { uyuToArs, uyuToUsd });
        } else {
            console.error('Error en la respuesta de CurrencyLayer para UYU:', responseUYU.data.error);
        }
    } catch (error) {
        console.error('Error al actualizar UYU:', error.message);
    }
});
