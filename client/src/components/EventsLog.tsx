import React from "react";
import { Event } from "../models/event";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import InfiniteScroll from "react-infinite-scroll-component";
import IconButton from "@material-ui/core/IconButton";
import PinDropIcon from '@material-ui/icons/PinDrop';
import { EventDetail, Wraper, LogTile, AccordionHead, EeventAccordion, UserColor } from "../styledComponents/EventsLog";

interface EventComponentProps {
  event: Event;
  focus: Function;
}

const useStyle = makeStyles((theme) => ({
  accordion: {
    border: "0.001px solid grey",
  },
  accordionHead: {
    display: 'flex',
    gap: '5px',
    width: '100%',
    alignItems: 'center'
  },
  formControl: {
    minWidth: 120,
  },
  configDiv: {
    width: "160px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  downUserName: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  upUserName: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "initial",
    },
  },
}));

const EventComponent: React.FC<EventComponentProps> = ({ event, focus }) => {
  const classes = useStyle();
  return (
    <>
      <EeventAccordion>
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <AccordionHead className={classes.accordionHead}>
              <UserColor userId={event.distinct_user_id} />
              <Typography className={classes.downUserName}>
                <EventDetail>{event.distinct_user_id}</EventDetail>
              </Typography>
              <EventDetail style={{marginRight: '10px', marginLeft: 'auto'}}>{event.name}</EventDetail>
              <IconButton style={{height: '30px', width: '30px'}} color="default" onClick={() => focus(event.geolocation.location)}>
                <PinDropIcon />
              </IconButton>
            </AccordionHead>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <Typography className={classes.upUserName}>
                <EventDetail>{event.distinct_user_id}</EventDetail>
              </Typography>
              <EventDetail>Date: {new Date(event.date).toLocaleString()}</EventDetail>
              <EventDetail>Os(browser): {event.os}({event.browser})</EventDetail>
              <EventDetail>Session ID: {event.session_id}</EventDetail>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </EeventAccordion>
    </>
  );
};

interface Filters {
    sorting: string;
    type: string,
    browser: string,
    search: string
  }

export interface LogProps {
  events: Event[];
  hasMore: boolean;
  offset: number;
  handleChange: Function;
  setOffset: Function;
  filters: Filters;
  fetch: Function;
  focusOnEvent: Function;
}

const allBrowsers: string[] = ['windows', 'mac', 'linux', 'ios', 'android', 'other']
const allTypes: string[] = ['login', 'signup', 'admin']

const EventLog: React.FC<LogProps> = ({events,
  hasMore,
  offset,
  handleChange,
  setOffset,
  filters,
  fetch,
  focusOnEvent  
}) => {
  
  const classes = useStyle();

  return (
    <>
      <LogTile>
        <div className={classes.configDiv}>
          <TextField
            id="filled-basic"
            label="Search"
            variant="outlined"
            onChange={(event) => handleChange("search", event)}
            margin="dense"
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-autowidth-label">Sort</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={filters.sorting}
              onChange={(event) => handleChange("sorting", event)}
              autoWidth={true}
            >
              <MenuItem value="none">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"-date"}>Date (Lastest First)</MenuItem>
              <MenuItem value={"+date"}>Date (Earliest First)</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-autowidth-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={filters.type}
              onChange={(event) => handleChange("type", event)}
              autoWidth={true}
            >
              <MenuItem value="all">
                <em>All</em>
              </MenuItem>
              {allTypes.map((type: string) => {
                return <MenuItem value={type}>{type}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-autowidth-label">Browser</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={filters.browser}
              onChange={(event) => handleChange("browser", event)}
              autoWidth={true}
            >
              <MenuItem value="all">
                <em>All</em>
              </MenuItem>
              {allBrowsers.map((type: string) => {
                return <MenuItem value={type}>{type}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </div>
        <Wraper id={"eventsWraper"}>
          <InfiniteScroll
            dataLength={events.length}
            next={function () {
              fetch(filters, offset);
              setOffset(offset + 10);
            }}
            hasMore={hasMore}
            scrollableTarget={"eventsWraper"}
            loader={<h4 style={{textAlign: 'center'}}>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>No more events to display!</b>
              </p>
            }
          >
            {events.map((event: Event) => (
              <EventComponent event={event} focus={focusOnEvent}/>
            ))}
          </InfiniteScroll>
        </Wraper>
      </LogTile>
    </>
  );
};

export default EventLog;
