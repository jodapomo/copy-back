import urlMetadata from 'url-metadata';
import { LinkItem, TextItem } from '../models/item.schema';

const createLinkItem = async (body, user) => {
    try {
        const metadata = await urlMetadata(body.link);

        const item = new LinkItem({
            user,
            link: body.link,
            title: metadata.title,
            description: metadata.description,
            image: metadata.image,
        });

        return item.save();
    } catch (error) {
        throw new Error({
            message: 'Error at url inspector.',
            error,
        });
    }
};

const createTextItem = (body, user) => {
    const newItem = new TextItem({
        user,
        content: body.content,
    });

    return newItem.save();
};

const TYPES = {
    link: createLinkItem,
    text: createTextItem,
    default: () => null,
};

export const createItem = (body, user) => {
    const { type } = body;

    return (TYPES[type] || TYPES.default)(body, user);
};
