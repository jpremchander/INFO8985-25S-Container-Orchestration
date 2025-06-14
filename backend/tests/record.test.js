import request from 'supertest';
import app from '../server.js';  // Import the Express app
import { MongoClient } from 'mongodb';

// Mock MongoDB Client
jest.mock('mongodb', () => {
  const mockFind = jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue([{ _id: '123', name: 'John Doe' }]),
  });
  const mockCollection = {
    find: mockFind,
    insertMany: jest.fn().mockResolvedValue({ insertedCount: 1 }),
    findOne: jest.fn().mockResolvedValue({ _id: '123', name: 'John Doe' }),
    updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
  };
  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };
  const mockClient = {
    db: jest.fn().mockReturnValue(mockDb),
  };
  return { MongoClient: { prototype: mockClient } };
});

describe('Record Routes', () => {
  let mockCollection;
  let mockDb;

  beforeAll(() => {
    // Setup mock collection and DB
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([{ _id: '123', name: 'John Doe' }]),
      }),
      insertMany: jest.fn().mockResolvedValue({ insertedCount: 1 }),
      findOne: jest.fn().mockResolvedValue({ _id: '123', name: 'John Doe' }),
      updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all records', async () => {
    const response = await request(app).get('/record');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ _id: '123', name: 'John Doe' }]);
    expect(mockCollection.find).toHaveBeenCalled();
  });

  it('should fetch a specific record by ID', async () => {
    const response = await request(app).get('/record/123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ _id: '123', name: 'John Doe' });
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: expect.any(Object) });
  });

  it('should add new records', async () => {
    const newRecord = { name: 'Jane Doe', position: 'Developer', level: 'Junior' };

    const response = await request(app)
      .post('/record')
      .send([newRecord]);

    expect(response.status).toBe(201);
    expect(mockCollection.insertMany).toHaveBeenCalledWith([newRecord]);
  });

  it('should update a record', async () => {
    const updatedData = { name: 'Jane Smith', position: 'Senior Developer' };

    const response = await request(app)
      .patch('/record/123')
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: expect.any(Object) },
      {
        $set: updatedData,
      }
    );
  });

  it('should delete a record', async () => {
    const response = await request(app).delete('/record/123');

    expect(response.status).toBe(200);
    expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: expect.any(Object) });
  });
});
