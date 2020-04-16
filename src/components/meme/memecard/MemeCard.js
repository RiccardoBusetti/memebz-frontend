import { useMutation, useSubscription } from '@apollo/react-hooks';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Lightbox } from 'react-modal-image';

const UP_VOTE_MEME = gql`
  mutation upVoteMeme($input: VoteInput!) {
    upVoteMeme(input: $input) {
      id
      upVotes
    }
  }
`;

const DOWN_VOTE_MEME = gql`
  mutation downVoteMeme($input: VoteInput!) {
    downVoteMeme(input: $input) {
      id
      downVotes
    }
  }
`;

const UP_VOTE_MADE = gql`
  subscription upVoteMade($input: VoteInput!) {
    upVoteMade(input: $input) {
      id
      upVotes
    }
  }
`;

const DOWN_VOTE_MADE = gql`
  subscription downVoteMade($input: VoteInput!) {
    downVoteMade(input: $input) {
      id
      downVotes
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function MemesCard(props) {
  const classes = useStyles();

  const [meme, setMeme] = useState(props.meme);
  const [isExpanded, setExpand] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  const [upVoteMeme, { loading: upVoting }] = useMutation(UP_VOTE_MEME);
  const [downVoteMeme, { loading: downVoting }] = useMutation(DOWN_VOTE_MEME);

  useSubscription(UP_VOTE_MADE, {
    variables: { input: { memeId: meme.id } },
    onSubscriptionData: ({
      subscriptionData: {
        data: { upVoteMade },
      },
    }) => {
      setMeme({
        ...meme,
        upVotes: upVoteMade.upVotes,
      });
    },
  });
  useSubscription(DOWN_VOTE_MADE, {
    variables: { input: { memeId: meme.id } },
    onSubscriptionData: ({
      subscriptionData: {
        data: { downVoteMade },
      },
    }) => {
      setMeme({
        ...meme,
        downVotes: downVoteMade.downVotes,
      });
    },
  });

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          avatar={<Avatar className={classes.avatar}>{meme.author[0]}</Avatar>}
          action={
            <IconButton aria-label="more">
              <MoreVertIcon />
            </IconButton>
          }
          title={meme.title + ' by ' + meme.author}
          subheader={meme.dateCreated}
        />
        <CardMedia
          className={classes.media}
          image={meme.imageUrl}
          onClick={() => {
            if (!isImageModalOpen) {
              setImageModalOpen(true);
            }
          }}
        />
        <CardContent></CardContent>
        <CardActions disableSpacing>
          <IconButton
            aria-label="up vote meme"
            onClick={() => upVoteMeme({ variables: { input: { memeId: meme.id } } })}
          >
            {upVoting ? <CircularProgress /> : meme.upVotes}
            <ArrowUpwardRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="down vote meme"
            onClick={() => downVoteMeme({ variables: { input: { memeId: meme.id } } })}
          >
            {downVoting ? <CircularProgress /> : meme.downVotes}
            <ArrowDownwardRoundedIcon />
          </IconButton>
          <IconButton onClick={() => setExpand(!isExpanded)} aria-label="show comments">
            <ChatRoundedIcon />
          </IconButton>
        </CardActions>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body1">
              Comments are still under implementation, sorry for the inconvenience.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
      {isImageModalOpen && (
        <Lightbox
          medium={meme.imageUrl}
          showRotate={false}
          hideZoom={true}
          alt={meme.title}
          onClose={() => setImageModalOpen(false)}
        />
      )}
    </>
  );
}

export default MemesCard;
