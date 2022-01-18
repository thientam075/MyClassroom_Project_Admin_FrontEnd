import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Container,
  IconButton, InputBase, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@mui/material";
import moment from "moment";
import "moment-timezone";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Navbar from "../admin/Navbar";
import DetailUser from "./detailUser";
import UpdateStudentIdDialog from "./updateStudentIdDialog";

export default function ListUsers() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ListUserFilter, setListUserFilter] = useState([]);
  const [sortList, setSortList] = useState(false);
  const [keyWords, setKeyWords] = useState("");

  const [isOpenedDialog, setIsOpenedDialog] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [idStudent, setIdStudent] = useState(null);

  const { addToast } = useToasts();

  const closeDialog = () => {
    setIdStudent(null);
    setIdUser(null);
    setIsOpenedDialog(false);
  }

  const openDialog = () => {
    setIsOpenedDialog(true);
  }

  const updateStudentId = (studentId) => {
    const token = takeToken();

    fetch(process.env.REACT_APP_API + "/admin/updateStudentId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: idUser,
        studentId: studentId,
      }),
    }).then((res) => {
      if (!res.ok) {
        setError(true);
      } else {
        res.json().then((result) => {
          if (result.result === 0) {
            addToast("Đã tồn tạo sinh viên có mã số vừa nhập.", {
              appearance: "error",
              autoDismiss: true,
            });
            closeDialog();
          }else {
            if(result.result === -1) {
              addToast("Đã xảy ra lỗi.", {
                appearance: "error",
                autoDismiss: true,
              });
              closeDialog();
            }
            else {
              addToast("Cập nhật thành công.", {
                appearance: "success",
                autoDismiss: true,
              });
              closeDialog();
              setIsLoaded(false);
            }
          }
        });
      }
    });
  }

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
            setListUserFilter(result.data);
          }
        });
      }
    });
  };
  const ResetList = () => {
    setKeyWords("");
    setIsLoaded(!isLoaded);
  };
  const onSearch = (e) => {
    e.preventDefault();
    let listUs = ListUserFilter;
    listUs = listUs.filter((Us) => {
      return (
        Us.fullname.toLowerCase().search(keyWords.toLowerCase()) !== -1 ||
        Us.email.toLowerCase().search(keyWords.toLowerCase()) !== -1
      );
    });
    console.log(listUs);
    setListUserFilter(listUs);
  };
  
  const banOrUnbanUser = (id, ban) => {
    const token = takeToken();

    fetch(process.env.REACT_APP_API + "/admin/banOrUnbanUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
        ban: !ban,
      }),
    }).then((res) => {
      if (!res.ok) {
        setError(true);
      } else {
        res.json().then((result) => {
          if (result) {
            setIsLoaded(false);
          }
        });
      }
    });
  }
  
  useEffect(() => {
    fetchDataUser();
    setIsLoaded(true);
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
                {ListUserFilter ? (
                  ListUserFilter.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.fullname}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        {new Date(row.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <DetailUser
                          email={row.email}
                          authType={row.authType}
                          fullname={row.fullname}
                          IDStudent={row.IDstudent}
                        />
                        <Button sx={{mt: 1}} variant="outlined" onClick={() => banOrUnbanUser(row.id, row.isBan)}>{row.isBan ? "Mở khóa" : "Khóa"}</Button>
                        <br></br>
                        <Button sx={{mt: 1}} variant="outlined" onClick={() => {
                          setIdUser(row.id);
                          setIdStudent(row.IDstudent === null ? "" : row.IDstudent);
                          openDialog();
                        }}>Cập nhật mssv</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>Loading.....</>
                )}
              </TableBody>
            </Table>
          </Container>
          <UpdateStudentIdDialog isOpened={isOpenedDialog} close={closeDialog} update={updateStudentId} idStudent={idStudent}></UpdateStudentIdDialog>
        </>
      )}
    </>
  );
}
