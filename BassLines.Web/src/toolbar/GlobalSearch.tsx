import * as React from "react";
import {
  alpha,
  Box,
  Card,
  CircularProgress,
  ClickAwayListener,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  styled,
  useMediaQuery,
} from "@mui/material";
import { debounce } from "lodash";
import { SongModel, SongsApi } from "../data/src";
import { call } from "../data/callWrapper";
import { useMutation } from "react-query";
import SearchIcon from "@mui/icons-material/Search";
import SongDetailDialog from "./SongDetailDialog";
import { useTheme } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== "listCursor",
})<{ listCursor: number | null }>(({ listCursor, theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: listCursor === null ? "12ch" : "25ch",
      "&:focus": {
        width: "25ch",
      },
    },
  },
}));

const GlobalSearch = () => {
  const [searchResults, setSearchResults] = React.useState<SongModel[]>([]);
  const [searchString, setSearchString] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement | null>();
  const resultsRefs = React.useRef([]);
  const [listCursor, setListCursor] = React.useState<number | null>(null);
  const [selectedSongDetail, setSelectedSongDetail] =
    React.useState<SongModel>();

  const refBounds = inputRef.current?.getBoundingClientRect();
  const resetResultsRefs = () =>
    resultsRefs.current.splice(0, resultsRefs.current.length);

  const { mutateAsync: getSongs, status: songsStatus } = useMutation(
    async (search: string) => {
      const songsResults = await call(SongsApi).apiSongsSongSearchGet({
        search,
      });
      return songsResults;
    }
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const getOptionsDelayed = React.useCallback(
    debounce((text: string, callback: () => SongModel[]) => {
      resetResultsRefs();
      setSearchResults([]);
      getSongs(text).then(callback);
    }, 200),
    []
  );

  const resetSearch = () => {
    if (listCursor === null) {
      setSearchString("");
      setSearchResults([]);
      resetResultsRefs();
    }
  };

  const openSearchResult = (song: SongModel) => {
    setSelectedSongDetail(song);
    setListCursor(null);
  };

  const closeDetailDialog = () => {
    setSelectedSongDetail(null);
  };

  const focusResults = (event: React.KeyboardEvent<unknown>) => {
    // convenience here -- hate how it moves the cursor to the start of the word on arrow up
    if (event.key === "ArrowUp") event.preventDefault();
    if (event.key === "ArrowDown" && searchResults.length > 0) setListCursor(0);
  };

  const traverseResults = (event: React.KeyboardEvent<unknown>) => {
    if (event.key === "ArrowDown") {
      if (listCursor === resultsRefs.current.length - 1) return;
      setListCursor((current) => current + 1);
    } else if (event.key === "ArrowUp") {
      if (listCursor === 0) {
        inputRef.current.focus();
        // I swear before God and everything holy this is the only way to force it to move the cursor
        setTimeout(
          () =>
            inputRef.current.setSelectionRange(
              inputRef.current.value.length,
              inputRef.current.value.length
            ),
          0
        );
        setListCursor(null);
      } else {
        setListCursor((current) => current - 1);
      }
    }
  };

  React.useEffect(() => {
    if (listCursor !== null) {
      resultsRefs.current[listCursor].focus();
    } else if (document.activeElement !== inputRef.current) {
      resetSearch();
    }
  }, [listCursor]);

  React.useEffect(() => {
    getOptionsDelayed(searchString, (filteredOptions) => {
      setSearchResults(filteredOptions);
    });
  }, [searchString, getOptionsDelayed]);

  return (
    <>
      <SongDetailDialog
        open={Boolean(selectedSongDetail)}
        song={selectedSongDetail}
        handleClose={closeDetailDialog}
      />
      <ClickAwayListener onClickAway={resetSearch}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            inputRef={inputRef}
            placeholder="Search…"
            onChange={(e) => setSearchString(e.target.value)}
            onKeyDown={(e) => focusResults(e)}
            value={searchString}
            listCursor={listCursor}
          />
        </Search>
      </ClickAwayListener>
      <ClickAwayListener onClickAway={() => setListCursor(null)}>
        <Card
          sx={{
            position: "absolute",
            top: refBounds?.bottom,
            left: refBounds?.left,
            width: refBounds?.width,
            display: searchString || listCursor !== null ? "flex" : "none",
            height: "300px",
            overflow: "auto",
          }}
        >
          {songsStatus === "loading" ? (
            <CircularProgress sx={{ margin: "auto" }} />
          ) : searchResults.length > 0 ? (
            <List onKeyDown={(e) => traverseResults(e)} sx={{ width: "100%" }}>
              {searchResults.map((m, i) => (
                <ListItemButton
                  ref={(element) => (resultsRefs.current[i] = element)}
                  key={i}
                  sx={{ width: "100%" }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") openSearchResult(m);
                  }}
                  onClick={() => openSearchResult(m)}
                >
                  <ListItemText primary={m.title} secondary={m.artist} />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Box sx={{ margin: "auto" }}>No results (refine your search)</Box>
          )}
        </Card>
      </ClickAwayListener>
    </>
  );
};

export default GlobalSearch;
