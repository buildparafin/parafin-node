import { parafinEnvironments } from './parafinEnvironments';
import { Client } from './ParafinClient';
import { ParafinError } from './ParafinError';

// Testing the fields: This is how the client would intereact.
console.log(Client.prototype.test)

export { parafinEnvironments, Client, ParafinError };
