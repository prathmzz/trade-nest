import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MessageIcon from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: ({ expand }) => (expand ? "rotate(180deg)" : "rotate(0deg)"),
}));

export default function ViewProduct(props) {
  const { product } = props;
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLocationClick = () => {
    navigate("/map");
  };

  const handleShareClick = () => {
    const message = `Check out this product: ${product.name}\nPrice: ₹${product.price}\nLink: http://localhost:5000/${product.image}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleMessageClick = () => {
    navigate("/chat"); // Navigate to chat page
  };

  return (
    <Card
      sx={{
        width: { xs: 300, sm: 400, md: 500, lg: 800 },
        height: { xs: 500, sm: 600, md: 600 },
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            {product.title}
          </Typography>
        }
        subheader={
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
          >
            Price: ₹{product.price}
          </Typography>
        }
      />

      <CardMedia
        component="img"
        height="300"
        image={`http://localhost:5000/${product.image}`}
        alt={product.name}
        sx={{ objectFit: "contain" }}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        {product.location && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: 1 }}
          >
            <LocationOnIcon fontSize="small" /> Location: {product.location}
          </Typography>
        )}
        {product.category && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: 1 }}
          >
            Category: {product.category}
          </Typography>
        )}
      </CardContent>
      <CardActions disableSpacing>
      <IconButton aria-label="add to favorites">
  <FavoriteIcon sx={{ color: 'red' }} />
</IconButton>

        <IconButton aria-label="share" onClick={handleShareClick}>
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="location" onClick={handleLocationClick}>
          <LocationOnIcon />
        </IconButton>
        <IconButton aria-label="message" onClick={handleMessageClick}>
          <MessageIcon />
        </IconButton>
        <ExpandMore
          expand={expanded.toString()}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>Additional Details:</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
