import React from "react";
import { Link } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
const useStyles = makeStyles(theme => ({
  root: {
    top: 0,
    display: "flex",
    width: "100%",
    position: "absolute",
    height: 74
  },
  appBar: {
    background: "#3F0E40",
    padding: "0px 20px",
    marginBottom: "10px"
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    "& a": {
      color: "inherit",
      textDecoration: "none"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    marginRight: theme.spacing(15),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 200,
      "&:focus": {
        width: 240
      }
    }
  },
  button: {
    margin: theme.spacing(0),
    color: "white",
    borderColor: "white",
    backgroundColor: "#007bff"
  },

  form: {
    display: "inline-block",
    marginTop: 7
  },
}));
export default function TopBar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };
  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h5" noWrap>
            <Link to="/">Vachanonline</Link>
          </Typography>
          <FormGroup className={classes.form}>
            <FormControlLabel
              control={
                <Switch
                  checked={state.checkedB}
                  onChange={handleChange('checkedB')}
                  value="checkedB"
                  color="primary"
                />
              }
              label="Parallel Scroll"
            />
          </FormGroup>
        </Toolbar>






      </AppBar>
    </div>
  );
}
