import { Typography, Box } from "@mui/material";

const Contact = () => {
  return (
    <Box sx={{ margin: "100px 140px 100px 140px" }}>
      <Box
        sx={{ padding: "0 15px 0 15px", borderBottom: "1px solid lightGrey" }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Contact
        </Typography>
      </Box>
    </Box>
  );
};

export default Contact;
