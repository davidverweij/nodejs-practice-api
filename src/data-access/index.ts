import { User, DBUser } from "../models";

export { findUserIndex, getAutoSuggestUsers, usersDB };

// In-service memory user collection
const usersDB: DBUser[] = [];

/**
 * Filter soft-deleted users from the 'db'
 *
 * @param {String} id the id of the user to be found
 * @return {Number} the index of the user in the DB, or -1
 */
function findUserIndex(id) {
    const index = usersDB.findIndex(user => user.id === id);
    if (index >= 0 && !usersDB[index].isDeleted) {
        return index;
    }
    return -1;
}

/**
 * Retrieve (undeleted) users based on a filter
 *
 * Assumes (from task) that limit is applied to the source,
 * not the result after searching
 *
 * @param {String} loginSubstring the substring to filter user logins with
 * @param {Number} [limit=-1] limiter for search results
 * @return {[User]} list of users founds based on query
 */
function getAutoSuggestUsers(loginSubstring: string, limit: number = -1): User[] {

    const searchLimit = (limit > 0) ? limit : usersDB.length;

    const users = usersDB
        .filter(user => user.login.includes(loginSubstring))
        .map((user) => {
            // omit isDeleted from return payload
            const { isDeleted, ...rest } = user;
            return rest;
        })
        .slice(0, searchLimit);

    // return early if no matches found
    if (!users) return [];

    // compare login for sorting, case in-sensitive
    users.sort((a, b) => {
        const nameA = a.login.toUpperCase();
        const nameB = b.login.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    return users;
}
