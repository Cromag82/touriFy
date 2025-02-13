const express = require('express');
const router = express.Router();
const giraController = require('../controllers/giraController');
const loginController = require('../controllers/loginController')
const tokenV = require('../middlewares/tokenVerifier');

router.get('/giras', tokenV, giraController.getGiras)
router.post('/giras',tokenV, giraController.newGira)
router.get('/nueva_gira',tokenV, giraController.goNewGira) 
router.post('/nueva_gira',tokenV, giraController.newBolo)
router.get('/gira',tokenV, giraController.getGira)
router.get('/gira/bolo', tokenV, giraController.getBolo) 
router.post('/gira/bolo', tokenV, giraController.postGastos)
router.post('/login', loginController.login)
router.get('/login', loginController.login)
router.post('/register', loginController.register)
router.get('/register', loginController.register)
router.get('/logout', loginController.login)
router.post('/logout', loginController.logout, loginController.login)


module.exports = router;