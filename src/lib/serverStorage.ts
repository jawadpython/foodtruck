// Server-side storage for API endpoints
// This provides a simple file-based storage solution for development
// In production, this would be replaced with a proper database

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DEVIS_FILE = path.join(DATA_DIR, 'devis.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const FOODTRUCKS_FILE = path.join(DATA_DIR, 'foodtrucks.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic storage functions
async function readData<T>(filePath: string): Promise<T[]> {
  try {
    console.log('Reading data from:', filePath);
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf-8');
    console.log('Data read successfully, length:', data.length);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from', filePath, ':', error);
    return [];
  }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Devis storage
export const serverDevisStorage = {
  async getAll() {
    return readData(DEVIS_FILE);
  },

  async create(devis: any) {
    const devisList = await readData(DEVIS_FILE);
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newDevis = { id, ...devis };
    devisList.push(newDevis);
    await writeData(DEVIS_FILE, devisList);
    return newDevis;
  },

  async update(id: string, updates: any) {
    const devisList = await readData(DEVIS_FILE);
    const index = devisList.findIndex((d: any) => d.id === id);
    if (index !== -1) {
      devisList[index] = { ...devisList[index], ...updates };
      await writeData(DEVIS_FILE, devisList);
      return devisList[index];
    }
    throw new Error('Devis not found');
  }
};

// Messages storage
export const serverMessagesStorage = {
  async getAll() {
    return readData(MESSAGES_FILE);
  },

  async create(message: any) {
    const messagesList = await readData(MESSAGES_FILE);
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newMessage = { id, ...message };
    messagesList.push(newMessage);
    await writeData(MESSAGES_FILE, messagesList);
    return newMessage;
  },

  async updateStatus(id: string, status: string) {
    const messagesList = await readData(MESSAGES_FILE);
    const index = messagesList.findIndex((m: any) => m.id === id);
    if (index !== -1) {
      messagesList[index].status = status;
      await writeData(MESSAGES_FILE, messagesList);
      return messagesList[index];
    }
    throw new Error('Message not found');
  }
};

// Food Trucks storage
export const serverFoodTruckStorage = {
  async getAll() {
    return readData(FOODTRUCKS_FILE);
  },

  async getById(id: string) {
    const trucksList = await readData(FOODTRUCKS_FILE);
    return trucksList.find((t: any) => t.id === id);
  },

  async create(truck: any) {
    const trucksList = await readData(FOODTRUCKS_FILE);
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newTruck = { id, ...truck };
    trucksList.push(newTruck);
    await writeData(FOODTRUCKS_FILE, trucksList);
    return newTruck;
  },

  async update(id: string, updates: any) {
    const trucksList = await readData(FOODTRUCKS_FILE);
    const index = trucksList.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      trucksList[index] = { ...trucksList[index], ...updates };
      await writeData(FOODTRUCKS_FILE, trucksList);
      return trucksList[index];
    }
    throw new Error('Food truck not found');
  },

  async delete(id: string) {
    const trucksList = await readData(FOODTRUCKS_FILE);
    const filteredTrucks = trucksList.filter((t: any) => t.id !== id);
    await writeData(FOODTRUCKS_FILE, filteredTrucks);
    return true;
  }
};