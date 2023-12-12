import {UsersQueryParams, UserFilter} from "../../types/types";
import {PagedUserOutput, SanitizedUserOutput, UserModelClass} from "../../models/Users";
import {getPaginationDetails} from "../../helpers/query-params";
import {userSanitizer} from "../../helpers/mappers";
import {ObjectId} from "mongodb";
import { subSeconds } from 'date-fns';
import {ApiRequestModelClass} from "../../models/Requests";


export class UsersQueryRepository {
    async getUsers(params: UsersQueryParams): Promise<PagedUserOutput> {
        let filter: UserFilter = {}
        let filterConditions: UserFilter[] = []

        if (params.searchLoginTerm) {
            filterConditions.push({login: new RegExp(params.searchLoginTerm, "i")})
        }
        if (params.searchEmailTerm) {
            filterConditions.push({email: new RegExp(params.searchEmailTerm, "i")})
        }

        let query = UserModelClass.find()

        if (filterConditions.length) {
            query = query.or(filterConditions)
        }

        // if (filterConditions.length) {
        //     filter.$or = filterConditions;
        // }

        const {skipAmount, sortDir} = getPaginationDetails(params);
        const totalCount = await UserModelClass.countDocuments(filter)

        const users= await query
            //.find(filter)
            .sort({[params.sortBy]: sortDir} as any)
            .skip(skipAmount)
            .limit(params.pageSize)

        console.log('users', users)
        const sanitizedUsers: SanitizedUserOutput[] =  users.map((u) => userSanitizer(u))

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount: totalCount,
            items: sanitizedUsers
        }
    }

    async findUserById(id: ObjectId) {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const user = await UserModelClass.findOne({_id: id})
        if (!user) {
            return null
        }
        return user
    }

    async removeUserById(id: string): Promise<boolean>  {
        const result = await UserModelClass.deleteOne({_id: id})
        return result.deletedCount === 1
    }

    async getUserByRegistrationCode(code: string){
        try {
            return await UserModelClass.findOne({'emailConfirmation.confirmationCode': code})
        } catch (error) {
            console.error("An error occurred while fetching the user:", error);
            return null;
        }
    }

    async getUserByEmail(email: string) {
        try {
            return await UserModelClass.findOne({'accountData.email': email})
        } catch (error) {
            console.error("An error occurred while fetching the user:", error)
            return null;
        }
    }

    async getUserByLogin(login: string) {
        try {
            return await UserModelClass.findOne({'accountData.login': login})
        } catch (error) {
            console.error("An error occurred while fetching the user:", error)
            return null;
        }
    }

    async findRequestByIpAndUrl(ip: string, url: string) {
        try{
            const dateToCompare = subSeconds(new Date(), 10).toISOString()

            return await ApiRequestModelClass.find({
                ip: ip,
                url: url,
                date: {$gte: dateToCompare}
            })
        } catch (error) {
            console.error("An error occurred while fetching findRequestByIpAndUrl", error)
            return null;
        }
    }
}
