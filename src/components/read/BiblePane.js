import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import { Swipeable } from "react-swipeable";
import Grid from "@material-ui/core/Grid";
import Fullscreen from "react-full-screen";
import MenuBar from "./MenuBar";
import Bible from "./Bible";

const useStyles = makeStyles(theme => ({
  bible: {
    display: "flex",
    width: "100%",
    padding: "0px 0px",
    position: "absolute",
    top: 135,
    bottom: 0,
    overflow: "auto",
    marginBottom: -15
  },
  fullscreen: {
    backgroundColor: "#fff"
  }
}));

const BiblePane = ({ setValue, paneData, ref1, scroll, setSync, paneNo }) => {
  const classes = useStyles();
  const [fullscreen, setFullscreen] = React.useState(false);
  //edit this function to show the menu at a later stage
  //const showMenu = () => console.log("showMenu");
  //edit this function to hide the menu at a later stage
  // const hideMenu = () => console.log("hideMenu");
  return (
    <>
      {/* <Swipeable onSwipedUp={hideMenu} onSwipedDown={showMenu}> */}
      <div>
        <MenuBar
          {...paneData}
          setFullscreen={setFullscreen}
          setValue={setValue}
        />
        <Grid container className={classes.bible}>
          <Grid item xs={12}>
            <Fullscreen
              enabled={fullscreen}
              onChange={fullscreen => setFullscreen(fullscreen)}
              className={classes.fullscreen}
            >
              <Bible
                {...paneData}
                setValue={setValue}
                ref1={ref1}
                scroll={scroll}
                setSync={setSync}
                paneNo={paneNo}
              />
            </Fullscreen>
          </Grid>
        </Grid>
      </div>
      {/* </Swipeable> */}
    </>
  );
};
export default BiblePane;
