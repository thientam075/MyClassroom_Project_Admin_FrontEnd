import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';


function UpdateStudentIdDialog({isOpened, close, update, idStudent}) {
  const [init, setInit] = useState(true);
  const [studentId, setStudentId] = useState("");
  

  const changeStudentId = (event) => {
    setInit(false);
    setStudentId(event.target.value);
  }

  return (
    <div>
      <Dialog open={isOpened} onClose={close}>
        <DialogTitle>Cập nhật mã số sinh viên</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="studentId"
            label="Mã số sinh viên"
            fullWidth
            variant="outlined"
            value={init ? idStudent : studentId}
            onChange={(event) => changeStudentId(event)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            close();
            setStudentId("");
            setInit(true);
          }}>Hủy</Button>
          <Button onClick={() => {
            update(studentId);
            setStudentId("");
            setInit(true);
          }} disabled= {!(studentId !== "")}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UpdateStudentIdDialog;