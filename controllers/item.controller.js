import urlMetadata from 'url-metadata';
import { LinkItem, TextItem } from '../models/item.schema';

const createLinkItem = async ( body ) => {

    try {

        const metadata = await urlMetadata( body.link );

        const item = new LinkItem(
            {
                user: {
                    id: body.userId,
                    username: body.username,
                },
                link: body.link,
                title: metadata.title,
                description: metadata.description,
                image: metadata.image,
            },
        );

        return item.save();

    } catch ( error ) {

        throw new Error( {
            message: 'Error at url inspector.',
            error,
        } );

    }

};

const createTextItem = ( body ) => {

    const newItem = new TextItem(
        {
            user: {
                id: body.userId,
                username: body.username,
            },
            content: body.content,
        },
    );

    return newItem.save();
};

export const createItem = ( body ) => {
    const type = body.type;

    switch ( type ) {
        case 'link':
            return createLinkItem( body );

        case 'text':
            return createTextItem( body );

        default:
            return null;
    }
};
