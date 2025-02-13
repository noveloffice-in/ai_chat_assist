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
];

const tableHeads = [
  "Agent Name",
  "Display Name",
  "Available",
  "Admin",
  "Action"
];

export default function Agents() {
  const { data: agents, mutate } = useFrappeGetDocList("Agent Profile", {
    fields: ["name", "agent_name", "agent_display_name", "is_available", "is_admin", "enabled"],
  });
  const { call } = useFrappePostCall("ai_chat_assist.api.supportify.agent.get_users_without_agent_profile");
  const { updateDoc } = useFrappeUpdateDoc();
  const { createDoc } = useFrappeCreateDoc();
  const loggedInAgentEmail = useSelector(state => state.agentReducer.agentEmail);
  const [editableAgents, setEditableAgents] = useState([]);
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "",
    message: "",
    agentName: "",
    currentEnabled: false,
    buttonNameAndFunctions: []
  });

  const [openAddAgentDialog, setOpenAddAgentDialog] = useState(false);
  const [newAgent, setNewAgent] = useState({ user: "", agent_name: "", agent_display_name: "" });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (agents) {
      setEditableAgents(agents);
    }
  }, [agents]);
    
  const notifySuccess = (message) => toast.success(message, { toastId: "success" });
  const notifyError = (message) => toast.error(message, { toastId: "error" });

  const debouncedUpdate = useCallback(
    debounce(async (name, field, value) => {
      try {
        await updateDoc("Agent Profile", name, { [field]: value });
        mutate();
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
    call({})
      .then((res) => {
        setUsers(res.message);
        setOpenAddAgentDialog(true);
      })
      .catch(() => {
        notifyError("Error fetching users without agent profile");
      });
  };

  const handleClose = () => {
    setDialogState(prev => ({ ...prev, open: false }));
    setNewAgent({ user: "", agent_name: "", agent_display_name: "" });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAgent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseAddAgentDialog = () => {
    setOpenAddAgentDialog(false);
  };
  
  const handleSave = async () => {
    if (!newAgent.agent_name || !newAgent.user) {
      notifyError(newAgent.agent_name ? "User is required!" : "Agent Name is required!");
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

  const handleToggleEnabled = async (name, currentEnabled) => {
    const newEnabled = !currentEnabled;
    const title = newEnabled ? "Enable Agent" : "Disable Agent";
    const message = `Are you sure you want to ${newEnabled ? 'enable' : 'disable'} this agent?`;
    const handleConfirm = async () => {
      try {
        await updateDoc("Agent Profile", name, { enabled: newEnabled });
        handleClose();
        mutate();
        notifySuccess(`Agent ${newEnabled ? 'enabled' : 'disabled'} successfully!`);
      } catch (err) {
        console.error(err);
        notifyError(`Error ${newEnabled ? 'enabling' : 'disabling'} agent!`);
      }
    };
    setDialogState({
      open: true,
      title,
      message,
      agentName: name,
      currentEnabled: currentEnabled,
      buttonNameAndFunctions: [
        { name: "Cancel", function: handleClose },
        { name: newEnabled ? "Enable" : "Disable", function: handleConfirm }
      ]
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {agentStatus.map((status, index) => (
            <Stack key={index} direction="row" alignItems="center" gap={1}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", p: 0.8, backgroundColor: status.color }} />
              <Typography variant="caption">~ {status.name}</Typography>
            </Stack>
          ))}
        </Stack>
        <Button variant="contained" onClick={handleAddAgent}>
          <AddIcon />
          Add Agent
        </Button>
      </Box>
      <Paper elevation={10} sx={{ p: 2, borderRadius: "16px", mt: 2 }}>
        <TableContainer sx={{ borderRadius: "16px" }}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeads.map((head) => (
                  <TableCell key={head}>
                    <Typography variant="body2" fontWeight={600}>{head}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {editableAgents.map((agent) => (
                <TableRow key={agent.name}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Box sx={{ display: "flex", alignItems: "center", borderRadius: "50%", p: 1, backgroundColor: agent.enabled ? "#00CC00" : "#FF4D4D" }} />
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
                    <Button
                      onClick={() => handleToggleEnabled(agent.name, agent.enabled)}
                      disabled={agent.name === "Administrator" || agent.name === loggedInAgentEmail}
                    >
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
        showDialog={dialogState.open}
        setShowDialog={handleClose}
        title={dialogState.title}
        message={dialogState.message}
        buttonNameAndFunctions={dialogState.buttonNameAndFunctions}
      />
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
      />
    </>
  );
}