import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts';
import moment from 'moment';

import useStyles from './styles';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, CardActionArea } from '@material-ui/core/';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const Post = ( { post, setCurrentId } ) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));
  const userId = user?.result?._id;
  const [likes, setLikes] = useState(post?.likes);

  const openPost = () => navigate(`/posts/${post._id}`);

  const handleLike = async () => {
    dispatch(likePost(post._id));

    var hasLikedPost = post.likes.find((like) => like === userId);
    if (hasLikedPost!==undefined) {
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      setLikes([...post.likes, userId]);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpOutlinedIcon fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    } 
    return <><ThumbUpOutlinedIcon fontSize="small" />&nbsp;Like</>;
  };

  return ( 
    <Card className={classes.card} raised>
      <CardActionArea onClick={openPost}>
        <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png' } title={post.title} />
        <div className={classes.overlay}>
          <Typography variant='h6'>{post.name}</Typography>
          <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
        </div>
        <div className={classes.details}>
            <Typography variant='body2' color='textSecondary'>{post.tags.map((tag) => (`#${tag} `))}</Typography>
        </div>
        <Typography variant='h5' className={classes.title} gutterBottom component='h2'>{post.title}</Typography>
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>
            {post.message.split(' ').splice(0, 20).join(' ')}...
          </Typography>
        </CardContent>
      </CardActionArea>
      {( user?.result?._id === post?.creator ) && (
        <div className={classes.overlay2}>
          <Button 
            style={{color: 'white'}} 
            size='small' 
            onClick={ () => setCurrentId(post._id) }>
            <MoreHorizIcon fontSize='medium' />
          </Button>
        </div>
      )}
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
            <Likes />
        </Button>
        {( user?.result?._id === post?.creator ) && (
          <Button size='small' color='primary' onClick={()=>dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize='small' />
            Delete
          </Button>
        )}   
      </CardActions>
    </Card>
  )
}

export default Post;