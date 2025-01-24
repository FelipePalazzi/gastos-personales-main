const pool = require('../db/dbConnection.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginController = {};
require('dotenv').config();

loginController.register = async (req, res) => {
    const { username, password, pin, role, email } = req.body;

    try {
        if (role === 'admin') {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(403).send('Token requerido para asignar rol de administrador.');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded || (decoded.userId !== 1 && decoded.username !== 'Felipe')) {
                return res.status(403).send('No tienes permiso para crear un administrador.');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPin = await bcrypt.hash(pin, 10);

        await pool.query(
            `INSERT INTO users (username, password, pin, role, email) VALUES ($1, $2, $3, $4, $5)`,
            [username, hashedPassword, hashedPin, role, email]
        );

        res.status(200).send('Usuario registrado exitosamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(400).send('Error al registrar el usuario');
    }
};

loginController.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query(`SELECT user_id, username, password FROM users WHERE email = $1`, [email]);

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                const existingTokenResult = await pool.query(`SELECT id FROM refresh_tokens WHERE user_id = $1`, [user.user_id]);
                if (existingTokenResult.rowCount > 0) {
                    await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [user.user_id]);
                }
                const estadoKeyCheck = 1
                const keyRoleResult = await pool.query(`
                    SELECT uk.key_id, r.nombre
                    FROM user_keys uk
                    JOIN role_user_keys r ON uk.role = r.id
                    WHERE uk.user_id = $1 and uk.estado = $2
                `, [user.user_id, estadoKeyCheck]);

                const keyRoles = keyRoleResult.rows;
                const keyIds = keyRoles.map(row => row.key_id);
                const roles = keyRoles.map(row => row.nombre);
                const accessToken = jwt.sign(
                    {
                        userId: user.user_id,
                        username: user.username,
                        roles,
                        keyIds
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );

                const refreshToken = jwt.sign(
                    {
                        userId: user.user_id,
                        username: user.username,
                        roles: roles,
                        keyIds: keyIds
                    },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '7d' }
                );
                await pool.query(`
                    INSERT INTO refresh_tokens (user_id, token, expires_at)
                    VALUES ($1, $2, NOW() + INTERVAL '7 days')
                `, [user.user_id, refreshToken]);

                res.status(200).json({ accessToken, refreshToken });
            } else {
                res.status(399).send('Contraseña incorrecta');
            }
        } else {
            res.status(399).send('Email no encontrado');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
};

loginController.validatePin = async (req, res) => {
    const { pin } = req.body;
    const userId = req.user?.userId;

    try {
        if (!userId) {
            return res.status(401).send('Usuario no autenticado.');
        }

        const userResult = await pool.query(`SELECT pin FROM users WHERE user_id = $1`, [userId]);

        if (userResult.rows.length > 0) {
            const validPin = await bcrypt.compare(pin, userResult.rows[0].pin);
            if (validPin) {
                return res.status(200).send('PIN válido.');
            } else {
                return res.status(399).send('PIN incorrecto.');
            }
        } else {
            return res.status(404).send('Usuario no encontrado.');
        }
    } catch (error) {
        console.error('Error al validar PIN:', error);
        res.status(500).send('Error al validar PIN.');
    }
};


