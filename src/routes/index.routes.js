import express from 'express';
import inspectorRoutes from './inspector.routes';
import roomRoutes from './room.routes';

const router = express.Router();

router.get( '/', ( req, res ) => res.send( `Server OK! running on ${process.env.NODE_ENV} mode.` ) );

router.use( '/inspector', inspectorRoutes );
router.use( '/rooms', roomRoutes );

export default router;
