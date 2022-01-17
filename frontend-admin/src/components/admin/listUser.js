import * as React from "react";
import Navbar from "./Navbar";
import {
  Typography,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
} from "@mui/material";
import DetailAdmin from "./detailAdmin";
function createData(id, email, role, fullname, createdAt, amout) {
  return { id, email, role, fullname, createdAt, amout };
}

const rows = [
  createData(
    0,
    "16 Mar, 2019",
    "Elvis Presley",
    "Tupelo, MS",
    "VISA ⠀•••• 3719",
    312.44
  ),
  createData(
    1,
    "16 Mar, 2019",
    "Paul McCartney",
    "London, UK",
    "VISA ⠀•••• 2574",
    866.99
  ),
  createData(
    2,
    "16 Mar, 2019",
    "Tom Scholz",
    "Boston, MA",
    "MC ⠀•••• 1253",
    100.81
  ),
  createData(
    3,
    "16 Mar, 2019",
    "Michael Jackson",
    "Gary, IN",
    "AMEX ⠀•••• 2000",
    654.39
  ),
  createData(
    4,
    "15 Mar, 2019",
    "Bruce Springsteen",
    "Long Branch, NJ",
    "VISA ⠀•••• 5919",
    212.79
  ),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function ListData() {
  return (
    <React.Fragment>
    <Navbar/>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Danh sách các Admin
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Thứ tự</TableCell>
            <TableCell>Tên đầy đủ</TableCell>
            <TableCell>Vai Trò</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.fullname}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell align="right">
                <DetailAdmin
                  email={row.email}
                  role={row.role}
                  fullname={row.fullname}
                  createdAt={row.createdAt}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
