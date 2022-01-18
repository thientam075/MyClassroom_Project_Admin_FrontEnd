import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Container, IconButton,
  InputBase, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@mui/material";
import moment from "moment";
import "moment-timezone";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import DetailAdmin from "./detailAdmin";
import ModalAdd from "./ModalAdd";
import Navbar from "./Navbar";


export default function AdminManager() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [listAdminFilter, setListAdminFilter] = useState([]);
  const [sortList, setSortList] = useState(false);
  const [keyWords, setKeyWords] = useState("");
  const [role, setRole] = useState(0);
  const takeToken = () => {
    let token = "";
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token").slice(1);
      token = token.slice(0, -1);
    }
    return token;
  };
  const takeUser = () => {
    let user;
    if (localStorage && localStorage.getItem("user")) {
      user = JSON.parse(localStorage.getItem("user"));
    }
    if(user){
      setRole(user.role);
    }
  };

  const fetchCreateAdmin = async (email, password, fullname) => {
    const token = takeToken();
    await fetch(process.env.REACT_APP_API + "/auth/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        fullname: fullname,
      }),
    }).then((res) => {
      if (!res.ok) {
        setError(true);
      } else {
        res.json().then((result) => {
          setIsLoaded(!isLoaded);
        });
      }
    });
  };
  const SortTime = () => {
    if (listAdminFilter.length === 0) {
      return;
    }
    let listAd = listAdminFilter;
    if (sortList) {
      listAd.sort((a, b) => {
        const d1 = moment(a.createdAt);
        const d2 = moment(b.createdAt);

        const result = d1.isAfter(d2) === true ? 1 : -1;

        return result;
      });
    } else {
      listAd.sort((a, b) => {
        const d1 = moment(a.createdAt);
        const d2 = moment(b.createdAt);

        const result = d1.isBefore(d2) === true ? 1 : -1;
        return result;
      });
    }
    setListAdminFilter(listAd);
    setSortList(!sortList);
  };
  const fetchDataAdmin = async () => {
    const token = takeToken();

    await fetch(process.env.REACT_APP_API + "/admin/listAdmin", {
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
            setListAdminFilter(result.data);
            setIsLoaded(true);
          }
        });
      }
    });
  };
  const onSearch = (e) => {
    e.preventDefault();
    let listAd = listAdminFilter;
    listAd = listAd.filter((Ad) => {
      return (
        Ad.fullname.toLowerCase().search(keyWords.toLowerCase()) !== -1 ||
        Ad.email.toLowerCase().search(keyWords.toLowerCase()) !== -1
      );
    });
    
    setListAdminFilter(listAd);
  };
  const ResetList = () => {
    setKeyWords("");
    setIsLoaded(!isLoaded);
  };
  useEffect(() => {
    takeUser();
    fetchDataAdmin();
  }, [isLoaded]);
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
              Danh sách các Admin
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
                placeholder="Tìm kiếm Admin"
                inputProps={{ "aria-label": "Tìm kiếm Admin" }}
                value = {keyWords}
                onChange={(e) => setKeyWords(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
            <Button onClick={ResetList}>Hủy lọc danh sách</Button>
            {role === 1 ? (<ModalAdd fetchCreateAdmin={fetchCreateAdmin}/>) :(<></>)}
          </Box>
          <Container>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên đầy đủ</TableCell>
                  <TableCell>Email</TableCell>
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
                {listAdminFilter ? (
                  listAdminFilter.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.fullname}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                          {new Date(row.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <DetailAdmin
                          email={row.email}
                          role={row.role}
                          fullname={row.fullname}
                          createdAt={row.createdAt}
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
