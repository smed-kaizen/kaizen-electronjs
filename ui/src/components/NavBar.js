// import React from "react"
//
//
// export default function (props) {
//   return(
//     <>
//       <Link to="/"><h2>Home</h2></Link>
//       <Link to="/new"><h2>New Task</h2></Link>
//
//     </>
//   )
// }

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListAltIcon from '@material-ui/icons/ListAlt';
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link className={classes.menuButton} to="/">
            <IconButton edge="start" color="default" aria-label="tasks">
              <ListAltIcon />
              <Typography variant="h6" color="textPrimary" className={classes.title}>
                Tasks
              </Typography>
            </IconButton>
          </Link>
          <Link to="/new">
            <IconButton edge="end" color="default" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

