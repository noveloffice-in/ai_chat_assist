import React, { useState, useEffect, useCallback } from "react";
import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeUpdateDoc, useFrappePostCall } from "frappe-react-sdk";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { debounce } from "lodash";
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import AlertDialog from "../../../layouts/full/shared/dialog/AlertDialog";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
const agentStatus = [
  {
    name: "Enabled",
    color: "#00CC00"
  },
  {
    name: "Disabled",
    color: "#FF4D4D"
  }
]
const tableHeads = [
  "Agent Name",
  "Display Name",
  "Available",
  "Admin",
  "Action"
]
export default function Agents() {
  const { data: agents, mutate } = useFrappeGetDocList("Agent Profile", {
    fields: ["name", "agent_name", "agent_display_name", "is_available", "is_admin", "enabled"],
  });
  const { call } = useFrappePostCall("ai_chat_assist.api.supportify.agent.get_users_without_agent_profile");
  const { updateDoc } = useFrappeUpdateDoc();
  const { createDoc } = useFrappeCreateDoc();
  const loggedInAgentEmail = useSelector(state => state.agentReducer.agentEmail);
  const [editableAgents, setEditableAgents] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAddAgentDialog, setOpenAddAgentDialog] = useState(false);
  const [newAgent, setNewAgent] = useState({ user: "", agent_name: "", agent_display_name: "" });
  const [users, setUsers] = useState([]);
  const [agentName, setAgentName] = useState("Hello");
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogButtonNameAndFunctions, setDialogButtonNameAndFunctions] = useState([]);
  const [dialogMessage, setDialogMessage] = useState("");
  useEffect(() => {
    if (agents) {
      setEditableAgents(agents);
    }
  }, [agents]);
  const notifySuccess = (message) => { toast.success(message, { toastId: "success" }) }
  const notifyError = (message) => { toast.error(message, { toastId: "error" }) }
  const notifyWarning = (message) => { toast.warning(message, { toastId: "warning" }) }
  const debouncedUpdate = useCallback(
    debounce(async (name, field, value) => {
      try {
        await updateDoc("Agent Profile", name, { [field]: value });
        mutate(); // Refresh data after update
      } catch (error) {
        console.error("Update failed:", error);
      }
    }, 500),
    []
  );
  const handleCheckboxChange = (name, field) => (event) => {
    const newValue = event.target.checked;
    setEditableAgents((prev) =>
      prev.map((agent) =>
        agent.name === name ? { ...agent, [field]: newValue } : agent
      )
    );
    debouncedUpdate(name, field, newValue);
  };
  const handleAddAgent = () => {
    setOpen(true);
    call({})
      .then((res) => {
        setUsers(res.message);
        setOpenAddAgentDialog(true);
      })
      .catch((err) => {
        notifyError("Error fetching users without agent profile");
      });
  }
  const handleClose = () => {
    setOpen(false);
    setNewAgent({ user: "", agent_name: "", agent_display_name: "" });
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAgent((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSave = async () => {
    if (!newAgent.agent_name) {
      notifyError("Agent Name is required!");
      return;
    }
    if (!newAgent.user) {
      notifyError("User is required!");
      return;
    }
    try {
      await createDoc("Agent Profile", newAgent);
      mutate();
      handleCloseAddAgentDialog();
      notifySuccess("Agent added successfully!");
    } catch (error) {
      notifyError("Error adding agent!");
    }
  };
  const handleCloseAddAgentDialog = () => {
    setOpenAddAgentDialog(false);
  };
  const handleDisable = () => {
    console.log("Agent Name", agentName);
    if (agents) {
      updateDoc("Agent Profile", agentName, { enabled: false })
        .then(() => {
          handleClose();
          mutate();
          notifySuccess("Agent disabled successfully!");
        })
        .catch((err) => {
          console.log(err);
          notifyError("Error disabling agent!");
        });
    }
  }
  const handleEnable = () => {
    console.log("Agent Name", agentName);
    if (agents) {
      updateDoc("Agent Profile", agentName, { enabled: true })
        .then(() => {
          handleClose();
          mutate();
          notifySuccess("Agent enabled successfully!");
        })
        .catch((err) => {
          console.log(err);
          notifyError("Error enabling agent!");
        });
    }
  }
  const handleToggleEnabled = (name, enabled) => {
    console.log("name", name);
    // console.log("enabled", enabled);
    const buttonName = enabled ? "Disable" : "Enable";
    setAgentName(name);
    setOpen(true);
    setDialogTitle(enabled ? "Disable Agent" : "Enable Agent");
    setDialogMessage(enabled ? "Are you sure you want to disable this agent?" : "Are you sure you want to enable this agent?");
    setDialogButtonNameAndFunctions([
      { name: "Cancel", function: handleClose },
      { name: buttonName, function: buttonName === "Disable" ? handleDisable : handleEnable }
    ]);
  };
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {agentStatus.map((status) => (
            <Stack direction="row" alignItems="center" gap={1}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", p: 0.8, backgroundColor: status.color }} ></Box>
              <Typography variant="caption">~ {status.name} </Typography>
            </Stack>
          ))}
        </Stack>
        {/* Add Agent Button */}
        <Button
          variant="contained"
          onClick={handleAddAgent}
        >
          <AddIcon />
          Add Agent
        </Button>
      </Box>
      {/* Agents Table */}
      <Paper elevation={10} sx={{ p: 2, borderRadius: "16px", mt: 2 }}>
        <TableContainer sx={{ borderRadius: "16px" }}>
          <Table>
            <TableHead>
              <TableRow>
                {
                  tableHeads.map((head) => (
                    <TableCell key={head}><Typography variant="body2" fontWeight={600}>{head}</Typography></TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {editableAgents.map((agent) => (
                <TableRow key={agent.name}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Box sx={{ display: "flex", alignItems: "center", borderRadius: "50%", p: 1, backgroundColor: agent.enabled ? "#00CC00" : "#FF4D4D" }} ></Box>
                      {agent.agent_name}
                    </Stack>
                  </TableCell>
                  <TableCell>{agent.agent_display_name || "N/A"}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={!!agent.is_available}
                      onChange={handleCheckboxChange(agent.name, "is_available")}
                      disabled={agent.name === "Administrator" || !agent.enabled}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={!!agent.is_admin}
                      onChange={handleCheckboxChange(agent.name, "is_admin")}
                      disabled={agent.name === "Administrator" || !agent.enabled}
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleToggleEnabled(agent.name, agent.enabled)}
                      disabled={agent.name === "Administrator" || agent.name === loggedInAgentEmail}>
                      {agent.enabled ? <PersonOffIcon /> : <PersonIcon />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <AlertDialog
        showDialog={open}
        setShowDialog={handleClose}
        title={dialogTitle}
        message={dialogMessage}
        buttonNameAndFunctions={dialogButtonNameAndFunctions}
      />
      {/* Add Agent Dialog */}
      <Dialog open={openAddAgentDialog} onClose={handleCloseAddAgentDialog}>
        <DialogTitle>Add New Agent</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="User"
            name="user"
            value={newAgent.user}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          >
            {users?.map((user) => (
              <MenuItem key={user.name} value={user.name}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Agent Name"
            name="agent_name"
            value={newAgent.agent_name}
            onChange={handleInputChange}
            required
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Agent Display Name"
            name="agent_display_name"
            value={newAgent.agent_display_name}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddAgentDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      // theme={theme.palette.mode}
      />
    </>
  );
}