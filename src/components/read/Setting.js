import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { BLUETRANSPARENT } from "../../store/colorCode";

const useStyles = makeStyles((theme) => ({
  btn: {
    marginRight: theme.spacing(1),
    display: "inline-block",
    textTransform: "none",
    textAlign: "center",
    fontSize: 16,
  },
  serif: {
    fontFamily: '"Roboto Slab", "serif"',
    textTransform: "none",
    fontSize: 16,
  },
  sans: {
    fontFamily: '"Roboto", "sans-serif"',
    textTransform: "none",
    fontSize: 16,
  },
  menu: {
    textAlign: "center",
    width: "100%",
    display: "inline-block",
    fontSize: 18,
  },
  margin: {
    height: theme.spacing(5),
  },
  slider: {
    color: "#bfbfbf",
  },
  selected: {
    background: "#c7c7c7",
    boxShadow: "inset 1px 1px 5px #9a9a9a",
  },
}));
const ITEM_HEIGHT = 68;
const Setting = ({
  fontSize,
  fontFamily,
  lineView,
  setValue,
  settingsAnchor,
  handleClose,
}) => {
  const classes = useStyles();
  const open = Boolean(settingsAnchor);
  const setFontSize = (event, value) => {
    setValue("fontSize", value);
  };
  const setFontFamily = (event) => {
    setValue("fontFamily", event.currentTarget.getAttribute("value"));
  };
  const setLineView = (event) => {
    setValue("lineView", event.target.checked);
  };
  return (
    <>
      <Menu
        id="long-menu"
        anchorEl={settingsAnchor}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 250,
            backgroundColor: BLUETRANSPARENT,
            color: "#fff",
          },
        }}
      >
        <MenuItem className={classes.menu}>Font Family</MenuItem>
        <MenuItem className={classes.menu}>
          <ButtonGroup
            variant="contained"
            aria-label="Large contained secondary button group"
          >
            <Button
              className={
                fontFamily === "Sans"
                  ? `${classes.sans} ${classes.selected}`
                  : classes.sans
              }
              onClick={setFontFamily}
              value="Sans"
            >
              Sans
            </Button>
            <Button
              className={
                fontFamily === "Serif"
                  ? `${classes.serif} ${classes.selected}`
                  : classes.serif
              }
              onClick={setFontFamily}
              value="Serif"
            >
              Serif
            </Button>
          </ButtonGroup>
        </MenuItem>

        <MenuItem className={classes.menu}>Font Size</MenuItem>
        <MenuItem className={classes.menu}>
          <div className={classes.margin} />
          <Slider
            value={fontSize}
            onChange={setFontSize}
            valueLabelDisplay="on"
            min={12}
            max={20}
            classes={{ root: classes.slider }}
          />
        </MenuItem>
        <MenuItem className={classes.menu}>
          <FormControlLabel
            control={
              <Switch
                checked={lineView}
                onChange={setLineView}
                name="lineView"
                color="default"
              />
            }
            label="Line View"
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Setting;
