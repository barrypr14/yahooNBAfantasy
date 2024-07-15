import { Scoreboard } from "@porufantasy/yahoofantasy";
import { Stats } from "@porufantasy/yahoofantasy/build/dataTypes/stats";
import mongoose, { Document, Model, Schema } from "mongoose";

// Define the League interface that uses in LeagueSchema
interface LeagueAttr {
    user_email: string[],
    league_name: string,
    league_id: string,
    league_prefix: string,
    current_scoreboard: {[team_id: string] : Scoreboard},
    league_week: string,
    teamName_ref: {[team_id: string] : string},
    last_updated: number
}

interface LeagueDoc extends Document {
    user_email: string[],
    league_name: string,
    league_id: string,
    league_prefix: string,
    current_scoreboard: Map<string, Scoreboard>,
    league_week: string,
    teamName_ref: Map<string, string>,
    last_updated: number
}

// Define the League Model
interface LeagueModel extends Model<LeagueDoc>{
    build(attrs: LeagueAttr): LeagueDoc;
}

// Define League Schema
const LeagueSchema: Schema<LeagueDoc> = new Schema({
    user_email: { type: [String], required: true},
    league_name: { type: String, required: true},
    league_id: { type: String, required: true},
    league_prefix: { type: String, required: true},
    current_scoreboard: { type: Map, of: new Schema({
        stats: {
            FGM: Number,
            FGA: Number,
            FG: Number,
            FTM: Number,
            FTA: Number,
            FT: Number,
            ThreePTM: Number,
            PTS: Number,
            REB: Number,
            AST: Number,
            STL: Number,
            BLK: Number,
            TO: Number
        },
        win: Number,
        loss: Number,
        tie: Number,
        Opp: String
    }) , required: true},
    league_week: { type: String, required: true},
    teamName_ref: { type: Map, of: String, required: true},
    last_updated: { type: Number, required: true}
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    strict: false
});

LeagueSchema.statics.build = (attrs : LeagueAttr) => {
    return new League(attrs);
}

const League = mongoose.model<LeagueDoc, LeagueModel>('League', LeagueSchema);
export { League }

// {
//     stats: { type: Map, of: {
//         FGM: { type: Number, required: true},
//         FGA: { type: Number, required: true},
//         FG: { type: Number, required: true},
//         FTM: { type: Number, required: true},
//         FTA: { type: Number, required: true},
//         FT: { type: Number, required: true},
//         ThreePTM: { type: Number, required: true},
//         PTS: { type: Number, required: true},
//         REB: { type: Number, required: true},
//         AST: { type: Number, required: true},
//         STL: { type: Number, required: true},
//         BLK: { type: Number, required: true},
//         TO: { type: Number, required: true},
//     }, required: true},
//     win: { type: Number, required: true},
//     loss: { type: Number, required: true},
//     tie: { type: Number, required: true},
//     Opp: { type: String, required: true}
// }