import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import ErrorBoundary from "../components/ErrorBoundary";
import OsChart from "../components/OsChart";
import ViewChart from "../components/ViewChart";
import Map from "../components/Map";
import SessionsPanel from "../components/SessionsPanel";
import RetentionCohort from "../components/RetentionCohort";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    flexGrow: 1,
    gap: "20px",
    marginTop: "0px",
    maxWidth: "90vw",
    marginLeft: "0px",
    marginRight: "auto",
    padding: "0px",
  },
  retentionTile: {
    display: "flex",
    width: "95%",
    height: "78vh",
    minHeight: "250px",
    boxShadow: "0px 0px 9px 1px #5C5C5C",
    borderRadius: "1%"
  },
  tile: {
    display: "flex",
    flexDirection: "column",
    height: "70vh",
    minWidth: "450px",
    minHeight: "250px",
    padding: "0px",
    alignContent: "center",
    boxShadow: "0px 0px 9px 1px #5C5C5C",
    borderRadius: "1%"
  },
  GeoTile: {
    display: "flex",
    width: "95%",
    height: "78vh",
    minHeight: "250px",
    boxShadow: "0px 0px 9px 1px #5C5C5C",
    borderRadius: "1%"

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
          <ErrorBoundary>
            <Grid item className={classes.tile} xl={4} style={{padding: "0px"}}>
              <h2 style={{textAlign: "center"}}>Sessions Comparison</h2>
              <SessionsPanel />
            </Grid>
          </ErrorBoundary>
          <ErrorBoundary>
            <Grid item className={classes.tile} xl={6}>
              <OsChart />            
            </Grid>
          </ErrorBoundary>
          {/* <ErrorBoundary>
            <Grid item className={classes.tile} xs={6}>
              <ViewChart />
            </Grid>
          </ErrorBoundary> */}
          <ErrorBoundary>
            <Grid item className={classes.retentionTile} xs={11}>
              <RetentionCohort />
            </Grid>
          </ErrorBoundary>
         
        </Grid>
      </ErrorBoundary>
    </>
  );
};

export default DashBoard;
