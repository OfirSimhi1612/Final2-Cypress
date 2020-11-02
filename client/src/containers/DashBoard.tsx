import React from "react";
// import GeoTile from "../components/GeoTile2";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import ErrorBoundary from "../components/ErrorBoundary";
import SessionsByDayChart from "../components/SessionsChartByDay";
import EventLog from "../components/EventsLog";
import SessionsByHourChsrt from "../components/SessionsChartByHour";
import OsChart from "../components/OsChart";
import ViewChart from "../components/ViewChart";
import Map from "../components/Map";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    flexGrow: 1,
    gap: "20px",
    marginTop: "0px",
    maxWidth: "90vw",
    marginLeft: "0px",
    marginRight: "auto",
    padding: "0px"
  },
  tile: {
    display: "flex",
    flexDirection: "column",
    height: "43vh",
    minWidth: "300px",
    minHeight: "250px",
    padding: "0px",
    alignContent: "center",
  },
  GeoTile: {
    display: "flex",
    width: "100%",
    height: "78vh",
    minHeight: "250px",
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
            <Grid item className={classes.GeoTile} xl={12} style={{padding: "5px"}}>
              <Map />
            </Grid>
          </ErrorBoundary>
          {/* <ErrorBoundary>
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
              <OsChart />            
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xs={6}>
              <ViewChart />
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.GeoTile} xs={7}>
              <RetentionCohort />
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xs={7}>
              <EventLog />
            </Grid>
          </ErrorBoundary> */}
        </Grid>
      </ErrorBoundary>
    </>
  );
};

export default DashBoard;
