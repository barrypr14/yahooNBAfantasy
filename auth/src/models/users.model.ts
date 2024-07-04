import mongoose, { Document, Model, Schema } from "mongoose";

// Define the User interface that uses in UserSchema
interface UserAttr {
    email: string,
    password: string,
    client_id: string,
    client_key: string,
    accessToken: string,
    refreshToken: string
}

interface UserDoc extends Document {
    email: string,
    password: string,
    client_id: string,
    client_key: string,
    accessToken: string,
    refreshToken: string
}

// Define the User Model
interface UserModel extends Model<UserDoc>{
    build(attrs: UserAttr): UserDoc;
}
// Define User schema
const UserShema: Schema<UserDoc> = new Schema({
    email: { type: String, required: true},
    password: { type: String, required: true},
    client_id: { type: String, required: true},
    client_key: { type: String, required: true},
    accessToken: { type: String, required: true},
    refreshToken: { type: String, required: true}
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

UserShema.statics.build = (attrs: UserAttr) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', UserShema);

export { User }