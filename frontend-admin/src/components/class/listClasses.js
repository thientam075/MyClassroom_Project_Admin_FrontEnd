import { useState, useEffect } from "react";
import Navbar from "../admin/Navbar";
import {
  Typography,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  InputBase
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Moment from "react-moment";
import "moment-timezone";
import DetailClass from "./detailClass";
import { Redirect } from "react-router-dom";
import moment from "moment";

export default function ListClasses() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ListUserFilter, setListUserFilter] = useState([]);
  const [sortList, setSortList] = useState(false);
  const [keyWords, setKeyWords] = useState("");
  const takeToken = () => {
    let token = "";
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token").slice(1);
      token = token.slice(0, -1);
    }
    return token;
  };
  const SortTime = () => {
    if (ListUserFilter.length === 0) {
      return;
    }
    let listUs = ListUserFilter;
    if (sortList) {
      listUs.sort((a, b) => {
        const d1 = moment(a.createdAt);
        const d2 = moment(b.createdAt);

        const result = d1.isBefore(d2) === true ? 1 : -1;
        return result;
      });
    } else {
      listUs.sort((a, b) => {
        const d1 = moment(a.createdAt);
        const d2 = moment(b.createdAt);

        const result = d1.isAfter(d2) === true ? 1 : -1;
        return result;
      });
    }
    setListUserFilter(listUs);
    setSortList(!sortList);
  };
  const fetchDataUser = async () => {
    const token = takeToken();

    await fetch(process.env.REACT_APP_API + "/admin/listAllClass", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => {
      if (!res.ok) {
        setError(true);
      } else {
        res.json().then((result) => {
          if (result) {
            setListUserFilter(result.data);
            setIsLoaded(true);
          }
        });
      }
    });
  };

  return (
    <>
      {error ? (
        <Redirect to="/login" />
      ) : (
        <>
          <Navbar />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "20px",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Danh sách các người dùng
            </Typography>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
              }}
              onSubmit={e => onSearch(e)}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Tìm kiếm người dùng"
                inputProps={{ "aria-label": "Tìm kiếm người dùng" }}
                value = {keyWords}
                onChange={(e) => setKeyWords(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
            <Button onClick={ResetList}>Hủy lọc danh sách</Button>
          </Box>
          <Container>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Môn học</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      Thời gian tạo
                      <Button onClick={SortTime}>Sắp xếp</Button>
                    </Box>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ListUserFilter ? (
                  ListUserFilter.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        <Moment parse="YYYY-MM-DD HH:mm">
                          {row.createdAt}
                        </Moment>
                      </TableCell>
                      <TableCell align="right">
                        <DetailClass
                          
                          
                          fullname={row.name}
                         subject={row.subject}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>Loading.....</>
                )}
              </TableBody>
            </Table>
          </Container>
        </>
      )}
    </>
  );
}
