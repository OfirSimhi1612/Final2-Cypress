import React from "react";
import Tile from "../components/Tile";
import GeoTile from "../components/GeoTile2";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
// import { TimeOnURLChartBar, TimeOnURLChartPie } from "../components/TimeOnURLChart";
import ErrorBoundary from "../components/ErrorBoundary";
import SessionsByDayChart from "../components/SessionsChartByDay";
import EventLog from "../components/EventsLog";
import SessionsByHourChsrt from "../components/SessionsChartByHour";
import RetentionCohort from "../components/RetentionCohort";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    flexGrow: 1,
    gap: "20px",
    marginTop: "20px",
    maxWidth: "95vw",
    marginLeft: "auto",
    marginRight: "auto",
  },
  tile: {
    display: "flex",
    flexDirection: "column",
    boxShadow: "0.5px 0px 0.5px 2px black",
    height: "43vh",
    minWidth: "300px",
    minHeight: "250px",
    padding: "0px",
    alignContent: "center",
  },
  GeoTile: {
    display: "flex",
    boxShadow: "0.5px 0px 0.5px 2px black",
    height: "70vh",
    minWidth: "90vw",
    minHeight: "250px",
    padding: "0px",
  },
  "MuiGrid-item": {
    padding: "10px",
  },
}));

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <ErrorBoundary>
        <Grid container justify={"center"} spacing={10} className={classes.dashboard}>
          <ErrorBoundary>
            <Grid item className={classes.GeoTile} xs={10}>
              <GeoTile />
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xs={5}>
              <SessionsByDayChart />
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xs={6}>
              <SessionsByHourChsrt />
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xs={5}>
              {/* <TimeOnURLChartPie /> */}
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xs={6}>
              {/* <TimeOnURLChartBar /> */}
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xs={6}>
              <Tile />
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xs={5}>
              <Tile />
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.GeoTile} xs={7}>
              {/* <RetentionCohort /> */}
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xs={7}>
              <EventLog />
            </Grid>
          </ErrorBoundary>
        </Grid>
      </ErrorBoundary>
    </>
  );
};

export default DashBoard;
