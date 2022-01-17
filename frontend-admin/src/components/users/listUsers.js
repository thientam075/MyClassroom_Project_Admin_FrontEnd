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
} from "@mui/material";
import Moment from 'react-moment';
import 'moment-timezone';
import DetailUser from "./detailUser";
import { Redirect } from "react-router-dom";


export default function ListUsers() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ListUser, setListUser] = useState([]);
  const [sortList, setSortList] = useState(false);
  const takeToken = () => {
    let token = "";
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token").slice(1);
      token = token.slice(0, -1);
    }
    return token;
  };
  const SortTime = () => {
    if(ListUser.length === 0){
      return;
    }
    if(sortList){
      ListUser.sort((a,b) => {
        return a.createdAt - b.createdAt;
      })
    }else{
      ListUser.sort((a,b) => {
        return b.createdAt - a.createdAt;
      })
    }
    setSortList(!sortList);
    setIsLoaded(!isLoaded);
    
  }
  const fetchDataUser = async () => {
    const token = takeToken();

    await fetch(process.env.REACT_APP_API + "/admin/ListUser", {
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
            setListUser(result.data);
            setIsLoaded(true);
          }
        });
      }
    });
  }
  useEffect(() => {
    fetchDataUser();
  }, [isLoaded]) 
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
          </Box>
          <Container>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Thứ tự</TableCell>
                  <TableCell>Tên đầy đủ</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>
                  <Box sx = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    Thời gian tạo
                  <Button onClick = {SortTime}>Sắp xếp</Button>
                  </Box>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { ListUser ? 
                  ListUser.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.fullname}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell><Moment>{row.createdAt}</Moment></TableCell>
                    <TableCell align="right">
                      <DetailUser
                        email={row.email}
                        authType={row.authType}
                        fullname={row.fullname}
                        IDStudent={row.IDStudent}
                      />
                    </TableCell>
                  </TableRow>
                )) : <>Loading.....</>}
              </TableBody>
            </Table>
          </Container>
        </>
      )}
    </>
  );
}