loginController.refreshToken = async (req, res) => {
    const refreshToken = req.headers['refresh-token'];

    if (!refreshToken) {
        return { error: 'Refresh token requerido' };
    }

    try {
        const tokenResult = await pool.query(`SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()`, [refreshToken]);
        if (tokenResult.rowCount === 0) {
            return { error: 'Refresh token inválido o expirado' };
        }
        const tokenData = tokenResult.rows[0];

        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (payload.userId !== tokenData.user_id) {
            return { error: 'Refresh token no válido para este usuario' };
        }

        const keyRoleResult = await pool.query(`
          SELECT uk.key_id, r.nombre
          FROM user_keys uk
          JOIN role_user_keys r ON uk.role = r.id
          WHERE uk.user_id = $1 and uk.estado = $2
      `, [payload.userId, estado = 1]);

        const keyRoles = keyRoleResult.rows;
        const keyIds = keyRoles.map(row => row.key_id);
        const roles = keyRoles.map(row => row.nombre);

        const newAccessToken = jwt.sign(
            {
                userId: payload.userId,
                username: payload.username,
                roles: roles,
                keyIds: keyIds
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            {
                userId: payload.userId,
                username: payload.username,
                roles: roles,
                keyIds: keyIds
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        await pool.query(`INSERT INTO refresh_tokens (token, user_id) VALUES ($1, $2)`, [newRefreshToken, payload.userId]);
        await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [refreshToken]);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
        console.error('Error al refrescar el token:', error);
        return { error: 'Token inválido o expirado' };
    }
};

loginController.refreshTokenJSON = async (req, res) => {
    const refreshToken = req.headers['refresh-token'];

    if (!refreshToken) {
        return res.status(403).send('Refresh token requerido');
    }

    try {
        const tokenResult = await pool.query(`SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()`, [refreshToken]);
        if (tokenResult.rowCount === 0) {
            return res.status(403).send('Refresh token inválido o expirado');
        }

        const tokenData = tokenResult.rows[0];
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (payload.userId !== tokenData.user_id) {
            return res.status(403).send('Refresh token no válido para este usuario');
        }

        const keyRoleResult = await pool.query(`
          SELECT uk.key_id, r.nombre
          FROM user_keys uk
          JOIN role_user_keys r ON uk.role = r.id
          WHERE uk.user_id = $1 and uk.estado = $2
      `, [payload.userId, estado = 1]);

        const keyRoles = keyRoleResult.rows;
        const keyIds = keyRoles.map(row => row.key_id);
        const roles = keyRoles.map(row => row.nombre);

        const newAccessToken = jwt.sign(
            {
                userId: payload.userId,
                username: payload.username,
                roles: roles,
                keyIds: keyIds
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            {
                userId: payload.userId,
                username: payload.username,
                roles: roles,
                keyIds: keyIds
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        await pool.query(`INSERT INTO refresh_tokens (token, user_id) VALUES ($1, $2)`, [newRefreshToken, payload.userId]);
        await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [refreshToken]);

        return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    } catch (error) {
        console.error('Error al refrescar el token:', error);
        return res.status(500).send('Error al renovar los tokens');
    }
};


loginController.otorgarAcceso = async (req, res) => {
    const { userId, keyId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token requerido.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || decoded.userId !== 1 && decoded.username !== 'Felipe') {
            return res.status(403).send('No autorizado');
        }

        await pool.query(`INSERT INTO user_keys (user_id, key_id) VALUES ($1, $2)`, [userId, keyId]);
        res.status(200).send('Acceso otorgado');
    } catch (error) {
        res.status(403).send('Token inválido o expirado');
    }
};

loginController.otorgarAdmin = async (req, res) => {
    const { userId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token requerido.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || decoded.userId !== 1 && decoded.username !== 'Felipe') {
            return res.status(403).send('No autorizado');
        }

        await pool.query(`UPDATE users SET role = 'admin' WHERE user_id = $1`, [userId]);
        res.status(200).send('Rol de administrador otorgado');
    } catch (error) {
        res.status(403).send('Token inválido o expirado');
    }
};

loginController.eliminarAdmin = async (req, res) => {
    const { userId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token requerido.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || decoded.userId !== 1 && decoded.username !== 'Felipe') {
            return res.status(403).send('No autorizado');
        }

        await pool.query(`UPDATE users SET role = 'user' WHERE user_id = $1`, [userId]);
        res.status(200).send('Rol de administrador eliminado');
    } catch (error) {
        res.status(403).send('Token inválido o expirado');
    }
};

loginController.eliminarAcceso = async (req, res) => {
    const { userId, keyId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token requerido.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || decoded.userId !== 1 && decoded.username !== 'Felipe') {
            return res.status(403).send('No autorizado');
        }

        await pool.query(`DELETE FROM user_keys WHERE user_id = $1 AND key_id = $2`, [userId, keyId]);
        res.status(200).send('Acceso eliminado');
    } catch (error) {
        res.status(403).send('Token inválido o expirado');
    }
};

module.exports = loginController;