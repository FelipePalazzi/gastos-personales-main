const pool = require('../../db/dbConnection.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginController = {};
require('dotenv').config();

loginController.register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        if (role === 'admin') {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(403).send('Token requerido para asignar rol de administrador.');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded || decoded.role !== 'admin') {
                return res.status(403).send('No tienes permiso para crear un administrador.');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(`INSERT INTO users (username, password, role) VALUES ($1, $2, $3)`, [username, hashedPassword, role || 'user']);
        
        res.status(200).send('Usuario registrado exitosamente');
    } catch (error) {
        res.status(400).send('Error al registrar el usuario');
    }
};



loginController.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const userResult = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            const validPassword = await bcrypt.compare(password, user.password);
            
            if (validPassword) {
                const keyResult = await pool.query(`SELECT key_id FROM user_keys WHERE user_id = $1`, [user.user_id]);

                const keyIds = keyResult.rows.map(row => row.key_id);

                const token = jwt.sign(
                    { 
                        userId: user.user_id, 
                        username: user.username, 
                        role: user.role,
                        keyIds
                    }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: '30d' }
                );
                
                res.status(200).json({ token });
            } else {
                res.status(400).send('Contraseña incorrecta');
            }
        } else {
            res.status(400).send('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
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
        if (decoded.role !== 'admin') {
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
        if (decoded.role !== 'admin') {
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
        if (decoded.role !== 'admin') {
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
        if (decoded.role !== 'admin') {
            return res.status(403).send('No autorizado');
        }

        await pool.query(`DELETE FROM user_keys WHERE user_id = $1 AND key_id = $2`, [userId, keyId]);
        res.status(200).send('Acceso eliminado');
    } catch (error) {
        res.status(403).send('Token inválido o expirado');
    }
};

module.exports = loginController;