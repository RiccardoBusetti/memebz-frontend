import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useCloudinaryWidget} from "../../../hooks/cloudinary";
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from "@material-ui/core/Typography";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const ADD_MEME = gql`
    mutation addMeme($input: AddMemeInput!) {
        addMeme(input: $input) {
            id
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    header: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1)
    },
    progress: {
        margin: theme.spacing(2)
    }
}));

function AddMemeDialog(props) {
    const classes = useStyles();

    const [meme, setMeme] = useState({})

    const [addMeme, {loading: addingMeme}] = useMutation(ADD_MEME, {
        onCompleted: (data) => {
            props.onDialogClose(true)
        }
    });

    const widget = useCloudinaryWidget(process.env.REACT_APP_CLOUD_NAME, process.env.REACT_APP_UPLOAD_PRESET, (info) => {
        setMeme({
            ...meme,
            imageUrl: info.secure_url
        })
    })

    return (
        <Dialog open={props.isOpen} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Upload a new meme {addingMeme && "ADDING MEME"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To upload a new meme, please fill in the form below and let the fun begin!
                </DialogContentText>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={2}
                >
                    {addingMeme ? <CircularProgress className={classes.progress} item xs={12}/> : <>
                        <Grid item xs={12}>
                            <Typography className={classes.header} variant="body1" component="h2">
                                Give a cool title to your meme:
                            </Typography>
                            <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                variant="outlined"
                                fullWidth
                                onChange={(e) => setMeme({
                                    ...meme,
                                    title: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.header} variant="body1" component="h2">
                                Choose your (possibly funny) name:
                            </Typography>
                            <TextField
                                autoFocus
                                margin="dense"
                                type="text"
                                variant="outlined"
                                fullWidth
                                onChange={(e) => setMeme({
                                    ...meme,
                                    author: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.header} variant="body1" component="h2">
                                Choose your meme image (pls not too many cats):
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={meme.imageUrl !== undefined}
                                startIcon={meme.imageUrl !== undefined ? <CheckCircleIcon/> : <CloudUploadIcon/>}
                                onClick={() => widget.open()}
                            >
                                {meme.imageUrl !== undefined ? "Image uploaded" : "Upload meme image"}
                            </Button>
                        </Grid>
                    </>}
                </Grid>
            </DialogContent>
            <DialogActions>
                {!addingMeme &&
                <>
                    <Button color="primary" onClick={() => props.onDialogClose(false)}>
                    I am noob
                    </Button>
                    <Button color="primary" onClick={() => addMeme({variables: {input: meme}})}>
                        Add meme
                    </Button>
                </>}

            </DialogActions>
        </Dialog>
    )
}

export default AddMemeDialog;