
import {useState} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import Moment from 'react-moment';
import 'moment-timezone';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function DetailUser({email, authType, fullname,IDStudent}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Chi tiết</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Họ và tên: {fullname}</h2>
          <h2 id="parent-modal-title">Email: {email}</h2>
          <p id="parent-modal-description">
            Đăng nhập bằng {authType === 'local' ? 'Email và Password' : 'Google'} 
            <br/>
            MSSV: {IDStudent ? IDStudent : 'Chưa cập nhật'}
          </p>
        </Box>
      </Modal>
    </div>
  );
}
