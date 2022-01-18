import { useState, useEffect } from "react";
import Navbar from "./Navbar";
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
} from "@mui/material";
import Moment from "react-moment";
import "moment-timezone";
import DetailAdmin from "./detailAdmin";
import { Redirect } from "react-router-dom";
import ModalAdd from "./ModalAdd";
import moment from "moment";

export default function AdminManager() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [listAdmin, setListAdmin] = useState([]);
  const [listAdminFilter, setListAdminFilter] = useState([]);
  const [sortList, setSortList] = useState(false);
  const takeToken = () => {
    let token = "";
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token").slice(1);
      token = token.slice(0, -1);
    }
    return token;
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
    if (listAdmin.length === 0) {
      return;
    }
    let listAd = listAdminFilter;
    if (sortList) {
      listAd.sort((a, b) => {
        const d1 = moment(a.createdAt);
        const d2 = moment(b.createdAt);
        
        const result = d1.isBefore(d2) === true ? 1 : -1;
        return result;
      });
    } else {
      listAd.sort((a, b) => {
        const d1 = moment(a.createdAt);
        const d2 = moment(b.createdAt);
        
        const result = d1.isAfter(d2) === true ? 1 : -1;
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
            setListAdmin(result.data);
            setIsLoaded(true);
            setListAdminFilter(result.data);
          }
        });
      }
    });
  };
  useEffect(() => {
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
            <ModalAdd fetchCreateAdmin={fetchCreateAdmin} />
          </Box>
          <Container>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Thứ tự</TableCell>
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
                        <Moment parse="YYYY-MM-DD HH:mm">
                          {row.createdAt}
                        </Moment>
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
