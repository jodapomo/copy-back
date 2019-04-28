import express from 'express';
import inspectorRoutes from './inspector.routes';

const router = express.Router();

router.get( '/', ( req, res ) => res.send( 'OK!' ) );

router.use( '/inspector', inspectorRoutes );

export default router;
