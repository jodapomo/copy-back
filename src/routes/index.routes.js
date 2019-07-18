import express from 'express';
import inspectorRoutes from './inspector.routes';
import roomRoutes from './room.routes';

const router = express.Router();

router.get( '/', ( req, res ) => res.send( 'OK!' ) );

router.use( '/inspector', inspectorRoutes );
router.use( '/rooms', roomRoutes );

export default router;
