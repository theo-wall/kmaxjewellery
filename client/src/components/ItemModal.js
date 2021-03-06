import { TextField, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Image from "../components/Image";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "scroll",
};

export default function ItemModal({ open, setOpen, cat, editData }) {
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
    navigate(0);
  };

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (editData) {
      setImages(editData.images);
    }
  }, [editData]);

  const handleImage = async (imageFile) => {
    const imageForm = new FormData();
    imageForm.append("image", imageFile);
    const uploadResponse = await axios.post("/saleItem/upload", imageForm);
    if (uploadResponse) {
      setImages([...images, uploadResponse.data]);
    }
  };

  const onSubmit = async (data) => {
    data.category = cat;
    data.images = images;
    if (editData) {
      const editPostResponse = await axios.post(
        `/saleItem/edit/${editData._id}`,
        data
      );
      if (editPostResponse) {
        navigate(0);
      }
    } else {
      const createPostResponse = await axios.post("/saleItem/post", data);
      if (createPostResponse) {
        navigate(0);
      }
    }
  };

  const { register, handleSubmit } = useForm();

  const LocalForm = () => {
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography label="title" sx={{ fontWeight: 600 }}>
            Title:
          </Typography>
          <TextField
            fullWidth
            id="title"
            type="text"
            autoComplete="disabled"
            defaultValue={editData ? editData.title : ""}
            {...register("title", { required: true, maxLength: 100 })}
            sx={{ mb: "20px" }}
          />

          <Typography label="description" sx={{ fontWeight: 600 }}>
            Description:
          </Typography>
          <TextField
            fullWidth
            id="description"
            name="description"
            type="text"
            multiline
            rows={10}
            defaultValue={editData ? editData.description : ""}
            {...register("description", { required: true })}
            sx={{ mb: "20px" }}
          />
          <Button type="submit" variant="outlined" sx={{ fontWeight: 600 }}>
            {editData ? "Submit Edit" : "Submit Item"}
          </Button>
          {editData && (
            <Button
              type="submit"
              variant="outlined"
              sx={{ fontWeight: 600, margin: 1 }}
              onClick={() => {
                setImages([]);
              }}
            >
              Clear Images
            </Button>
          )}
        </form>
        <Typography label="images" sx={{ fontWeight: 600, margin: 1 }}>
          Upload Images:
        </Typography>
        <input
          id="photos"
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => {
            handleImage(e.target.files[0]);
          }}
          multiple={false}
        />
        <Box sx={{ display: "flex" }}>
          {images.map((image, index) => {
            return (
              <Image
                src={image}
                alt={"KMAXJewellery image"}
                loading={"lazy"}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "10px 0 10px 0",
                  height: "100px",
                }}
              />
            );
          })}
        </Box>
      </>
    );
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add new item in {cat}
          </Typography>
          <LocalForm />
        </Box>
      </Modal>
    </div>
  );
}
