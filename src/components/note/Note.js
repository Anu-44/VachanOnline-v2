import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { useFirebase } from "react-redux-firebase";
import { useFirebaseConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  info: {
    padding: 0,
    width: "30px",
    marginTop: 20,
    marginRight: 4,
    color: "#1976D2",
    cursor: "pointer",
  },
}));
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: 500,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function Note({
  uid,
  selectedVerses,
  setSelectedVerses,
  bookCode,
  sourceId,
  chapter,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [noteText, setNoteText] = React.useState("");
  const firebase = useFirebase();

  const handleNoteTextChange = (e) => {
    setNoteText(e.target.value);
  };

  const openNoteDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveNote = () => {
    let noteObject = {
      createdDate: Date.now(),
      modifiedDate: Date.now(),
      body: noteText,
      verses: selectedVerses.sort(),
    };
    let notesArray =
      notes && notes[sourceId] && notes[sourceId][bookCode]
        ? notes[sourceId][bookCode][chapter]
        : [] || [];
    notesArray.push(noteObject);
    return firebase
      .ref(
        "users/" + uid + "/notes/" + sourceId + "/" + bookCode + "/" + chapter
      )
      .set(notesArray, function (error) {
        if (error) {
          console.log("Note added error");
        } else {
          console.log("Note added succesfully");
          handleClose();
          setSelectedVerses([]);
        }
      });
  };

  //Get data from firebase
  useFirebaseConnect(`users/${uid}/notes`);

  const notes = useSelector(
    ({ firebase: { data } }) =>
      data.users && data.users[uid] && data.users[uid].notes
  );

  return (
    <div>
      <div className={classes.info} onClick={openNoteDialog}>
        <Tooltip title="Add Note">
          <NoteIcon fontSize="small" />
        </Tooltip>
      </div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Note
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            id="outlined-multiline-static"
            label="Note Text"
            multiline
            rows={10}
            fullWidth={true}
            inputProps={{ maxLength: 1000 }}
            variant="outlined"
            value={noteText}
            onChange={handleNoteTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={saveNote} color="primary">
            Save
          </Button>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
