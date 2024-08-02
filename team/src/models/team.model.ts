import { Scoreboard } from "@porufantasy/yahoofantasy";
import { Stats } from "@porufantasy/yahoofantasy/build/dataTypes/stats";
import mongoose, { Document, Model, Schema} from "mongoose";

interface TeamAttr {
    league_id: string,
    league_prefix: string,
    team_id: string,
    team_name: string,
    roster: {[player_id : string] : {name: string, stat: Stats}},
    predict_scoreboard: Scoreboard,
    initial_predict_scoreboard: Scoreboard,
    league_week: number,
    last_updated: Date
}

interface TeamDoc extends Document {
    league_id: string,
    league_prefix: string,
    team_id: string,
    team_name: string,
    roster: Map<string, {name: string, stat: Stats}>,
    predict_scoreboard: Scoreboard,
    initial_predict_scoreboard: Scoreboard,
    league_week: string,
    last_updated: Date
}

interface TeamModel extends Model<TeamDoc>{
    build(attrs: TeamAttr): TeamDoc;
}

const TeamSchema: Schema<TeamDoc> = new Schema({
    league_id: { type: String, required: true},
    league_prefix: { type: String, required: true},
    team_id: { type: String, required: true},
    team_name: { type: String, required: true},
    roster: { type: Map, of: new Schema({
        name: String,
        stat : {
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
        }
    }), required: true},
    predict_scoreboard: { type: Map, required: true },
    initial_predict_scoreboard: { type: Map, required: true},
    league_week: { type: String, required: true},
    last_updated: { type: Date, required: true}
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    strict: false  
})

TeamSchema.statics.build = (attrs: TeamAttr) => {
    return new Team(attrs);
}

const Team = mongoose.model<TeamDoc, TeamModel>('Team', TeamSchema);
export { Team }