import "./App.css";
import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { API_URL } from "./contants/constant";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: "" });
  const [isEditTask, setEditTask] = useState(false);
  useEffect(() => {
    getTasks();
  }, []);
  const getTasks = () => {
    axios
      .get(`${API_URL}tasks`)
      .then(function (response) {
        // handle success
        setTasks(response.data);
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        setTasks([]);
        console.log(error);
      });
  };

  const handleChange = (event) => {
    setTask({ ...task, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (task.title === "") return;
    if (task._id) {
      // Update operation
      axios
        .patch(`${API_URL}tasks/${task._id}`, { title: task.title })
        .then(function (response) {
          // handle success
          const updatedData = tasks.map((item) =>
            item._id === task._id ? task : item
          );
          setTasks(updatedData);
          setTask({ title: "" });
          setEditTask(false);
        })
        .catch(function (error) {
          // handle error
          setTask([]);
          console.log(error);
        });
    } else {
      // Insert operation
      axios
        .post(`${API_URL}tasks`, task)
        .then(function (response) {
          // handle success
          const newData = [...tasks, { ...response.data }];
          setTasks(newData);
          setTask({ title: "" });
          setEditTask(false);
        })
        .catch(function (error) {
          // handle error
          setTasks([]);
          console.log(error);
        });
    }

    setTask({ id: "", title: "" });
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`http://localhost:5000/tasks/${taskId}`)
      .then(function (response) {
        // handle success
        const newData = tasks.filter((task) => task._id !== taskId);
        setTasks(newData);
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const handleEditTask = (taksId) => {
    const itemToEdit = tasks.find((taksk) => taksk._id === taksId);
    setTask(itemToEdit);
    setEditTask(true);
  };

  return (
    <div className="App">
      <Container maxWidth="xl">
        <Grid container={true} justifyContent="center" sx={{ m: 2 }}>
          <TextField
            variant="outlined"
            name="title"
            value={task.title}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            onClick={handleSubmit}
          >
            {isEditTask ? "Edit" : "Add"}
          </Button>
        </Grid>
        {/* {console.log(tasks)} */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length &&
                tasks.map((task) => (
                  <TableRow
                    key={task._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {task.title}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditTask(task._id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default App;
