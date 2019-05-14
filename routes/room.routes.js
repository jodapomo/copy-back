import express from 'express';
import {
    getRooms,
    createRoom,
    getRoomById,
    addItem,
    addUser,
    checkIfRoomLocked,
} from '../controllers/room.controller';

const router = express.Router();

router.route( '/' )

    // GET /api/v1/rooms - get all rooms
    .get( getRooms )

    // POST /api/v1/rooms - create a room and add the temp user who created it
    .post( createRoom );

router.route( '/:id' )

    // GET /api/v1/rooms/:roomId - get one room by the id (not mongodb _id, but numeric auto-increasing id)
    .get( getRoomById );

router.route( '/:id/locked' )

    // GET /api/v1/rooms/:roomId - check if a room are locker with a password
    .get( checkIfRoomLocked );

router.route( '/:id/items' )

    // POST /api/v1/rooms/:id/items - create a new item for a specific room
    .post( addItem );

router.route( '/:id/users' )

    // POST /api/v1/rooms/:id/users - create a new user for a specific room
    .post( addUser );

export default router;
