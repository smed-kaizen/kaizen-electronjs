import React from "react"
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import Divider from '@material-ui/core/Divider';
import { findTasksOfDay, createTask } from '../lib/api'
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import TextField from "@material-ui/core/TextField";
import Drawer from "@material-ui/core/Drawer";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useForm } from "../lib/customHooks"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

export default function (props) {
  const classes = useStyles();
  const [tasksLoading, setTasksLoading] = React.useState(false)
  const [tasks, setTasks] = React.useState([])
  const [newTaskModalOpen, setNewTaskModalOpen] = React.useState(false)
  const [taskValues, setTaskValues, resetTaskValues] = useForm({ title: "", difficulty: "easy" })

  React.useEffect(() => {
    updateTodayTaskList()
  }, [])

  const updateTodayTaskList = async () => {
    setTasksLoading(true)
    try {
      const response = await findTasksOfDay(new Date())
      setTasks(response.data)
    }catch (err) {
      console.log('Error updating the list', err)
    }
    finally {
      setTasksLoading(false)
    }
  }

  const createNewTask = () => {
    console.log('Creating a task', taskValues)
    createTask(taskValues).then(() => {
      updateTodayTaskList()
      setNewTaskModalOpen(false)
      resetTaskValues()
    }).catch(err => {
      console.log('Error creating task', err)
    })
  }

  const matchColorWithDifficulty = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'green'
      case 'medium':
        return 'orange'
      case 'hard':
        return 'red'
      default:
        return 'grey'
    }
  }

  const renderTasks = () => {
    return (
      <List dense={false}>
        {tasks.map(task =>
          <>
            <ListItem button>
              <ListItemAvatar>
                <Avatar>
                  <AssignmentLateIcon style={{color: matchColorWithDifficulty(task.difficulty)}} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={task.title}
                secondary={task.difficulty}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => {
                  console.log('Delete Task', task)
                }}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </>
        )}
        <Divider variant="inset" component="li" />
      </List>
    )
  }

  return (
    <Grid item >
      <Typography variant="h6" className={classes.title}>
        Tasks of Today
      </Typography>
      <div className={classes.demo}>
        { tasksLoading && <CircularProgress /> }
        { renderTasks() }
      </div>



      <React.Fragment key={'bottom'}>
        <IconButton onClick={() => setNewTaskModalOpen(true)}>
          <FiberNewIcon fontSize="large" color="secondary"/>
        </IconButton>
        <Drawer anchor="bottom" open={newTaskModalOpen} onClose={() => setNewTaskModalOpen(false)}>
          <div
            role="presentation"
            // onClick={() => setNewTaskModalOpen(false)}
            // onKeyDown={() => setNewTaskModalOpen(false)}
          >
            <FormControl>
              <TextField
                id="title"
                name="title"
                style={{ margin: 8 }}
                placeholder="Title of the task"
                // helperText="This is a helper"
                fullWidth
                margin="normal"
                value={taskValues.title}
                onChange={setTaskValues}
              />
              <Select
                name="difficulty"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={taskValues.difficulty}
                onChange={setTaskValues}
              >
                <MenuItem value={"easy"}>easy</MenuItem>
                <MenuItem value={"medium"}>medium</MenuItem>
                <MenuItem value={"hard"}>hard</MenuItem>
              </Select>

              <IconButton onClick={createNewTask}>
                <FiberNewIcon fontSize="large" color="secondary"/>
              </IconButton>
            </FormControl>

          </div>
        </Drawer>
      </React.Fragment>
    </Grid>
  )
}
