import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme, Theme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { call } from "../../data/callWrapper";
import { useMutation } from "react-query";
import {
  DataGrid,
  getGridNumericOperators,
  GridColDef,
  GridRowParams,
  GridSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  CreatePlaylistRequest,
  GenreModel,
  SongModel,
  SongsApi,
  SpotifyApi,
  SpotifyPlaylist,
  UserModel,
} from "../../data/src";
import { format } from "date-fns";
import { Button, Collapse, Grid, Skeleton, Typography } from "@mui/material";
import { parseSpotifyId } from "../../utils";
import { useSpotify } from "../../contexts/spotifyContext";
import {
  CreatePlaylistDialog,
  ToggleSwitch,
  Playlist,
} from "./components/Playlists";

const useStyles = makeStyles(() => {
  return {
    header: {
      backgroundColor: (theme: Theme) => theme.palette.primary.light,
      color: "white",
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "rgb(80, 80, 89)",
        color: "#fff",
        fontSize: 16,
        "& span": {
          // master checkbox
          color: "#fff",
        },
      },
    },
  };
});

const defaultRequest: CreatePlaylistRequest = {
  name: "",
  description: "",
  _public: false,
};

const Songs = () => {
  const theme = useTheme();
  const {
    callSpotify,
    state: { authorized, profile },
  } = useSpotify();
  const classes = useStyles(theme);
  const [playlists, setPlaylists] = React.useState<SpotifyPlaylist[]>([]);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>();
  const [gridOpen, setGridOpen] = React.useState(true);
  const [request, setRequest] = React.useState(defaultRequest);
  const [createOpen, setCreateOpen] = React.useState(false);

  const [allSongs, setAllSongs] = React.useState<SongModel[]>([]);

  const { mutateAsync: getSongs, isLoading } = useMutation(async () => {
    const songsResults = await call(SongsApi).apiSongsGet();
    let filteredResults = songsResults.filter(
      (f) =>
        format(f.submitteddate, "yyyy-MM-dd") !==
        format(new Date(), "yyyy-MM-dd")
    );
    setAllSongs(filteredResults);
  });

  const { mutateAsync: getPlaylists } = useMutation(
    () =>
      authorized &&
      callSpotify(SpotifyApi)
        .apiSpotifyPlaylistsGet({ basslinesOnly: true })
        .then(setPlaylists)
        .catch(async (e) => {
          console.log(await e.json());
        })
  );

  React.useEffect(() => {
    getSongs();
    getPlaylists();
  }, []);

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: "submitteddate",
      sort: "desc",
    },
  ]);

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "artist",
      headerName: "Artist",
      flex: 1,
    },
    {
      field: "genreName",
      headerName: "Genre",
      flex: 0.75,
      valueGetter: (params) => {
        return (params.getValue(params.id, "genre") as GenreModel).name;
      },
    },
    {
      field: "submitter",
      headerName: "Submitter",
      flex: 0.5,
      renderCell: (params) => {
        const firstName = (params.getValue(params.id, "user") as UserModel)
          .firstName;
        const lastName = (params.getValue(params.id, "user") as UserModel)
          .lastName;
        return <span>{`${firstName} ${lastName}`}</span>;
      },
      valueGetter(params) {
        const firstName = (params.getValue(params.id, "user") as UserModel)
          .firstName;
        const lastName = (params.getValue(params.id, "user") as UserModel)
          .lastName;
        return `${firstName} ${lastName}`;
      },
    },
    {
      field: "submitteddate",
      headerName: "Date",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <span>
            {format(
              params.getValue(params.id, "submitteddate") as Date,
              "MM/dd/yyyy"
            )}
          </span>
        );
      },
      filterable: false,
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 0.5,
      renderCell: (params) => {
        const rating = params.getValue(params.id, "rating");
        return <span>{typeof rating === "number" ? rating : ""}</span>;
      },
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === ">" || operator.value === "<"
      ),
    },
  ];

  const handleCreatePlaylist = () => {
    (async () => {
      await callSpotify(SpotifyApi).apiSpotifyCreatePlaylistPost({
        createPlaylistRequest: {
          ...request,
          name: `@basslines: ${request.name}`,
          userId: profile.spotifyId,
          _public: false,
          trackUris: selectionModel.reduce((uris, id) => {
            const [spotifyId, valid, type] = parseSpotifyId(
              allSongs.find((s) => s.id === id).link
            );
            valid && uris.push(`spotify:${type}:${spotifyId}`);
            return uris;
          }, []),
        },
      });
      setCreateOpen(false);
      getPlaylists();
      setRequest(defaultRequest);
    })();
  };

  return (
    <Container maxWidth="xl">
      <Grid container direction="row" justifyContent="space-between">
        <Typography children="All Songs" variant="h3" />
        <ToggleSwitch open={gridOpen} toggle={() => setGridOpen((o) => !o)} />
      </Grid>
      <Collapse in={gridOpen} sx={{ pt: 3 }}>
        {isLoading ? (
          <Skeleton height="631px" />
        ) : (
          <DataGrid
            autoHeight
            classes={{ columnHeader: classes.header }}
            rows={allSongs}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            checkboxSelection={authorized}
            isRowSelectable={(params: GridRowParams) => {
              const [, isValid] = parseSpotifyId(
                (params.row as SongModel).link
              );
              return isValid;
            }}
            componentsProps={{
              columnMenu: { background: theme.palette.secondary },
            }}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onSelectionModelChange={setSelectionModel}
          />
        )}
        {authorized && (
          <Grid
            container
            direction="row"
            alignItems="center"
            visibility={selectionModel?.length ? "visible" : "hidden"}
          >
            <Button
              children="Create Playlist from selection"
              onClick={() => setCreateOpen(true)}
            />
            {!!playlists.length && (
              <Button children="Add Selected to Playlist" />
            )}
            <CreatePlaylistDialog
              selected={selectionModel?.length ?? 0}
              request={request}
              setRequest={setRequest}
              open={createOpen}
              handleClose={() => setCreateOpen(false)}
              handleCreate={handleCreatePlaylist}
            />
          </Grid>
        )}
      </Collapse>
      {authorized && (
        <>
          <Typography pt={4} children="Playlists" variant="h3" />
          {!playlists.length
            ? "No playlists? Use the Songs table to create one! "
            : playlists.map((pl, i) => (
                <Playlist
                  {...pl}
                  startOpen={i === 0}
                  key={pl.id}
                  refetch={getPlaylists}
                />
              ))}
        </>
      )}
    </Container>
  );
};

export default Songs;
