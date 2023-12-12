import {User, UserModelClass} from "../../models/Users";
import {userSanitizer} from "../../helpers/mappers";
import {ObjectId} from "mongodb";
import { add } from 'date-fns';
import {ApiRequest, ApiRequestModelClass} from "../../models/Requests";
import {PasswordRecovery, PasswordRecoveryModel} from "../../models/passwordRecovery";


export class UsersRepository {
    async createUser(newUser: User) {
        const res = await UserModelClass.create(newUser)
        return userSanitizer({...newUser, _id: res._id})
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        return UserModelClass.findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
    }

    async registerUser(newUser: User)  {
        const res = await UserModelClass.create(newUser)
        console.log('new user', newUser)
        return userSanitizer({...newUser, _id: res._id})
    }

    async updateConfirmationCode(id: ObjectId, code: string) {
        const expirationDate = add(new Date(), {hours: 1, minutes: 3});
        const res = await UserModelClass.updateMany(
            {_id: id},
            {
                $set: {
                    'emailConfirmation.confirmationCode': code,
                    'emailConfirmation.expirationDate': expirationDate
                }
            }
        );
        return res.modifiedCount === 1
    }

    async updateUser(id: ObjectId) {
        const res = await UserModelClass.updateOne(
            {_id: id},
            {$set: {'emailConfirmation.isConfirmed': true}}
        )
        return res.modifiedCount === 1
    }

    async saveRequest(requestData: ApiRequest) {
        return await ApiRequestModelClass.create(requestData)
    }

    async registerPasswordRecovery(newPasswordRecovery: PasswordRecovery) {
        return await PasswordRecoveryModel.create(newPasswordRecovery)
    }

    async updateUserPassword(userId: ObjectId, passwordSalt: string, passwordHash: string) {
        const res = await UserModelClass.updateOne(
            {_id: userId},
            {$set:
                    {'accountData.password': passwordHash,
                        'accountData.passwordSalt': passwordSalt}
            }

        )
        return res.modifiedCount === 1
    }
}