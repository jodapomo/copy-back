import express from 'express';
import {
    getRooms,
    createRoom,
    getRoomById,
    addItem,
    addUser,
    isLocked,
    checkCredentials,
    login,
} from '../controllers/room.controller';
import { verifyRoomToken } from '../middlewares/roomAuth.middleware';

const router = express.Router();

router.route( '/' )

    // GET /api/v1/rooms - get all rooms
    .get( getRooms )

    // POST /api/v1/rooms - create a room and add the temp user who created it, then login (return token)
    .post( createRoom );

router.route( '/:roomId' )
    // Auth middleware
    .all( verifyRoomToken )

    // GET /api/v1/rooms/:roomId - get one room by the id (not mongodb _id, but numeric auto-increasing id)
    .get( getRoomById );

router.route( '/:roomId/locked' )

    // GET /api/v1/rooms/:roomId - check if a room are locked with a password
    .get( isLocked );

router.route( '/:roomId/items' )

    // POST /api/v1/rooms/:id/items - create a new item for a specific room
    .post( addItem );

router.route( '/:roomId/users' )

    // POST /api/v1/rooms/:id/users - create a new user for a specific room
    .post( addUser );

router.route( '/:roomId/credentials' )

    // POST /api/v1/rooms/:id/login - check room credentials (password)
    .post( checkCredentials );

router.route( '/:roomId/login' )

    // POST /api/v1/rooms/:id/login - create and return a session token for a specific room
    .post( login );


export default router;
