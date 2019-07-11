import express from 'express';
import {
    getRooms,
    createRoomAndLogin,
    getRoomById,
    addItem,
    addUser,
    isLocked,
    checkCredentials,
    login,
    getItemsByRoomId,
    getAuthUser,
} from '../controllers/room.controller';
import { verifyRoomToken } from '../middlewares/roomAuth.middleware';

const router = express.Router();

// ============================================
// /api/v1/rooms
// ============================================

router.route( '/' )

    // GET /api/v1/rooms - get all rooms
    .get( getRooms );

router.route( '/login' )

    // POST /api/v1/rooms/login - create a room and add the temp user who created it, then login (return token)
    .post( createRoomAndLogin );

router.route( '/:roomId' )
// Auth middleware
// .all( verifyRoomToken )

    // GET /api/v1/rooms/:roomId - get one room by the id (not mongodb _id, but numeric auto-increasing id)
    .get( getRoomById );

router.route( '/:roomId/locked' )

    // GET /api/v1/rooms/:roomId - check if a room are locked with a password
    .get( isLocked );

router.route( '/:roomId/items' )

    // GET /api/v1/rooms/:roomId/items - get items for a specific room
    .get( getItemsByRoomId )

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

router.route( '/:roomId/user' )
    // Auth middleware
    .all( verifyRoomToken )
    // GET /api/v1/rooms/:id/user - return the decoded user from a token pass by Auth Headers
    .get( getAuthUser );


export default router;
