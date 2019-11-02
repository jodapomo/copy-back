import jwt from 'jsonwebtoken';
import config from '../config/config';

export const verifyRoomToken = (req, res, next) => {
    let token = req.header('Authorization');

    if (token) {
        token = token.replace('Bearer ', '').trim();

        const { roomId } = req.params;

        jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
            if (err || Number(decoded.roomId) !== Number(roomId)) {
                return res.status(401).json({
                    ok: false,
                    message: `Unauthorized.`,
                    errors: err,
                });
            }

            req.user = decoded.user;

            next();
        });
    } else {
        return res.status(401).json({
            ok: false,
            message: `Unauthorized.`,
            errors: { message: `Unauthorized.` },
        });
    }
};
