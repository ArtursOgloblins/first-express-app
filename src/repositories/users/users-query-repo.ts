import {client} from "../db";
import {PagedUserOutput, SanitizedUserOutput, User} from "../../models/Users";
import {UsersQueryParams, UserFilter} from "../../types/types";
import {getPaginationDetails} from "../../helpers/query-params";
import {userMapper} from "../../helpers/mappers";
import {ObjectId} from "mongodb";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const usersCollection = db.collection<User>("users");

export const usersQueryRepository = {
    async getUsers(params: UsersQueryParams): Promise<PagedUserOutput> {
        let filter: UserFilter = {}
        let filterConditions: UserFilter[] = []

        if (params.searchLoginTerm) {
            filterConditions.push({login: new RegExp(params.searchLoginTerm, "i")})
        }
        if (params.searchEmailTerm) {
            filterConditions.push({email: new RegExp(params.searchEmailTerm, "i")})
        }

        if (filterConditions.length) {
            filter.$or = filterConditions;
        }

        const {skipAmount, sortDir} = getPaginationDetails(params);
        const totalCount = await usersCollection.countDocuments(filter)

        const users= await usersCollection
            .find(filter)
            .sort({[params.sortBy]: sortDir} as any)
            .skip(skipAmount)
            .limit(params.pageSize)
            .toArray()

        const sanitizedUsers: SanitizedUserOutput[] =  users.map((u) => userMapper(u))

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount: totalCount,
            items: sanitizedUsers
        }
    },

    async findUserById(id: ObjectId) {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const user = await usersCollection.findOne({_id: id})
        if (!user) {
            return null
        }
        return user
    },

    async removeUserById(id: string): Promise<boolean>  {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}
