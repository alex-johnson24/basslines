import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { Container, Theme } from "@mui/material";
import { call } from "../../data/callWrapper";
import { useMutation } from "react-query";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { GenreModel, SongModel, SongsApi, UserModel } from "../../data/src";
import { format } from "date-fns";

const useStyles = makeStyles(() => {
  return {
    header: {
      backgroundColor: (theme: Theme) => theme.palette.primary.light,
      color: "white",
    },
  };
});

const Songs = () => {
  const theme = useTheme();

  const classes = useStyles(theme);

  const [allSongs, setAllSongs] = React.useState<SongModel[]>([]);

  const { mutateAsync: getSongs, status: songsStatus } = useMutation(
    async () => {
      const songsResults = await call(SongsApi).songsGet();
      let filteredResults = songsResults.filter(
        (f) =>
          format(f.submitteddate, "yyyy-MM-dd") !==
          format(new Date(), "yyyy-MM-dd")
      );
      setAllSongs(filteredResults);
    }
  );

  React.useEffect(() => {
    getSongs();
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
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 0.5,
      renderCell: (params) => {
        const rating = params.getValue(params.id, "rating");
        return <span>{typeof rating === "number" ? rating : ""}</span>;
      },
    },
  ];

  return (
    <Container maxWidth="xl">
      <DataGrid
        autoHeight
        classes={{ columnHeader: classes.header }}
        rows={allSongs}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        componentsProps={{
          columnMenu: { background: theme.palette.secondary },
        }}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
      />
    </Container>
  );
};

export default Songs;
