import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: ({ expand }) => (expand ? 'rotate(180deg)' : 'rotate(0deg)'),
}));

export default function ProductViewCard(props) {
  const { product } = props;
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLocationClick = () => {
    navigate('/map'); // Navigate to the map page
  };

  return (
    <Card sx={{ width: { xs: 300, sm: 400, md: 500, lg: 1000 }, height: { xs: 500, sm: 600, md: 500 } }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">R</Avatar>}
        action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
        title={product.name}
        subheader={`Price: ₹${product.price}`}
      />

      <CardMedia
        component="img"
        height="300"
        image={`http://localhost:5000/${product.image}`}
        alt={product.name}
        sx={{ objectFit: 'contain' }}
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>

        <IconButton aria-label="location" onClick={handleLocationClick}>
          <LocationOnIcon />
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
          {/* Additional content goes here */}
        </CardContent>
      </Collapse>
    </Card>
  );
}
