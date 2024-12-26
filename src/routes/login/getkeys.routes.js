const express = require('express');
const router = express.Router();
const getkeysController = require ('../../controllers/login/getkeys.controller.js');
const { symbols } = require('../../constants.js');

router.get(`${symbols.barra}conseguirllaves`, getkeysController.conseguirllaves );

module.exports = router;