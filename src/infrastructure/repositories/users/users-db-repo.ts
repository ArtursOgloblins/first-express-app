import {User, UserModel} from "../../../domain/Users";
import {userSanitizer} from "../../../helpers/mappers";
import {ObjectId} from "mongodb";
import { add } from 'date-fns';
import {ApiRequest, ApiRequestModelClass} from "../../../domain/Requests";
import {PasswordRecovery, PasswordRecoveryModel} from "../../../domain/passwordRecovery";
import {injectable} from "inversify";


@injectable()
export class UsersRepository {
    async createUser(newUser: User) {
        const res = await UserModel.create(newUser)
        return userSanitizer({...newUser, _id: res._id})
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        return UserModel.findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
    }

    async registerUser(newUser: User)  {
        const res = await UserModel.create(newUser)
        console.log('new user', newUser)
        return userSanitizer({...newUser, _id: res._id})
    }

    async updateConfirmationCode(id: ObjectId, code: string) {
        const expirationDate = add(new Date(), {hours: 1, minutes: 3});
        const res = await UserModel.updateMany(
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

    async save(model: any) {
        await model.save()
    }

    async updateUserConfirmation(id: ObjectId) {
        const res = await UserModel.updateOne(
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
        const res = await UserModel.updateOne(
            {_id: userId},
            {$set:
                    {'accountData.password': passwordHash,
                        'accountData.passwordSalt': passwordSalt}
            }

        )
        return res.modifiedCount === 1
    }
}