import React, { useEffect } from 'react';
import moment from 'moment';
import { getPost, getPostsBySearch } from '../../actions/posts';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import CommentSection from './CommentSection';

import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core';
import useStyles from './styles';

const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const classes = useStyles();

  useEffect( () => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(()=> {
    if(post) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [post]);

  if(!post) return null;

  if(isLoading) {
    return <Paper className={classes.loadingPaper} elevation={6} >
      <CircularProgress size='7em' />
    </Paper>
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  const openPost = (_id) => navigate(`/posts/${_id}`);

  // console.log(post);
  // console.log(posts);
  // console.log(isLoading);
  console.log(recommendedPosts);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => (
            <Link to={`/tags/${tag}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
              {` #${tag} `}
            </Link>
          ))}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">
            Created by:
            <Link to={`/creators/${post.name}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
              {` ${post.name}`}
            </Link>
          </Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={post} />     
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
      </div>
      {recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant='h5'>You might also like:</Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(({ title, message, name, likes, selectedFile, _id}) =>(
              <div 
                style={{ margin: '20px', cursor: 'pointer' }}
                onClick={() => openPost(_id)}
                key={_id}
              >
                <Typography variant='h6' gutterBottom>{title}</Typography>
                <Typography variant='subtitle2' gutterBottom>{name}</Typography>
                <Typography variant='subtitle2' gutterBottom>{message}</Typography>
                <Typography variant='subtitle1' gutterBottom>Likes: {likes.length}</Typography>
                <img src={selectedFile} width='200px' />
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  )
}

export default PostDetails;