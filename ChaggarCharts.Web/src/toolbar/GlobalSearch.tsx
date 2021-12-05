import * as React from "react";
import {
  alpha,
  Card,
  CircularProgress,
  InputBase,
  List,
  ListItem,
  ListItemText,
  styled,
} from "@mui/material";
import { debounce } from "lodash";
import { SongModel, SongsApi } from "../data/src";
import { call } from "../data/callWrapper";
import { useMutation } from "react-query";
import SearchIcon from "@mui/icons-material/Search";

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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "25ch",
      },
    },
  },
}));

const GlobalSearch = () => {
  const [searchResults, setSearchResults] = React.useState<SongModel[]>([]);
  const [searchString, setSearchString] = React.useState<string>();
  const inputRef = React.useRef<HTMLInputElement | null>();

  const refBounds = inputRef.current?.getBoundingClientRect();

  const { mutateAsync: getSongs, status: songsStatus } = useMutation(
    async (search: string) => {
      const songsResults = await call(SongsApi).songsSongSearchGet({
        search,
      });
      return songsResults;
    }
  );

  const getOptionsDelayed = React.useCallback(
    debounce((text: string, callback: () => SongModel[]) => {
      setSearchResults([]);
      getSongs(text).then(callback);
    }, 200),
    []
  );

  const resetSearch = () => {
    setSearchString("");
    setSearchResults([]);

  };

  React.useEffect(() => {
    getOptionsDelayed(searchString, (filteredOptions) => {
      setSearchResults(filteredOptions);
    });
  }, [searchString, getOptionsDelayed]);

  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          ref={inputRef}
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => setSearchString(e.target.value)}
          value={searchString}
          onBlur={resetSearch}
        />
      </Search>
      <Card
        sx={{
          position: "absolute",
          top: refBounds?.bottom,
          left: refBounds?.left,
          width: refBounds?.width,
          display: searchString ? "flex" : "none",
          height: "300px",
          overflow: "auto",
        }}
      >
        {searchResults.length === 0 ? (
          <CircularProgress sx={{ margin: "auto" }} />
        ) : (
          <List>
            {searchResults.map((m, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={m.title}
                  secondary={m.artist}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Card>
    </>
  );
};

export default GlobalSearch;
