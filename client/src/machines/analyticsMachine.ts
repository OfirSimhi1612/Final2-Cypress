import { dataMachine } from "./dataMachine";
import { httpClient } from "../utils/asyncUtils";
import { isEmpty, omit } from "lodash/fp";
import { assign } from "xstate";
import { DataContext } from './dataMachine';
import { concat } from "lodash/fp";

export const analyticsMachine = dataMachine("analytics").withConfig({
  services: {
    fetchData: async (ctx, event: any) => {
      const payload = omit("type", event);
      const resp = await httpClient.get(`http://localhost:3001/events/${payload.params}`, {
        params: !isEmpty(payload) ? payload.query : undefined,
      });
      return resp.data;
    },
  },
  actions: {
    setResults: assign((ctx: DataContext, event: any) => ({
      results: event.data 
    })),
    setPageData: assign((ctx: DataContext, event: any) => ({
      pageData: event.data.pageData
    })),
    setMessage: /* istanbul ignore next */ assign((ctx, event: any) => ({
      message: event.message,
    })),
  },
});
