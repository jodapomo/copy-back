import { Room } from '../models/room.schema';

export const userJoin = async (socket, data) => {
    try {
        socket.join(data.roomId, async () => {
            const { roomId } = data;
            const { username } = data;

            socket.username = username;
            socket.roomId = roomId;

            const room = await Room.findOne({ id: roomId });

            if (!room) {
                socket.to(roomId).emit('userJoin', null);
                return;
            }

            const tempUser = room.tempUsers.find(user => user.username === username);

            if (tempUser) {
                tempUser.online = true;
            } else {
                socket.to(roomId).emit('userJoin', null);
                return;
            }

            await room.save();

            const joinedUser = {
                _id: tempUser._id,
                username: tempUser.username,
                lastLogin: tempUser.lastLogin,
                online: tempUser.online,
                admin: tempUser.admin,
            };

            return socket.in(roomId).emit('userJoin', joinedUser);
        });
    } catch (error) {
        return socket.to(data.roomId).emit('userJoin', null);
    }
};

export const userLeave = async socket => {
    try {
        socket.leave(socket.roomId, async () => {
            const { roomId } = socket;
            const { username } = socket;

            const room = await Room.findOne({ id: roomId });

            if (!room) {
                socket.to(roomId).emit('userLeave', null);
                return;
            }

            const tempUser = room.tempUsers.find(user => user.username === username);

            if (tempUser) {
                tempUser.lastLogin = new Date();
                tempUser.online = false;
            } else {
                socket.to(roomId).emit('userLeave', null);
                return;
            }

            await room.save();

            const leavedUser = {
                _id: tempUser._id,
                username: tempUser.username,
                lastLogin: tempUser.lastLogin,
                online: tempUser.online,
            };

            return socket.to(roomId).emit('userLeave', leavedUser);
        });
    } catch (error) {
        return socket.to(socket.roomId).emit('userLeave', null);
    }
};

export const newItem = (socket, item) => {
    try {
        return socket.to(socket.roomId).emit('newItem', item);
    } catch (error) {
        return socket.to(socket.roomId).emit('newItem', null);
    }
};

export const disconnect = async socket => {
    try {
        const { roomId } = socket;
        const { username } = socket;

        if (!roomId || !username) {
            return;
        }

        const room = await Room.findOne({ id: roomId });

        if (!room) {
            socket.to(roomId).emit('userLeave', null);
            return;
        }

        const tempUser = room.tempUsers.find(user => user.username === username);

        if (tempUser) {
            tempUser.lastLogin = new Date();
            tempUser.online = false;
        } else {
            socket.to(roomId).emit('userLeave', null);
            return;
        }

        await room.save();

        const disconnectedUser = {
            _id: tempUser._id,
            username: tempUser.username,
            lastLogin: tempUser.lastLogin,
            online: tempUser.online,
        };

        return socket.to(roomId).emit('userLeave', disconnectedUser);
    } catch (error) {
        return socket.to(socket.roomId).emit('userLeave', null);
    }
};
