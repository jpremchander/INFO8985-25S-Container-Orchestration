// __mocks__/mongodb.js
export const MongoClient = jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    db: jest.fn(() => ({
      collection: jest.fn().mockReturnValue({
        find: jest.fn(),
        insertMany: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
      }),
    })),
  }));
  
  export const ServerApiVersion = {
    v1: 'v1',
  };
  