import {v4 as uuidv4} from "uuid";

export const helperMethods = {
    async generateUniqueValue()  {
        return uuidv4();
    }
}
