import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import ReactPlayer from "react-player";
import API from "../../store/api";

const useStyles = makeStyles((theme) => ({
  biblePanel: {
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    "& p": {
      textAlign: "justify",
      color: "#464545",
      marginBottom: 5,
    },
  },
  bibleReadingPane: {
    position: "absolute",
    right: 0,
    left: 44,
    paddingRight: (props) =>
      props.singlePane || props.padding > 60 ? props.padding : 60,
    paddingLeft: (props) =>
      props.singlePane || props.padding > 20 ? props.padding : 20,
    textAlign: "justify",
    paddingTop: 20,
    height: "100%",
    overflow: "scroll",
    lineHeight: "2em",
    "&::-webkit-scrollbar": {
      width: "0.45em",
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.4)",
      outline: "1px solid slategrey",
    },
  },
  audio: {
    height: "calc(100% - 55px)",
  },
  prevChapter: {
    position: "absolute",
    top: "45%",
    left: (props) =>
      props.singlePane || props.padding > 40 ? props.padding / 2 : 20,
    cursor: "pointer",
  },
  nextChapter: {
    position: "absolute",
    top: "45%",
    right: (props) =>
      props.singlePane || props.padding > 40 ? props.padding / 2 : 20,
    cursor: "pointer",
  },
  loading: {
    padding: 20,
  },
  player: {
    position: "absolute",
    bottom: "16px",
    left: "2%",
  },
  verseText: {
    padding: "4px 0 2px 4px",
  },
  verseNumber: {
    fontWeight: 600,
    paddingLeft: 6,
    bottom: 3,
    position: "relative",
  },
  highlight: {
    backgroundColor: "#feff3b",
  },
  selectedVerse: {
    backgroundColor: "#d9e8ef",
  },
  lineView: {
    display: "table",
  },
  firstVerse: {
    fontSize: "1.5em",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const Bible = (props) => {
  const fontFamily =
    props.fontFamily === "Sans" ? "Roboto,Noto Sans" : "Roboto Slab,Martel";
  const [verses, setVerses] = React.useState([]);
  const [loadingText, setLoadingText] = React.useState("Loading");
  const [isLoading, setIsLoading] = React.useState(true);
  const [previous, setPrevious] = React.useState({});
  const [next, setNext] = React.useState({});
  const [audioUrl, setAudioUrl] = React.useState("");
  const [padding, setPadding] = React.useState(
    window.innerWidth > 1200 ? (window.innerWidth - 1200) / 2 : 20
  );

  let {
    sourceId,
    bookCode,
    chapter,
    audio,
    audioBible,
    setValue,
    scroll,
    paneNo,
    parallelScroll,
    setSync,
    fontSize,
    lineView,
    singlePane,
    selectedVerses,
    setSelectedVerses,
    highlights,
    userDetails,
  } = props;
  const styleProps = { padding: padding, singlePane: singlePane };
  const classes = useStyles(styleProps);

  React.useEffect(() => {
    if (sourceId && bookCode && chapter) {
      //code to get chapter content if version(sourceId), book or chapter changed
      setIsLoading(true);
      setLoadingText("Loading");
      API.get(
        "bibles/" + sourceId + "/books/" + bookCode + "/chapter/" + chapter
      )
        .then(function (response) {
          setPrevious(response.data.previous);
          setNext(response.data.next);
          if (response.data.chapterContent === undefined) {
            setLoadingText("Book not uploaded");
          } else {
            setVerses(response.data.chapterContent.verses);
          }
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [sourceId, bookCode, chapter]);
  //if audio bible show icon
  React.useEffect(() => {
    if (audio) {
      setAudioUrl(
        audioBible.url + bookCode + "/" + chapter + "." + audioBible.format
      );
    }
  }, [audio, audioBible, bookCode, chapter]);
  //Function to load previous chapter
  const prevClick = () => {
    if (!isLoading && Object.keys(previous).length > 0) {
      setValue("chapter", previous.chapterId);
      setValue("bookCode", previous.bibleBookCode);
      setValue("versesSelected", []);
    }
  };
  //Function to load next chapter
  const nextClick = () => {
    if (!isLoading && Object.keys(next).length > 0) {
      setValue("chapter", next.chapterId);
      setValue("bookCode", next.bibleBookCode);
      setValue("versesSelected", []);
    }
  };
  const scrollText = () => {
    if (scroll) {
      scroll(paneNo, parallelScroll, setSync);
    }
  };
  const handleVerseClick = (event) => {
    event.preventDefault();
    if (Object.keys(userDetails).length !== 0 && userDetails.uid !== null) {
      let verseId = event.currentTarget.getAttribute("data-verse");
      let verses =
        selectedVerses.indexOf(parseInt(verseId)) > -1
          ? selectedVerses.filter((a) => parseInt(a) !== parseInt(verseId))
          : selectedVerses.concat([parseInt(verseId)]);
      setSelectedVerses(verses);
      setValue("versesSelected", verses);
    }
  };
  React.useEffect(() => {
    function handleResize() {
      let width = window.innerWidth;
      if (singlePane && width > 1200) {
        setPadding((width - 1200) / 2);
      } else {
        setPadding(20);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [singlePane]);
  const lineViewClass = lineView ? classes.lineView : "";
  return (
    <div
      className={classes.biblePanel}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {!isLoading && loadingText !== "Book not uploaded" ? (
        <div>
          <div
            onScroll={() => {
              scrollText();
            }}
            ref={props.ref1}
            className={
              audio
                ? `${classes.bibleReadingPane} ${classes.audio}`
                : classes.bibleReadingPane
            }
          >
            {verses.map((item) => {
              const verseClass =
                selectedVerses.indexOf(parseInt(item.number)) > -1
                  ? `${classes.verseText} ${classes.selectedVerse}`
                  : highlights.indexOf(parseInt(item.number)) > -1
                  ? `${classes.verseText} ${classes.highlight}`
                  : `${classes.verseText}`;
              const verseNumberClass =
                parseInt(item.number) === 1
                  ? `${classes.verseNumber} ${classes.firstVerse}`
                  : `${classes.verseNumber}`;
              return (
                <span
                  key={item.number}
                  className={lineViewClass}
                  onClick={handleVerseClick}
                  data-verse={item.number}
                >
                  <span className={verseNumberClass}>{item.number}</span>
                  <span className={verseClass}> {item.text}</span>
                </span>
              );
            })}
          </div>
          {audio ? (
            <ReactPlayer
              url={audioUrl}
              controls
              width="96%"
              height="50px"
              className={classes.player}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <h3 className={classes.loading}>{loadingText}</h3>
      )}
      <div
        color="default"
        aria-label="Add"
        className={classes.prevChapter}
        onClick={prevClick}
      >
        <i
          className="material-icons material"
          style={{ fontSize: "38px", color: "#555555", opacity: 0.7 }}
        >
          navigate_before
        </i>
      </div>
      <div
        color="default"
        aria-label="Add"
        className={classes.nextChapter}
        onClick={nextClick}
      >
        <i
          className="material-icons material"
          style={{ fontSize: "38px", color: "#555555", opacity: 0.7 }}
        >
          keyboard_arrow_right
        </i>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    parallelScroll: state.local.parallelScroll,
    userDetails: state.local.userDetails,
  };
};
export default connect(mapStateToProps)(Bible);
