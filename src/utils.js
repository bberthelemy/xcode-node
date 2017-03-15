import {randomBytes} from "crypto";

function getUids(xcode) {
    let uids = [];

    Object.keys(xcode.project.objects).forEach((section) => {
        const keys = Object.keys(xcode.project.objects[section]);

        const newKeys = keys.filter((item) => {
            return (typeof item === "string" && item.indexOf("_comment") === -1);
        });

        uids = [...uids, ...newKeys];
    });

    return uids;
}

function pbx_uid(xcode) {
    const uids = getUids(xcode);
    let uid = null;

    do {
        uid = randomBytes(12).toString('hex').toUpperCase();
    } while (uids.indexOf(uid) != -1);

    return uid;
}

export default {
    pbx_uid
};