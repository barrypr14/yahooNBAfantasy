import { getTeamThisWeekSchedule } from './services/yahoo-fantasy-api';

export * from './errors/bad-request-error';
export * from './errors/custom-error';
export * from './errors/database-connection-error';
export * from './errors/not-authorization-error';
export * from './errors/not-found-error';
export * from './errors/request-validation-error';

export * from './middlewares/current-user'
export * from './middlewares/error-handler';
export * from './middlewares/valid-request';

export * from './dataTypes/scoreboard';
export * from './dataTypes/stats';

export {FantasyService, OauthService, getTeamThisWeekSchedule} from './services/yahoo-fantasy-api';

// const print = async () => {
//     const data = await getTeamThisWeekSchedule();
//     console.log(data);
// }

// print();