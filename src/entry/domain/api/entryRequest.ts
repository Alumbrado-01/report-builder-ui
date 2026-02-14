import {ConfirmedEntry} from "../object/confirmedEntry";
import {User} from "../../../user/domain/object/user";

export interface EntryRequest {
  modelRequest: ConfirmedEntry;
  user: User;
}
