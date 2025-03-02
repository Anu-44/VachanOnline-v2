import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import { getAudioBibleObject } from "../common/utility";
import Setting from "../read/Setting";
import BookCombo from "../common/BookCombo";
import Version from "../common/Version";
import Metadata from "../common/Metadata";
import Bookmark from "../bookmark/Bookmark";
import Highlight from "../highlight/Highlight";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import BorderColor from "@material-ui/icons/BorderColor";
import Note from "../note/Note";
import { AUDIO } from "../../store/views";
import Tooltip from "@material-ui/core/Tooltip";
import { BLUETRANSPARENT } from "../../store/colorCode";
import Close from "../common/Close";

const useStyles = makeStyles((theme) => ({
  read: {
    display: "flex",
    width: "100%",
    padding: "0 10px 0 44px",
    borderBottom: "1px solid #f1ecec",
    position: "absolute",
    height: 61,
    top: 72,
    [theme.breakpoints.only("xs")]: {
      padding: "0 15px 0 15px",
    },
  },

  select: {
    marginTop: "-8px",
    backgroundColor: "red",
  },
  info: {
    padding: 0,
    width: "30px",
    marginTop: 20,
    marginRight: 4,
    color: BLUETRANSPARENT,
    cursor: "pointer",
  },
  settings: {
    padding: 0,
    width: "30px",
    marginTop: 20,
    marginLeft: "-10px",
    marginRight: "-5px",
    color: BLUETRANSPARENT,
    cursor: "pointer",
  },
  items: {
    display: "flex",
  },
}));
const MenuBar = (props) => {
  const classes = useStyles();
  let {
    setValue,
    paneNo,
    setFullscreen,
    versions,
    version,
    sourceId,
    chapter,
    versionBooks,
    versionSource,
    fontSize,
    fontFamily,
    lineView,
    bookCode,
    audio,
    userDetails,
    selectedVerses,
    setSelectedVerses,
    refUrl,
    highlights,
    parallelView,
    printRef,
    printNotes,
    setPrintNotes,
    printHighlights,
    setPrintHighlights,
  } = props;
  function goFull() {
    setFullscreen(true);
  }
  const [settingsAnchor, setSettingsAnchor] = React.useState(null);
  const [metadataList, setMetadataList] = React.useState(null);
  const [audioBible, setAudioBible] = React.useState({});
  const [audioIcon, setAudioIcon] = React.useState("");
  const [bookmarkIcon, setBookmarkIcon] = React.useState("");
  const [highlightIcon, setHighlightIcon] = React.useState("");
  const [noteIcon, setNoteIcon] = React.useState("");
  const [bookDisplay, setBookDisplay] = React.useState("");
  const bookList = versionBooks[versionSource[sourceId]];

  React.useEffect(() => {
    if (bookList) {
      let book = bookList.find((element) => element.book_code === bookCode);
      if (book) {
        setBookDisplay(book.short);
      }
    }
  }, [bookList, bookCode, setBookDisplay]);

  //Set bookmark icon
  React.useEffect(() => {
    if (userDetails.uid !== null) {
      setBookmarkIcon(
        <Bookmark
          uid={userDetails.uid}
          sourceId={sourceId}
          bookCode={bookCode}
          chapter={chapter}
        />
      );
      return;
    }
    setBookmarkIcon("");
  }, [userDetails, sourceId, bookCode, chapter]);

  //Set highlight icon
  React.useEffect(() => {
    if (userDetails.uid !== null) {
      if (selectedVerses && selectedVerses.length > 0) {
        setHighlightIcon(
          <Highlight
            selectedVerses={selectedVerses}
            setSelectedVerses={setSelectedVerses}
            refUrl={refUrl}
            highlights={highlights}
          />
        );
        return;
      } else {
        setHighlightIcon(
          <Tooltip title="Select Verses">
            <div className={classes.info}>
              <BorderColor fontSize="small" color="disabled" />
            </div>
          </Tooltip>
        );
      }
    } else {
      setHighlightIcon("");
    }
  }, [
    userDetails,
    selectedVerses,
    classes.info,
    setSelectedVerses,
    refUrl,
    highlights,
  ]);

  //Set note icon
  React.useEffect(() => {
    if (userDetails.uid !== null) {
      if (selectedVerses && selectedVerses.length > 0) {
        setNoteIcon(
          <Note
            uid={userDetails.uid}
            selectedVerses={selectedVerses}
            setSelectedVerses={setSelectedVerses}
            sourceId={sourceId}
            bookCode={bookCode}
            chapter={chapter}
          />
        );
        return;
      } else {
        setNoteIcon(
          <Tooltip title="Select Verses">
            <div className={classes.info}>
              <NoteIcon fontSize="small" color="disabled" />
            </div>
          </Tooltip>
        );
      }
    } else {
      setNoteIcon("");
    }
  }, [
    userDetails,
    selectedVerses,
    setSelectedVerses,
    sourceId,
    bookCode,
    chapter,
    classes.info,
  ]);
  //function to open and close settings menu
  function openSettings(event) {
    setSettingsAnchor(event.currentTarget);
  }
  function closeSettings() {
    setSettingsAnchor(null);
  }
  //get metadata from versions object if version changed
  React.useEffect(() => {
    if (versions !== undefined) {
      const language = version.split("-");
      const languageVersions = versions.find(
        (e) => e.languageVersions[0].language.code === language[0]
      );
      if (languageVersions !== undefined) {
        const versionObject = languageVersions.languageVersions.find(
          (e) => e.version.code.toUpperCase() === language[1].toUpperCase()
        );
        setValue("languageCode", versionObject.language.code);
        setMetadataList(versionObject.metadata);
      }
    }
  }, [setValue, version, versions]);
  React.useEffect(() => {
    setAudioBible(getAudioBibleObject(versions, sourceId));
  }, [versions, sourceId]);
  //if audioBible updated show audio bible icon if audio bible available
  React.useEffect(() => {
    const openAudioBible = () => {
      setValue("audio", !audio);
      setValue("audioBible", audioBible);
    };
    if (
      audioBible &&
      audioBible.url &&
      bookCode in audioBible.books &&
      parallelView !== AUDIO
    ) {
      setAudioIcon(
        <Tooltip title="Audio Bible">
          <div className={classes.info} onClick={openAudioBible}>
            <i className="material-icons md-23">volume_up</i>
          </div>
        </Tooltip>
      );
    } else {
      setValue("audio", false);
      setAudioIcon("");
    }
  }, [audio, audioBible, bookCode, classes.info, setValue, parallelView]);
  return (
    <div>
      <Box className={classes.read}>
        <Box flexGrow={1}>
          <Version setValue={setValue} version={version} bookCode={bookCode} />
          {bookCode ? (
            <BookCombo
              paneNo={paneNo}
              bookCode={bookCode}
              bookList={versionBooks[versionSource[sourceId]]}
              chapter={chapter}
              setValue={setValue}
              minimal={true}
            />
          ) : (
            ""
          )}
        </Box>
        <Box className={classes.items}>
          {noteIcon}
          {highlightIcon}
          {bookmarkIcon}
          <Metadata
            metadataList={metadataList}
            title="Version Name (in Eng)"
            abbreviation="Abbreviation"
          ></Metadata>
          {audioIcon}
          <Tooltip title="Fullscreen">
            <div onClick={goFull} className={classes.info}>
              <i className="material-icons md-23">zoom_out_map</i>
            </div>
          </Tooltip>
          <Tooltip title="Settings">
            <div
              className={classes.settings}
              aria-label="More"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={openSettings}
            >
              <i className="material-icons md-23">more_vert</i>
            </div>
          </Tooltip>
          <Setting
            fontSize={fontSize}
            fontFamily={fontFamily}
            lineView={lineView}
            setValue={setValue}
            settingsAnchor={settingsAnchor}
            handleClose={closeSettings}
            printRef={printRef}
            printNotes={printNotes}
            setPrintNotes={setPrintNotes}
            printHighlights={printHighlights}
            setPrintHighlights={setPrintHighlights}
            bookDisplay={bookDisplay}
            chapter={chapter}
          />
          {paneNo === 2 ? <Close /> : ""}
        </Box>
      </Box>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    versions: state.local.versions,
    versionBooks: state.local.versionBooks,
    userDetails: state.local.userDetails,
    versionSource: state.local.versionSource,
    parallelView: state.local.parallelView,
  };
};
export default connect(mapStateToProps)(MenuBar);
