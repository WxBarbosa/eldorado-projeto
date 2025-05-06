// Aumentar o timeout para testes de integração
jest.setTimeout(10000);

jest.mock('mysql2', () => {
    const mockConnection = {
        query: jest.fn().mockResolvedValue([]),
        end: jest.fn().mockResolvedValue(),
        on: jest.fn(),
        connect: jest.fn().mockImplementation((callback) => callback(null))
    };

    return {
        createConnection: jest.fn(() => mockConnection)
    };
});