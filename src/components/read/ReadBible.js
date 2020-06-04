import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import * as views from "../../store/views";
import TopBar from "./TopBar";
import BiblePane from "./BiblePane";
import Commentary from "../commentary/Commentary";
import Dictionary from "../dictionary/Dictionary";
import Infographics from "../infographics/Infographics";
import Audio from "../audio/Audio";
import Video from "../video/Video";
import Bookmarks from "../bookmark/Bookmarks";
import Highlights from "../highlight/Highlights";
import Notes from "../note/Notes";
import BibleMenu from "./BibleMenu";
import {
  getCommentaries,
  getDictionaries,
  getAudioBibles,
  getVideos,
} from "../common/utillity";

const useStyles = makeStyles((theme) => ({
  biblePane1: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderRight: "1px solid #f7f7f7",
    overflow: "hidden",
  },
  biblePane2: {
    position: "absolute",
    width: "50%",
    height: "100%",
    backgroundColor: "#fff",
    borderRight: "1px solid #f7f7f7",
    overflow: "hidden",
    "&:nth-child(2)": {
      right: 0,
      backgroundColor: "#fff",
    },
  },
  biblePane: {
    position: "absolute",
    height: "100%",
    [theme.breakpoints.only("xs")]: {
      width: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "calc(100% - 65px)",
    },
  },
  rightMenu: {
    width: 65,
    backgroundColor: "#3E4095",
    position: "absolute",
    height: "100vh",
    paddingTop: "60px",
    maxHeight: "100%",
    right: 0,
    bottom: 0,
    overflow: "hidden",
    textAlign: "center",
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
}));
const ReadBible = (props) => {
  const classes = useStyles();
  //ref to get bible panes 1 & 2
  const bibleText1 = React.useRef();
  const bibleText2 = React.useRef();
  //used to sync bibles in paralle bibles on scroll
  const [sync, setSync] = React.useState(0);
  const [parallelView, setParallelView] = React.useState("");
  const [bookObject, setBookObject] = React.useState({});
  let {
    setValue,
    setValue1,
    setValue2,
    copyPanel1,
    panel1,
    panel2,
    commentaries,
    dictionaries,
    setDictionary,
    audioBible,
    video,
    parallelScroll,
    login,
    userDetails,
    versions,
    versionBooks,
    versionSource,
  } = props;
  function menuClick(view) {
    //if closing commentary then reset selected commentary
    if (parallelView === view && view === views.COMMENTARY) {
      setValue("commentary", {});
    }
    setParallelView(parallelView === view ? "" : view);
  }
  //flag to prevent looping of on scroll event
  let ignoreScrollEvents = false;
  //function to implement parallel scroll
  const getScroll = React.useCallback((paneNo, parallelScroll, setSync) => {
    //check flag to prevent looping of on scroll event
    if (ignoreScrollEvents) {
      ignoreScrollEvents = false;
      return;
    }
    if (!parallelScroll) {
      return;
    }
    let text1 = bibleText1.current;
    let text2 = bibleText2.current;
    if (text1 && text2) {
      //if parallel scroll on scroll proportinal to scroll window
      if (paneNo === 1) {
        ignoreScrollEvents = true;
        text2.scrollTop =
          (text1.scrollTop / (text1.scrollHeight - text1.offsetHeight)) *
          (text2.scrollHeight - text2.offsetHeight);
        setSync(1);
      } else if (paneNo === 2) {
        ignoreScrollEvents = true;
        text1.scrollTop =
          (text2.scrollTop / (text2.scrollHeight - text2.offsetHeight)) *
          (text1.scrollHeight - text1.offsetHeight);
        setSync(2);
      }
    }
  }, []);
  //sync bible on scroll if parallel scroll on
  React.useEffect(() => {
    if (sync === 1) {
      if (panel2.book !== panel1.book) {
        setValue2("book", panel1.book);
        setValue2("bookCode", panel1.bookCode);
        setValue2("chapterList", panel1.chapterList);
      }
      if (panel2.chapter !== panel1.chapter) {
        setValue2("chapter", panel1.chapter);
      }
    }
    if (sync === 2) {
      if (panel1.book !== panel2.book) {
        setValue1("book", panel2.book);
        setValue1("bookCode", panel2.bookCode);
        setValue1("chapterList", panel2.chapterList);
      }
      if (panel1.chapter !== panel2.chapter) {
        setValue1("chapter", panel2.chapter);
      }
    }
    setSync(0);
  }, [panel1, panel2, setValue1, setValue2, sync]);
  React.useEffect(() => {
    //if commentaries not loaded fetch list of commentaries
    if (commentaries.length === 0) {
      getCommentaries(setValue);
    }
  }, [commentaries.length, setValue]);
  React.useEffect(() => {
    //if dictionaries not loaded fetch list of dictionaries
    if (dictionaries.length === 0) {
      getDictionaries(setDictionary);
    }
  }, [dictionaries.length, setDictionary]);
  React.useEffect(() => {
    //if audio bibles not loaded fetch list of audio bibles
    if (audioBible.length === 0) {
      getAudioBibles(setValue);
    }
  }, [audioBible.length, setValue]);
  React.useEffect(() => {
    //if videos not loaded fetch list of videos
    if (video.length === 0) {
      getVideos(setValue);
    }
  }, [video.length, setValue]);
  React.useEffect(() => {
    if (parallelView === views.PARALLELBIBLE) {
      copyPanel1();
    }
  }, [parallelView, copyPanel1]);
  const [pane, setPane] = React.useState("");
  //Set book object on change  of pane 1 for display in notes
  React.useEffect(() => {
    let bookList = versionBooks[versionSource[panel1.sourceId]];
    if (bookList && panel1.bookCode) {
      let selectedBook = bookList.find(
        (element) => element.book_code === panel1.bookCode
      );
      setBookObject(selectedBook);
    }
  }, [panel1.bookCode, panel1.sourceId, versionBooks, versionSource]);
  React.useEffect(() => {
    switch (parallelView) {
      case views.PARALLELBIBLE:
        setPane(
          <>
            <div className={classes.biblePane2}>
              <BiblePane
                setValue={setValue1}
                paneData={panel1}
                ref1={bibleText1}
                scroll={getScroll}
                setSync={setSync}
                paneNo={1}
              />
            </div>
            <div className={classes.biblePane2}>
              <BiblePane
                setValue={setValue2}
                paneData={panel2}
                ref1={bibleText2}
                scroll={getScroll}
                setSync={setSync}
                paneNo={2}
              />
            </div>
          </>
        );
        break;
      case views.COMMENTARY:
        setPane(
          <>
            <div className={classes.biblePane2}>
              <BiblePane setValue={setValue1} paneData={panel1} />
            </div>
            <div className={classes.biblePane2}>
              <Commentary />
            </div>
          </>
        );
        break;
      case views.DICTIONARY:
        setPane(
          <>
            <div className={classes.biblePane2}>
              <BiblePane setValue={setValue1} paneData={panel1} />
            </div>
            <div className={classes.biblePane2}>
              <Dictionary setDictionary={setDictionary} />
            </div>
          </>
        );
        break;
      case views.INFOGRAPHICS:
        setPane(
          <>
            <div className={classes.biblePane2}>
              <BiblePane setValue={setValue1} paneData={panel1} />
            </div>
            <div className={classes.biblePane2}>
              <Infographics setValue={setValue} />
            </div>
          </>
        );
        break;
      case views.AUDIO:
        setPane(
          <>
            <div className={classes.biblePane2}>
              <BiblePane setValue={setValue1} paneData={panel1} />
            </div>
            <div className={classes.biblePane2}>
              <Audio
                audioBible={audioBible}
                bookCode={panel1.bookCode}
                chapter={panel1.chapter}
              />
            </div>
          </>
        );
        break;
      case views.VIDEO:
        setPane(
          <>
            <div className={classes.biblePane2}>
              <BiblePane setValue={setValue1} paneData={panel1} />
            </div>
            <div className={classes.biblePane2}>
              <Video
                video={video}
                bookCode={panel1.bookCode}
                languageCode={panel1.languageCode}
              />
            </div>
          </>
        );
        break;
      case views.BOOKMARK:
        setPane(
          <>
            <div className={classes.biblePane2}>
              <BiblePane setValue={setValue1} paneData={panel1} />
            </div>
            <div className={classes.biblePane2}>
              <Bookmarks
                uid={userDetails.uid}
                versions={versions}
                setValue={setValue1}
              />
            </div>
          </>
        );
        break;
      case views.HIGHLIGHT:
        setPane(
          <>
            <div className={classes.biblePane2}>
              <BiblePane setValue={setValue1} paneData={panel1} />
            </div>
            <div className={classes.biblePane2}>
              <Highlights
                uid={userDetails.uid}
                versions={versions}
                setValue={setValue1}
              />
            </div>
          </>
        );
        break;
      case views.NOTE:
        setPane(
          <>
            <div className={classes.biblePane2}>
              <BiblePane setValue={setValue1} paneData={panel1} />
            </div>
            <div className={classes.biblePane2}>
              <Notes
                uid={userDetails.uid}
                versions={versions}
                setValue={setValue1}
                sourceId={panel1.sourceId}
                bookCode={panel1.bookCode}
                chapter={panel1.chapter}
                versesSelected={panel1.versesSelected}
                book={bookObject.short}
              />
            </div>
          </>
        );
        break;
      default:
        setPane(
          <div className={classes.biblePane1}>
            <BiblePane
              setValue={setValue1}
              paneData={panel1}
              singlePane={true}
            />
          </div>
        );
    }
  }, [
    audioBible,
    classes.biblePane1,
    classes.biblePane2,
    getScroll,
    panel1,
    panel2,
    parallelView,
    setDictionary,
    setValue,
    setValue1,
    setValue2,
    video,
    userDetails.uid,
    versions,
    bookObject,
  ]);
  return (
    <>
      <TopBar
        pScroll={parallelScroll}
        setValue={setValue}
        parallelView={parallelView}
        login={login}
        userDetails={userDetails}
      />
      <div>
        <div className={classes.biblePane}>{pane}</div>
        <div className={classes.rightMenu}>
          <BibleMenu menuClick={menuClick} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    versions: state.local.versions,
    versionBooks: state.local.versionBooks,
    versionSource: state.local.versionSource,
    panel1: state.local.panel1,
    panel2: state.local.panel2,
    parallelScroll: state.local.parallelScroll,
    commentaries: state.local.commentaries,
    dictionaries: state.local.dictionary.dictionaries,
    infographics: state.local.infographics,
    audioBible: state.local.audioBible,
    video: state.local.video,
    login: state.local.login,
    userDetails: state.local.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setValue1: (name, value) => {
      dispatch({ type: actions.SETVALUE1, name: name, value: value });
    },
    setValue2: (name, value) =>
      dispatch({ type: actions.SETVALUE2, name: name, value: value }),
    setValue: (name, value) =>
      dispatch({ type: actions.SETVALUE, name: name, value: value }),
    setDictionary: (name, value) =>
      dispatch({ type: actions.SETDICTIONARY, name: name, value: value }),
    copyPanel1: () => dispatch({ type: actions.COPYPANEL1 }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ReadBible);
