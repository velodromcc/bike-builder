import axios from 'axios';
import { CONSTANTS } from '@/utils';



export function getData() {
  var host = window.location.host;
  // If localhost OR Render, use the hardcoded host
  if (!host || host.indexOf('localhost') !== -1 || host.indexOf('onrender.com') !== -1) {
    host = CONSTANTS.host;
  }
  // Use local backend (relies on proxy in dev, or same domain in prod)
  // Replaces remote instance call
  return axios.get('/api/site/configuration/' + host);
}

export function buyBike(ctx, data) {
  // Use local server for emails (relative path for production)
  return axios.post('/api/send-email', data);
}

// --- ADMIN CONFIG ACTIONS ---

export function fetchTable(ctx, tableName) {
  return axios.get(`/api/config/${tableName}`);
}

export function saveRow(ctx, { tableName, row }) {
  if (row.id) {
    return axios.put(`/api/config/${tableName}/${row.id}`, row);
  } else {
    return axios.post(`/api/config/${tableName}`, row);
  }
}

export function deleteRow(ctx, { tableName, id }) {
  return axios.delete(`/api/config/${tableName}/${id}`);
}

export function restoreRow(ctx, { tableName, id }) {
  return axios.post(`/api/config/${tableName}/${id}/restore`);
}

export function fetchChildren(ctx, { tableName, id }) {
  // e.g. /api/config/Frameset/1/children
  return axios.get(`/api/config/${tableName}/${id}/children`);
}
