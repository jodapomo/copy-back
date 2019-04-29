import express from 'express';
import { getRooms, createRoom, getRoomById } from '../controllers/room.controller';

const router = express.Router();

router.route( '/' )

    // GET /api/v1/rooms - get all rooms
    .get( getRooms )

    // POST /api/v1/rooms - create a room and add the temp user who created it
    .post( createRoom );

router.route( '/:id' )

    // GET /api/v1/rooms/:roomId - get one room by the id (not mongodb _id, but number auto-increasing id)
    .get( getRoomById );

router.route( '/:id/item' )
    .get();

export default router;
